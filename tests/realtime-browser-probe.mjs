import puppeteer from 'puppeteer';

const target = process.argv[2] || 'http://127.0.0.1:3300/en';
const blockAvatar = process.argv.includes('--block-avatar');
const assertRealtime = process.argv.includes('--assert-realtime');
const assertAvatar = process.argv.includes('--assert-avatar');
const audioFixture = process.env.REALTIME_AUDIO_FIXTURE;
const waitMs = Number(process.env.PROBE_WAIT_MS || 12000);
const headless = process.env.PROBE_HEADLESS !== 'false';

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

  await page.evaluateOnNewDocument(() => {
    window.__micProbe = { calls: 0, constraints: [], errors: [] };
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
  });

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
  const startedAt = Date.now();
  while (Date.now() - startedAt < waitMs) {
    const state = await page.evaluate(() => {
      const overlay = document.querySelector('[data-avatar-stage]');
      return overlay?.innerText?.trim() || null;
    });
    if (state && stateHistory.at(-1)?.state !== state) {
      stateHistory.push({ elapsedMs: Date.now() - startedAt, state });
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
    }
    if (failures.length) {
      console.error(`REALTIME_PROBE_FAILED: ${failures.join('; ')}`);
      process.exitCode = 1;
    }
  }
} finally {
  await browser.close();
}
