const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

async function loadRealtimeAudio() {
  const source = read('app/utils/realtimeAudio.js');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

test('uses the installed V5 VAD API and self-hosted runtime assets', async () => {
  const { REALTIME_VAD_OPTIONS } = await loadRealtimeAudio();

  assert.deepEqual(
    {
      model: REALTIME_VAD_OPTIONS.model,
      baseAssetPath: REALTIME_VAD_OPTIONS.baseAssetPath,
      onnxWASMBasePath: REALTIME_VAD_OPTIONS.onnxWASMBasePath,
    },
    { model: 'v5', baseAssetPath: '/vad/', onnxWASMBasePath: '/vad/' },
  );
  assert.equal(REALTIME_VAD_OPTIONS.redemptionMs, 384);
  assert.equal(REALTIME_VAD_OPTIONS.preSpeechPadMs, 256);
  assert.equal(REALTIME_VAD_OPTIONS.minSpeechMs, 160);

  for (const obsolete of ['frameSamples', 'redemptionFrames', 'preSpeechPadFrames', 'minSpeechFrames']) {
    assert.equal(obsolete in REALTIME_VAD_OPTIONS, false, `${obsolete} is ignored by vad-react 0.0.36`);
  }

  for (const asset of [
    'public/vad/silero_vad_v5.onnx',
    'public/vad/vad.worklet.bundle.min.js',
    'public/vad/ort-wasm-simd-threaded.mjs',
    'public/vad/ort-wasm-simd-threaded.wasm',
  ]) {
    assert.equal(fs.existsSync(path.join(root, asset)), true, `missing ${asset}`);
  }
});

test('mounts voice independently of humanoid readiness and renders no microphone button', () => {
  const overlay = read('app/components/homepage/hero-section/avatar-face-overlay.jsx');

  assert.match(overlay, /const voiceSessionImport = import\(['"]\.\/avatar-voice-session['"]\)/);
  assert.match(overlay, /useEffect\(\(\) => \{\s*loadVoiceSession\(\);/);
  assert.match(overlay, /const handleAvatarReady = useCallback\(\(\) => \{\s*setStage\(['"]ready['"]\);\s*\}/);
  assert.match(overlay, /AvatarVoiceSession/);
  assert.doesNotMatch(overlay, /useMicVAD|socket\.io-client|onnxruntime-web/);
  assert.doesNotMatch(overlay, /<button|FaMicrophone|toggleListening/);
});

test('hands-free session preserves the guest websocket contract and strict turn gates', () => {
  const session = read('app/components/homepage/hero-section/avatar-voice-session.jsx');

  assert.match(session, /wss:\/\/ai\.kakhki\.me\/ai\?guest=true/);
  assert.match(session, /path:\s*['"]\/socket_io['"]/);
  assert.match(session, /transports:\s*\[['"]websocket['"]\]/);
  assert.match(session, /withCredentials:\s*false/);
  assert.match(session, /socket\.emit\(['"]audio-stream['"],\s*pcm16\)/);
  assert.match(session, /audio-received/);
  assert.match(session, /audio-chunk/);
  assert.match(session, /responseCompleted/);
  assert.match(session, /audio-response/);
  assert.match(session, /awaitingResponseRef\.current/);
  assert.match(session, /turnCompletedRef\.current/);
  assert.match(session, /playbackQueue\.isBusy\(\)/);
  assert.match(session, /startOnLoad:\s*false/);
  assert.match(session, /visibilitychange/);
  assert.match(session, /pagehide/);
  assert.match(session, /pageVisibleRef/);
  assert.doesNotMatch(session, /connectionStateRef\.current !== ['"]connected['"]/);
  assert.doesNotMatch(session, /<button|toggleListening/);
});

test('avatar canvas drives real VRM mouth presets from playback amplitude', () => {
  const canvas = read('app/components/homepage/hero-section/avatar-face-canvas.jsx');

  assert.match(canvas, /voiceAnalyserRef/);
  assert.match(canvas, /getByteTimeDomainData/);
  assert.match(canvas, /setValue\(['"]aa['"]/);
  assert.match(canvas, /setValue\(['"]oh['"]/);
  assert.match(canvas, /mouthTarget/);
});

test('production CSP allows self-hosted WebAssembly while keeping eval disabled', () => {
  const security = read('middleware-security.js');

  assert.match(security, /'wasm-unsafe-eval'/);
  assert.doesNotMatch(security, /NODE_ENV === ['"]production['"][^\n]*unsafe-eval/);
});

test('playback reset aborts active media and prevents stale completion', async () => {
  const { createAudioChunkQueue } = await loadRealtimeAudio();
  let resolvePlay;
  let completed = 0;
  let aborts = 0;
  const queue = createAudioChunkQueue({
    play: () => ({
      finished: new Promise((resolve) => {
        resolvePlay = resolve;
      }),
      abort: () => {
        aborts += 1;
        resolvePlay();
      },
    }),
    onPlaybackComplete: () => {
      completed += 1;
    },
  });

  queue.startTurn();
  queue.addChunk('old-turn');
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(queue.isBusy(), true);

  queue.reset();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(aborts, 1);
  assert.equal(queue.isBusy(), false);
  assert.equal(completed, 0);
});

test('a gesture-blocked chunk stays queued and resumes exactly once', async () => {
  const { createAudioChunkQueue } = await loadRealtimeAudio();
  let attempts = 0;
  let completed = 0;
  const blocked = Object.assign(new Error('gesture required'), { name: 'NotAllowedError' });
  const queue = createAudioChunkQueue({
    play: () => {
      attempts += 1;
      if (attempts === 1) {
        throw blocked;
      }
      return { finished: Promise.resolve(), abort: () => {} };
    },
    isRecoverableError: (error) => error?.name === 'NotAllowedError',
    onPlaybackComplete: () => {
      completed += 1;
    },
  });

  queue.startTurn();
  queue.addChunk('response');
  queue.completeTurn();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(queue.isBusy(), true);
  assert.equal(completed, 0);

  queue.resumePlayback();
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(attempts, 2);
  assert.equal(completed, 1);
  assert.equal(queue.isBusy(), false);
});
