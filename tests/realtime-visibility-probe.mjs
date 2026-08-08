import puppeteer from 'puppeteer';

const target = process.argv[2] || 'http://127.0.0.1:3301/en';
const browser = await puppeteer.launch({
  headless: false,
  executablePath: process.env.CHROME_BIN || '/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome',
  args: [
    '--no-sandbox',
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
    '--autoplay-policy=no-user-gesture-required',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--use-file-for-fake-audio-capture=/root/Projects/kakhki.me/tests/fixtures/realtime-probe.wav',
  ],
});

try {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    window.__visibilityProbe = { micCalls: 0, audioStreamFrames: 0 };
    const mediaDevices = navigator.mediaDevices;
    if (mediaDevices?.getUserMedia) {
      const original = mediaDevices.getUserMedia.bind(mediaDevices);
      mediaDevices.getUserMedia = async (constraints) => {
        window.__visibilityProbe.micCalls += 1;
        return original(constraints);
      };
    }
    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function send(data) {
      if (typeof data === 'string' && data.includes('audio-stream')) {
        window.__visibilityProbe.audioStreamFrames += 1;
      }
      return originalSend.call(this, data);
    };
  });

  await page.goto(`${target}${target.includes('?') ? '&' : '?'}visibilityProbe=${Date.now()}`, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  await page.waitForFunction(
    () => document.querySelector('[data-avatar-stage]')?.getAttribute('data-voice-state') === 'listening',
    { timeout: 60000 },
  );
  await new Promise(resolve => setTimeout(resolve, 1000));

  const read = () => page.evaluate(() => {
    const overlay = document.querySelector('[data-avatar-stage]');
    return {
      stage: overlay?.getAttribute('data-avatar-stage') || null,
      voiceState: overlay?.getAttribute('data-voice-state') || null,
      visibility: document.visibilityState,
      probe: { ...window.__visibilityProbe },
    };
  });

  const before = await read();
  const otherPage = await browser.newPage();
  await otherPage.goto('about:blank');
  await otherPage.bringToFront();
  await new Promise(resolve => setTimeout(resolve, 5000));
  const hidden = await read();

  await page.bringToFront();
  await page.waitForFunction(
    () => document.querySelector('[data-avatar-stage]')?.getAttribute('data-voice-state') === 'listening',
    { timeout: 30000 },
  );
  const after = await read();

  console.log(JSON.stringify({ before, hidden, after }, null, 2));

  const failures = [];
  if (!['listening', 'speaking', 'processing', 'playing', 'ready'].includes(before.voiceState)) {
    failures.push(`before state is ${before.voiceState}`);
  }
  if (hidden.voiceState !== 'paused') failures.push(`hidden state is ${hidden.voiceState}`);
  if (hidden.probe.audioStreamFrames !== before.probe.audioStreamFrames) {
    failures.push('audio-stream frames increased while hidden');
  }
  if (after.voiceState !== 'listening') failures.push(`after state is ${after.voiceState}`);
  if (after.probe.micCalls <= hidden.probe.micCalls) failures.push('microphone did not resume after returning visible');

  if (failures.length) {
    console.error(`VISIBILITY_PROBE_FAILED: ${failures.join('; ')}`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
