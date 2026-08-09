// vad-react 0.0.36 forwards millisecond options to vad-web 0.0.30.
// The V5 model has a fixed 512-sample frame size at 16 kHz.
export const REALTIME_VAD_OPTIONS = Object.freeze({
  sampleRate: 16000,
  model: 'v5',
  baseAssetPath: '/vad/',
  onnxWASMBasePath: '/vad/',
  positiveSpeechThreshold: 0.75,
  negativeSpeechThreshold: 0.45,
  redemptionMs: 384,
  preSpeechPadMs: 256,
  minSpeechMs: 160,
});

export function canCommitAudioStart({
  generation,
  currentGeneration,
  mounted,
  autoSession,
  pageVisible,
}) {
  return (
    generation === currentGeneration &&
    mounted &&
    autoSession &&
    pageVisible
  );
}

function audioContextBlockedError(message) {
  const error = new Error(message);
  error.name = 'NotAllowedError';
  return error;
}

export async function ensureAudioContextRunning(
  context,
  { timeoutMs = 2500 } = {},
) {
  if (!context || typeof context.state !== 'string') {
    throw new TypeError('A valid audio context is required');
  }
  if (context.state === 'running') {
    return context;
  }
  if (context.state === 'closed') {
    throw new Error('Audio context is closed');
  }
  if (typeof context.resume !== 'function') {
    throw audioContextBlockedError('Audio context cannot be resumed');
  }

  let timeoutId;
  try {
    await Promise.race([
      Promise.resolve().then(() => context.resume()),
      new Promise((_, reject) => {
        timeoutId = globalThis.setTimeout(() => {
          reject(audioContextBlockedError('Audio context resume timed out'));
        }, timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId !== undefined) {
      globalThis.clearTimeout(timeoutId);
    }
  }

  if (context.state !== 'running') {
    throw audioContextBlockedError('Audio context is not running');
  }
  return context;
}

function resampleLinear(samples, inputRate, outputRate) {
  if (!(samples instanceof Float32Array)) {
    throw new TypeError('samples must be a Float32Array');
  }
  if (inputRate <= 0 || outputRate <= 0) {
    throw new RangeError('sample rates must be positive');
  }

  if (samples.length === 0) {
    return new Float32Array();
  }

  if (inputRate === outputRate) {
    return new Float32Array(samples);
  }

  const outputLength = Math.round((samples.length * outputRate) / inputRate);
  const output = new Float32Array(outputLength);
  const ratio = inputRate / outputRate;

  for (let index = 0; index < outputLength; index += 1) {
    const position = index * ratio;
    const left = Math.floor(position);
    const right = Math.min(left + 1, samples.length - 1);
    const fraction = position - left;
    output[index] = samples[left] * (1 - fraction) + samples[right] * fraction;
  }

  return output;
}

function float32ToPcm16(samples) {
  const buffer = new ArrayBuffer(samples.length * 2);
  const view = new DataView(buffer);

  for (let index = 0; index < samples.length; index += 1) {
    const sample = Math.max(-1, Math.min(1, samples[index]));
    const value = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(index * 2, value, true);
  }

  return buffer;
}

export function speechToPcm16(samples, inputRate = REALTIME_VAD_OPTIONS.sampleRate, outputRate = REALTIME_VAD_OPTIONS.sampleRate) {
  const resampled = resampleLinear(samples, inputRate, outputRate);
  return float32ToPcm16(resampled);
}

export function createAudioChunkQueue({
  play,
  isRecoverableError = () => false,
  onPlaybackStart = () => {},
  onPlaybackComplete = () => {},
  onError = () => {},
}) {
  if (typeof play !== 'function') {
    throw new TypeError('play must be a function');
  }

  let chunks = [];
  let activePlayback = null;
  let playbackPaused = false;
  let streamed = false;
  let playbackStarted = false;
  let playbackCompleteNotified = false;
  let completionReceived = false;
  let turnToken = 0;

  const completeIfReady = (token) => {
    if (
      token === turnToken &&
      completionReceived &&
      !playbackCompleteNotified &&
      !activePlayback &&
      !playbackPaused &&
      chunks.length === 0
    ) {
      playbackCompleteNotified = true;
      onPlaybackComplete();
    }
  };

  const normalizePlayback = (result) => {
    if (result && typeof result.then === 'function') {
      return { finished: result, abort: () => {} };
    }
    if (!result?.finished || typeof result.abort !== 'function') {
      throw new TypeError('play must return { finished: Promise, abort: Function }');
    }
    return result;
  };

  const drain = async (token) => {
    if (activePlayback || playbackPaused || chunks.length === 0) {
      completeIfReady(token);
      return;
    }

    if (!playbackStarted) {
      playbackStarted = true;
      onPlaybackStart();
    }

    while (token === turnToken && chunks.length > 0 && !playbackPaused) {
      const audio = chunks.shift();
      let playback;

      try {
        playback = normalizePlayback(play(audio));
        activePlayback = { ...playback, token };
        await playback.finished;
      } catch (error) {
        if (token !== turnToken) {
          return;
        }

        activePlayback = null;
        if (isRecoverableError(error)) {
          chunks.unshift(audio);
          playbackPaused = true;
          playbackStarted = false;
        } else {
          chunks = [];
          completionReceived = false;
        }
        onError(error);
        return;
      }

      if (token !== turnToken) {
        return;
      }
      activePlayback = null;
    }

    completeIfReady(token);
  };

  const reset = () => {
    turnToken += 1;
    const playback = activePlayback;
    activePlayback = null;
    playbackPaused = false;
    chunks = [];
    streamed = false;
    playbackStarted = false;
    playbackCompleteNotified = false;
    completionReceived = false;
    playback?.abort();
  };

  return {
    startTurn: reset,
    reset,
    isBusy() {
      return Boolean(activePlayback) || playbackPaused || chunks.length > 0;
    },
    resumePlayback() {
      if (!playbackPaused) {
        return;
      }
      playbackPaused = false;
      void drain(turnToken);
    },
    addChunk(audio) {
      if (!audio || completionReceived) {
        return;
      }
      streamed = true;
      chunks.push(audio);
      void drain(turnToken);
    },
    completeTurn(fallbackAudio) {
      if (completionReceived) {
        return;
      }
      completionReceived = true;
      if (!streamed && fallbackAudio) {
        chunks.push(fallbackAudio);
      }
      void drain(turnToken);
      completeIfReady(turnToken);
    },
  };
}
