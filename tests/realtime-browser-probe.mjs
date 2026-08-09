import puppeteer from 'puppeteer';

const target = process.argv[2] || 'http://127.0.0.1:3300/en';
const blockAvatar = process.argv.includes('--block-avatar');
const assertRealtime = process.argv.includes('--assert-realtime');
const assertAvatar = process.argv.includes('--assert-avatar');
const audioFixture = process.env.REALTIME_AUDIO_FIXTURE;
const waitMs = Number(process.env.PROBE_WAIT_MS || 12000);
const headless = process.env.PROBE_HEADLESS !== 'false';
const simulateBlockedAudio = process.env.PROBE_SIMULATE_BLOCKED_AUDIO === 'true';
const blockedAudioPhase = process.env.PROBE_BLOCK_AUDIO_PHASE || 'startup';

const browser = await puppeteer.launch({
  headless,
  executablePath: process.env.CHROME_BIN || '/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
    '--autoplay-policy=no-user-gesture-required',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    ...(audioFixture ? [`--use-file-for-fake-audio-capture=${audioFixture}`] : []),
  ],
});

try {
  const page = await browser.newPage();
  const events = [];
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  cdp.on('Network.webSocketCreated', ({ url }) => {
    events.push({ type: 'websocket-created', url });
  });
  cdp.on('Network.webSocketFrameReceived', ({ response }) => {
    events.push({ type: 'websocket-frame', opcode: response.opcode, bytes: response.payloadData?.length || 0 });
  });

  await page.evaluateOnNewDocument((blockAudioOutput, blockPhase) => {
    window.__micProbe = { calls: 0, constraints: [], errors: [] };
    window.__blockedAudioProbe = {
      enabled: blockAudioOutput,
      phase: blockPhase,
      armed: blockAudioOutput && blockPhase === 'startup',
      consumed: blockAudioOutput && blockPhase === 'startup',
      outputContextCreated: false,
      resumeCalls: 0,
      released: false,
    };

    if (blockAudioOutput) {
      const NativeAudioContext = window.AudioContext || window.webkitAudioContext;
      let contextCount = 0;
      let blocked = blockPhase === 'startup';
      let consumed = blockPhase === 'startup';
      const resumeWaiters = [];

      class ProbeAudioContext extends NativeAudioContext {
        constructor(...args) {
          super(...args);
          contextCount += 1;
          this.__probeOutputContext = contextCount === 2;
          if (this.__probeOutputContext) {
            window.__blockedAudioProbe.outputContextCreated = true;
          }
        }

        get state() {
          if (this.__probeOutputContext && blocked) {
            return 'suspended';
          }
          return super.state;
        }

        resume() {
          if (this.__probeOutputContext && blocked) {
            window.__blockedAudioProbe.resumeCalls += 1;
            return new Promise((resolve) => resumeWaiters.push(resolve));
          }
          return super.resume();
        }
      }

      const releaseAudioOutput = () => {
        if (!blocked) return;
        blocked = false;
        window.__blockedAudioProbe.released = true;
        resumeWaiters.splice(0).forEach((resolve) => resolve());
      };
      window.__armBlockedAudioProbe = () => {
        if (consumed) return;
        consumed = true;
        blocked = true;
        window.__blockedAudioProbe.armed = true;
        window.__blockedAudioProbe.consumed = true;
      };
      window.addEventListener('pointerdown', releaseAudioOutput, { capture: true });
      window.AudioContext = ProbeAudioContext;
      window.webkitAudioContext = ProbeAudioContext;
    }

    const mediaDevices = navigator.mediaDevices;
    if (!mediaDevices?.getUserMedia) return;
    const original = mediaDevices.getUserMedia.bind(mediaDevices);
    mediaDevices.getUserMedia = async (constraints) => {
      window.__micProbe.calls += 1;
      window.__micProbe.constraints.push(constraints);
      try {
        return await original(constraints);
      } catch (error) {
        window.__micProbe.errors.push({ name: error?.name, message: error?.message });
        throw error;
      }
    };
  }, simulateBlockedAudio, blockedAudioPhase);

  if (blockAvatar) {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (request.url().includes('/avatar/kakhki-robot.vrm')) {
        events.push({ type: 'blocked-avatar', url: request.url() });
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  page.on('console', (message) => events.push({ type: 'console', level: message.type(), text: message.text() }));
  page.on('pageerror', (error) => events.push({ type: 'pageerror', text: error.message }));
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('/vad/') || url.includes('/socket_io')) {
      events.push({ type: 'request', resource: request.resourceType(), url });
    }
  });
  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/vad/') || url.includes('/socket_io')) {
      events.push({ type: 'response', status: response.status(), url });
    }
  });

  await page.setCacheEnabled(false);
  await page.goto(`${target}${target.includes('?') ? '&' : '?'}probe=${Date.now()}`, { waitUntil: 'networkidle2', timeout: 60000 });
  const stateHistory = [];
  let recoveryClicked = false;
  const startedAt = Date.now();
  while (Date.now() - startedAt < waitMs) {
    const state = await page.evaluate(() => {
      const overlay = document.querySelector('[data-avatar-stage]');
      return overlay?.innerText?.trim() || null;
    });
    if (state && stateHistory.at(-1)?.state !== state) {
      stateHistory.push({ elapsedMs: Date.now() - startedAt, state });
    }
    if (simulateBlockedAudio && blockedAudioPhase === 'playback' && state?.includes('processing')) {
      await page.evaluate(() => window.__armBlockedAudioProbe?.());
    }
    if (simulateBlockedAudio && !recoveryClicked && state?.includes('blocked')) {
      recoveryClicked = true;
      await page.mouse.click(10, 10);
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  const result = await page.evaluate(async () => {
    let permission = 'unavailable';
    try {
      permission = (await navigator.permissions.query({ name: 'microphone' })).state;
    } catch {}
    const overlay = document.querySelector('[data-avatar-stage]');
    return {
      url: location.href,
      secureContext: window.isSecureContext,
      permission,
      mic: window.__micProbe,
      blockedAudio: window.__blockedAudioProbe,
      avatarStage: overlay?.getAttribute('data-avatar-stage') || null,
      voiceState: overlay?.innerText?.trim() || null,
      canvasCount: overlay?.querySelectorAll('canvas').length || 0,
    };
  });

  const report = { result, stateHistory, events };
  console.log(JSON.stringify(report, null, 2));

  if (assertRealtime) {
    const vadRequests = events.filter((event) => event.type === 'response' && event.url.includes('/vad/') && event.status === 200);
    const socketAttempt = events.some((event) => event.url?.includes('/socket_io'));
    const failures = [];
    if (result.mic.calls < 1) failures.push('getUserMedia was never called');
    if (vadRequests.length < 3) failures.push(`only ${vadRequests.length} successful VAD asset responses`);
    if (!socketAttempt) failures.push('guest Socket.IO connection was never attempted');
    if (assertAvatar && result.avatarStage !== 'ready') failures.push(`humanoid stage is ${result.avatarStage}`);
    if (audioFixture) {
      const states = stateHistory.map((entry) => entry.state).join(' | ');
      for (const expected of ['speaking', 'processing', 'playing', 'listening']) {
        if (!states.includes(expected)) failures.push(`missing visible ${expected} state`);
      }
      if (simulateBlockedAudio) {
        const blockedIndex = stateHistory.findIndex((entry) => entry.state?.includes('blocked'));
        const playingAfterBlocked = stateHistory.findIndex(
          (entry, index) => index > blockedIndex && entry.state?.includes('playing'),
        );
        const listeningAfterPlayback = stateHistory.findIndex(
          (entry, index) => index > playingAfterBlocked && entry.state?.includes('listening'),
        );
        if (blockedIndex < 0) failures.push('stalled audio context never reached blocked recovery state');
        if (!result.blockedAudio?.outputContextCreated) failures.push('probe did not intercept the output audio context');
        if (!result.blockedAudio?.armed || result.blockedAudio?.resumeCalls < 1) failures.push('probe did not suspend audio output');
        if (!recoveryClicked || !result.blockedAudio?.released) failures.push('pointer gesture did not release blocked audio');
        if (playingAfterBlocked < 0) failures.push('audio did not play after blocked-context recovery');
        if (listeningAfterPlayback < 0) failures.push('VAD did not re-arm after recovered playback');
      }
    }
    if (failures.length) {
      console.error(`REALTIME_PROBE_FAILED: ${failures.join('; ')}`);
      process.exitCode = 1;
    }
  }
} finally {
  await browser.close();
}
