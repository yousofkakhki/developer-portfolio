"use client";

import { useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useMicVAD } from '@ricky0123/vad-react';
import {
  canCommitAudioStart,
  canEmitVadAudio,
  canProcessVadCallback,
  createAudioChunkQueue,
  ensureAudioContextRunning,
  REALTIME_VAD_OPTIONS,
  speechToPcm16,
} from '@/app/utils/realtimeAudio';
import {
  clearVoiceAnalyser,
  setVoiceAnalyser,
} from '@/app/utils/avatarVoiceAudio';

const SOCKET_URL = 'wss://ai.kakhki.me/ai?guest=true';
const RESPONSE_TIMEOUT_MS = 45000;
const AUDIO_CONTEXT_RESUME_TIMEOUT_MS = 2500;

function decodeBase64(base64Audio) {
  const binary = window.atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

function isRecoverableAudioAccessError(error) {
  return [
    'AbortError',
    'NotAllowedError',
    'NotFoundError',
    'NotReadableError',
    'SecurityError',
  ].includes(error?.name);
}

async function prepareAudioOutput(contextRef) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    throw new Error('Web Audio API is unavailable');
  }
  if (!contextRef.current || contextRef.current.state === 'closed') {
    contextRef.current = new AudioContextClass();
  }
  return ensureAudioContextRunning(contextRef.current, {
    timeoutMs: AUDIO_CONTEXT_RESUME_TIMEOUT_MS,
  });
}

function createPlayback(audioBase64, contextRef) {
  let source = null;
  let analyser = null;
  let cancelled = false;
  let resolveFinished;
  let rejectFinished;

  const finished = new Promise((resolve, reject) => {
    resolveFinished = resolve;
    rejectFinished = reject;
  });

  const abort = () => {
    cancelled = true;
    if (source) {
      try {
        source.stop();
      } catch {
        // The source may already have ended.
      }
      source.disconnect();
      source = null;
    }
    if (analyser) {
      clearVoiceAnalyser(analyser);
      analyser.disconnect();
      analyser = null;
    }
    resolveFinished();
  };

  (async () => {
    try {
      const context = await prepareAudioOutput(contextRef);
      if (cancelled) {
        return;
      }

      const buffer = await context.decodeAudioData(decodeBase64(audioBase64));
      if (cancelled) {
        return;
      }

      source = context.createBufferSource();
      analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.7;
      source.buffer = buffer;
      source.connect(analyser);
      analyser.connect(context.destination);
      setVoiceAnalyser(analyser);

      source.onended = () => {
        if (analyser) {
          clearVoiceAnalyser(analyser);
          analyser.disconnect();
          analyser = null;
        }
        if (source) {
          source.disconnect();
          source = null;
        }
        resolveFinished();
      };
      source.start(0);
    } catch (error) {
      if (!cancelled) {
        rejectFinished(error);
      }
    }
  })();

  return { finished, abort };
}

export function AvatarVoiceSession({ onStateChange }) {
  const socketRef = useRef(null);
  const audioContextRef = useRef(null);
  const playbackQueueRef = useRef(null);
  const mountedRef = useRef(true);
  const autoSessionRef = useRef(true);
  const awaitingResponseRef = useRef(false);
  const turnCompletedRef = useRef(false);
  const vadListeningRef = useRef(false);
  const vadStartingRef = useRef(false);
  const vadRestartPendingRef = useRef(false);
  const vadControlsRef = useRef(null);
  const vadReadyRef = useRef(false);
  const connectionStateRef = useRef('starting');
  const responseTimeoutRef = useRef(null);
  const startGenerationRef = useRef(0);
  const playbackBlockedRef = useRef(false);
  const pageVisibleRef = useRef(
    typeof document === 'undefined' || document.visibilityState === 'visible',
  );
  const vadPausePromiseRef = useRef(Promise.resolve());
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  const setVoiceState = useCallback((state) => {
    onStateChangeRef.current?.(state);
  }, []);

  const clearResponseTimeout = useCallback(() => {
    if (responseTimeoutRef.current !== null) {
      window.clearTimeout(responseTimeoutRef.current);
      responseTimeoutRef.current = null;
    }
  }, []);

  const stopVad = useCallback(() => {
    startGenerationRef.current += 1;
    vadListeningRef.current = false;
    vadPausePromiseRef.current = Promise.resolve(
      vadControlsRef.current?.pause?.(),
    ).catch(() => {});
  }, []);

  const startListening = useCallback(async () => {
    if (
      vadStartingRef.current ||
      !mountedRef.current ||
      !autoSessionRef.current ||
      !pageVisibleRef.current ||
      document.visibilityState !== 'visible' ||
      !vadReadyRef.current ||
      awaitingResponseRef.current
    ) {
      if (
        vadStartingRef.current &&
        mountedRef.current &&
        autoSessionRef.current &&
        pageVisibleRef.current &&
        document.visibilityState === 'visible'
      ) {
        vadRestartPendingRef.current = true;
      }
      return;
    }

    const playbackQueue = playbackQueueRef.current;
    if (playbackQueue && playbackQueue.isBusy()) {
      return;
    }
    if (vadListeningRef.current) {
      return;
    }

    const controls = vadControlsRef.current;
    if (!controls?.start) {
      return;
    }

    const generation = ++startGenerationRef.current;
    vadStartingRef.current = true;
    vadRestartPendingRef.current = false;
    let microphoneStarted = false;
    const canCommitStart = () => canCommitAudioStart({
      generation,
      currentGeneration: startGenerationRef.current,
      mounted: mountedRef.current,
      autoSession: autoSessionRef.current,
      pageVisible:
        pageVisibleRef.current && document.visibilityState === 'visible',
      transportConnected: connectionStateRef.current === 'connected',
      awaitingResponse: awaitingResponseRef.current,
      playbackBusy: Boolean(playbackQueueRef.current?.isBusy()),
    });
    setVoiceState('requestingMic');
    try {
      await vadPausePromiseRef.current;
      if (!canCommitStart()) {
        return;
      }
      await controls.start();
      microphoneStarted = true;
      if (!canCommitStart()) {
        await controls.pause?.();
        return;
      }
      await prepareAudioOutput(audioContextRef);
      if (!canCommitStart()) {
        await controls.pause?.();
        return;
      }
      vadListeningRef.current = true;
      setVoiceState('listening');
    } catch (error) {
      if (microphoneStarted) {
        try {
          await controls.pause?.();
        } catch {
          // The VAD stream may already be stopped.
        }
      }
      if (generation !== startGenerationRef.current || !mountedRef.current) {
        return;
      }
      vadListeningRef.current = false;
      awaitingResponseRef.current = false;
      turnCompletedRef.current = true;
      playbackQueueRef.current?.reset();
      const playbackBlocked = isRecoverableAudioAccessError(error);
      if (playbackBlocked) {
        // Microphone and autoplay permission are device decisions, not page failures.
        console.info('Hands-free voice session is awaiting microphone or audio permission.');
      } else {
        console.error('Failed to start hands-free voice session:', error);
      }
      playbackBlockedRef.current = playbackBlocked;
      setVoiceState(playbackBlocked ? 'blocked' : 'error');
      autoSessionRef.current = playbackBlocked ? false : true;
    } finally {
      vadStartingRef.current = false;
      if (
        vadRestartPendingRef.current &&
        mountedRef.current &&
        autoSessionRef.current &&
        pageVisibleRef.current &&
        document.visibilityState === 'visible'
      ) {
        vadRestartPendingRef.current = false;
        window.setTimeout(() => void startListening(), 0);
      }
    }
  }, [setVoiceState]);

  const handlePlaybackError = useCallback((error) => {
    if (!mountedRef.current) {
      return;
    }
    if (isRecoverableAudioAccessError(error)) {
      playbackBlockedRef.current = true;
      autoSessionRef.current = false;
      setVoiceState('blocked');
      return;
    }
    clearResponseTimeout();
    awaitingResponseRef.current = false;
    console.error('AI audio playback failed:', error);
    setVoiceState('error');
    window.setTimeout(() => {
      void startListening();
    }, 350);
  }, [clearResponseTimeout, setVoiceState, startListening]);

  const handlePlaybackComplete = useCallback(() => {
    if (!mountedRef.current) {
      return;
    }
    clearResponseTimeout();
    awaitingResponseRef.current = false;
    if (playbackBlockedRef.current) {
      autoSessionRef.current = false;
      setVoiceState('blocked');
      return;
    }
    if (!pageVisibleRef.current) {
      setVoiceState('paused');
      return;
    }
    setVoiceState('ready');
    void startListening();
  }, [clearResponseTimeout, setVoiceState, startListening]);

  if (!playbackQueueRef.current) {
    playbackQueueRef.current = createAudioChunkQueue({
      play: (audio) => createPlayback(audio, audioContextRef),
      isRecoverableError: isRecoverableAudioAccessError,
      onPlaybackStart: () => setVoiceState('playing'),
      onPlaybackComplete: handlePlaybackComplete,
      onError: handlePlaybackError,
    });
  }

  const playbackQueue = playbackQueueRef.current;

  const handleAssistantCompletion = useCallback((payload = {}) => {
    if (!awaitingResponseRef.current || turnCompletedRef.current) {
      return;
    }
    turnCompletedRef.current = true;
    clearResponseTimeout();
    const fallbackAudio = typeof payload === 'string' ? payload : payload?.audio;
    playbackQueueRef.current?.completeTurn(fallbackAudio);
  }, [clearResponseTimeout]);

  const vad = useMicVAD({
    startOnLoad: false,
    model: REALTIME_VAD_OPTIONS.model,
    baseAssetPath: REALTIME_VAD_OPTIONS.baseAssetPath,
    onnxWASMBasePath: REALTIME_VAD_OPTIONS.onnxWASMBasePath,
    positiveSpeechThreshold: REALTIME_VAD_OPTIONS.positiveSpeechThreshold,
    negativeSpeechThreshold: REALTIME_VAD_OPTIONS.negativeSpeechThreshold,
    redemptionMs: REALTIME_VAD_OPTIONS.redemptionMs,
    preSpeechPadMs: REALTIME_VAD_OPTIONS.preSpeechPadMs,
    minSpeechMs: REALTIME_VAD_OPTIONS.minSpeechMs,
    onSpeechStart: () => {
      if (!canProcessVadCallback({
        mounted: mountedRef.current,
        pageVisible: pageVisibleRef.current,
        documentVisible: document.visibilityState === 'visible',
        vadListening: vadListeningRef.current,
        awaitingResponse: awaitingResponseRef.current,
      })) {
        return;
      }
      clearResponseTimeout();
      turnCompletedRef.current = false;
      playbackBlockedRef.current = false;
      playbackQueueRef.current?.startTurn();
      setVoiceState('speaking');
    },
    onVADMisfire: () => {
      if (!canProcessVadCallback({
        mounted: mountedRef.current,
        pageVisible: pageVisibleRef.current,
        documentVisible: document.visibilityState === 'visible',
        vadListening: vadListeningRef.current,
        awaitingResponse: awaitingResponseRef.current,
      })) {
        return;
      }
      vadListeningRef.current = false;
      setVoiceState('ready');
      void startListening();
    },
    onSpeechEnd: async (speech) => {
      const socket = socketRef.current;
      const documentVisible = document.visibilityState === 'visible';
      if (!pageVisibleRef.current || !documentVisible) {
        stopVad();
        setVoiceState('paused');
        return;
      }
      if (!canProcessVadCallback({
        mounted: mountedRef.current,
        pageVisible: pageVisibleRef.current,
        documentVisible,
        vadListening: vadListeningRef.current,
        awaitingResponse: awaitingResponseRef.current,
      })) {
        return;
      }
      if (!canEmitVadAudio({
        mounted: mountedRef.current,
        pageVisible: pageVisibleRef.current,
        documentVisible,
        vadListening: vadListeningRef.current,
        awaitingResponse: awaitingResponseRef.current,
        transportConnected: Boolean(socket?.connected),
        speechLength: speech?.length || 0,
      })) {
        if (!pageVisibleRef.current || !documentVisible) {
          stopVad();
          setVoiceState('paused');
        }
        return;
      }
      vadListeningRef.current = false;

      stopVad();
      clearResponseTimeout();
      awaitingResponseRef.current = true;
      turnCompletedRef.current = false;
      playbackQueueRef.current?.startTurn();
      setVoiceState('processing');

      try {
        const pcm16 = speechToPcm16(speech, REALTIME_VAD_OPTIONS.sampleRate, REALTIME_VAD_OPTIONS.sampleRate);
        socket.emit('audio-stream', pcm16);
      } catch (error) {
        console.error('Could not prepare microphone audio:', error);
        awaitingResponseRef.current = false;
        setVoiceState('error');
        void startListening();
        return;
      }

      responseTimeoutRef.current = window.setTimeout(() => {
        if (!mountedRef.current || !awaitingResponseRef.current) {
          return;
        }
        awaitingResponseRef.current = false;
        turnCompletedRef.current = false;
        playbackQueueRef.current?.reset();
        setVoiceState('error');
        socket.disconnect();
        socket.connect();
      }, RESPONSE_TIMEOUT_MS);
    },
  });

  useEffect(() => {
    vadControlsRef.current = { start: vad.start, pause: vad.pause };
    vadReadyRef.current = !vad.loading && !vad.errored;
  }, [vad.errored, vad.loading, vad.start, vad.pause]);

  useEffect(() => {
    if (
      !vad.loading &&
      !vad.errored &&
      pageVisibleRef.current &&
      connectionStateRef.current === 'connected'
    ) {
      void startListening();
    }
    if (vad.errored) {
      vadReadyRef.current = false;
      setVoiceState('error');
    }
  }, [vad.errored, vad.loading, startListening, setVoiceState]);

  useEffect(() => {
    const updateVisibility = (visible) => {
      const pageIsVisible = visible && document.visibilityState === 'visible';
      pageVisibleRef.current = pageIsVisible;
      if (!pageIsVisible) {
        autoSessionRef.current = false;
        vadRestartPendingRef.current = false;
        stopVad();
        socketRef.current?.disconnect();
        setVoiceState('paused');
        return;
      }

      if (!mountedRef.current) {
        return;
      }
      autoSessionRef.current = true;
      if (socketRef.current && !socketRef.current.connected) {
        connectionStateRef.current = 'starting';
        setVoiceState('starting');
        socketRef.current.connect();
        return;
      }
      if (
        !awaitingResponseRef.current &&
        connectionStateRef.current === 'connected'
      ) {
        void startListening();
      }
    };

    const handleVisibilityChange = () => {
      updateVisibility(document.visibilityState === 'visible');
    };
    const handlePageHide = () => updateVisibility(false);
    const handlePageShow = () => updateVisibility(document.visibilityState === 'visible');

    pageVisibleRef.current = document.visibilityState === 'visible';
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [setVoiceState, startListening, stopVad]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: '/socket_io',
      transports: ['websocket'],
      withCredentials: false,
      autoConnect: false,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      connectionStateRef.current = 'connected';
      autoSessionRef.current = pageVisibleRef.current;
      awaitingResponseRef.current = false;
      turnCompletedRef.current = false;
      clearResponseTimeout();
      playbackQueue.reset();
      setVoiceState(pageVisibleRef.current ? 'ready' : 'paused');
      if (pageVisibleRef.current) {
        void startListening();
      }
    });
    socket.on('disconnect', () => {
      connectionStateRef.current = 'disconnected';
      autoSessionRef.current = false;
      awaitingResponseRef.current = false;
      turnCompletedRef.current = false;
      clearResponseTimeout();
      stopVad();
      playbackQueue.reset();
      if (mountedRef.current) {
        setVoiceState(pageVisibleRef.current ? 'error' : 'paused');
      }
    });
    socket.on('connect_error', () => {
      connectionStateRef.current = 'disconnected';
      autoSessionRef.current = false;
      if (pageVisibleRef.current) {
        setVoiceState('error');
      }
    });
    socket.on('audio-received', () => {
      if (awaitingResponseRef.current) setVoiceState('processing');
    });
    socket.on('audio-chunk', (payload) => {
      if (!awaitingResponseRef.current) return;
      const audio = typeof payload === 'string' ? payload : payload?.audio;
      if (audio) playbackQueue.addChunk(audio);
    });
    socket.on('audio-response', handleAssistantCompletion);
    socket.on('responseCompleted', handleAssistantCompletion);
    socket.on('error', handlePlaybackError);
    setVoiceState('starting');
    socket.connect();

    return () => {
      mountedRef.current = false;
      connectionStateRef.current = 'disconnected';
      clearResponseTimeout();
      stopVad();
      socket.removeAllListeners();
      socket.disconnect();
      playbackQueue.reset();
      clearVoiceAnalyser();
      audioContextRef.current?.close?.().catch(() => {});
      audioContextRef.current = null;
    };
  }, [clearResponseTimeout, handleAssistantCompletion, handlePlaybackError, playbackQueue, setVoiceState, startListening, stopVad]);

  return null;
}

export default AvatarVoiceSession;
