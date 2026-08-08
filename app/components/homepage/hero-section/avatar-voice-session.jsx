"use client";

import { useCallback, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useMicVAD } from '@ricky0123/vad-react';
import {
  createAudioChunkQueue,
  REALTIME_VAD_OPTIONS,
  speechToPcm16,
} from '@/app/utils/realtimeAudio';
import {
  clearVoiceAnalyser,
  setVoiceAnalyser,
} from '@/app/utils/avatarVoiceAudio';

const SOCKET_URL = 'wss://ai.kakhki.me/ai?guest=true';
const RESPONSE_TIMEOUT_MS = 45000;

function decodeBase64(base64Audio) {
  const binary = window.atob(base64Audio);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes.buffer;
}

function isAutoplayError(error) {
  return error?.name === 'NotAllowedError' || error?.name === 'SecurityError';
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
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error('Web Audio API is unavailable');
      }

      if (!contextRef.current || contextRef.current.state === 'closed') {
        contextRef.current = new AudioContextClass();
      }
      const context = contextRef.current;
      if (context.state === 'suspended') {
        await context.resume();
      }
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
  const vadControlsRef = useRef(null);
  const connectionStateRef = useRef('connecting');
  const responseTimeoutRef = useRef(null);
  const startGenerationRef = useRef(0);
  const playbackBlockedRef = useRef(false);
  const userInteractedRef = useRef(false);
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
    void vadControlsRef.current?.pause?.();
  }, []);

  const startListening = useCallback(async () => {
    if (
      !mountedRef.current ||
      !autoSessionRef.current ||
      awaitingResponseRef.current
    ) {
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
    setVoiceState('requestingMic');
    try {
      await controls.start();
      if (
        generation !== startGenerationRef.current ||
        !mountedRef.current ||
        !autoSessionRef.current
      ) {
        await controls.pause?.();
        return;
      }
      vadListeningRef.current = true;
      setVoiceState('listening');
    } catch (error) {
      if (generation !== startGenerationRef.current || !mountedRef.current) {
        return;
      }
      console.error('Failed to start microphone VAD:', error);
      setVoiceState(isAutoplayError(error) ? 'blocked' : 'error');
      autoSessionRef.current = isAutoplayError(error) ? false : true;
    }
  }, [setVoiceState]);

  const handlePlaybackError = useCallback((error) => {
    if (!mountedRef.current) {
      return;
    }
    clearResponseTimeout();
    awaitingResponseRef.current = false;
    if (isAutoplayError(error)) {
      playbackBlockedRef.current = true;
      autoSessionRef.current = false;
      setVoiceState('blocked');
      return;
    }
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
    if (playbackBlockedRef.current && !userInteractedRef.current) {
      autoSessionRef.current = false;
      setVoiceState('blocked');
      return;
    }
    setVoiceState('ready');
    void startListening();
  }, [clearResponseTimeout, setVoiceState, startListening]);

  if (!playbackQueueRef.current) {
    playbackQueueRef.current = createAudioChunkQueue({
      play: (audio) => createPlayback(audio, audioContextRef),
      isRecoverableError: isAutoplayError,
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
    startOnLoad: true,
    model: REALTIME_VAD_OPTIONS.model,
    baseAssetPath: REALTIME_VAD_OPTIONS.baseAssetPath,
    onnxWASMBasePath: REALTIME_VAD_OPTIONS.onnxWASMBasePath,
    positiveSpeechThreshold: REALTIME_VAD_OPTIONS.positiveSpeechThreshold,
    negativeSpeechThreshold: REALTIME_VAD_OPTIONS.negativeSpeechThreshold,
    redemptionMs: REALTIME_VAD_OPTIONS.redemptionMs,
    preSpeechPadMs: REALTIME_VAD_OPTIONS.preSpeechPadMs,
    minSpeechMs: REALTIME_VAD_OPTIONS.minSpeechMs,
    onSpeechStart: () => {
      if (!mountedRef.current || awaitingResponseRef.current) {
        return;
      }
      clearResponseTimeout();
      turnCompletedRef.current = false;
      playbackBlockedRef.current = false;
      vadListeningRef.current = true;
      playbackQueueRef.current?.startTurn();
      setVoiceState('speaking');
    },
    onVADMisfire: () => {
      vadListeningRef.current = false;
      setVoiceState('ready');
      void startListening();
    },
    onSpeechEnd: async (speech) => {
      const socket = socketRef.current;
      vadListeningRef.current = false;
      if (!socket?.connected || !speech?.length) {
        setVoiceState('ready');
        void startListening();
        return;
      }

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
  }, [vad.start, vad.pause]);

  useEffect(() => {
    if (!vad.loading && !vad.errored && connectionStateRef.current === 'connected') {
      void startListening();
    }
    if (vad.errored) {
      setVoiceState('error');
    }
  }, [vad.errored, vad.loading, startListening, setVoiceState]);

  useEffect(() => {
    const resumeFromGesture = () => {
      userInteractedRef.current = true;
      playbackBlockedRef.current = false;
      autoSessionRef.current = true;
      playbackQueue.resumePlayback();
      void audioContextRef.current?.resume?.();
      void startListening();
    };
    const events = ['pointerdown', 'touchstart', 'keydown'];
    events.forEach((event) => window.addEventListener(event, resumeFromGesture, { capture: true, passive: true }));
    return () => events.forEach((event) => window.removeEventListener(event, resumeFromGesture, { capture: true }));
  }, [playbackQueue, startListening]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      path: '/socket_io',
      transports: ['websocket'],
      withCredentials: false,
      autoConnect: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      connectionStateRef.current = 'connected';
      autoSessionRef.current = true;
      awaitingResponseRef.current = false;
      turnCompletedRef.current = false;
      clearResponseTimeout();
      playbackQueue.reset();
      setVoiceState('ready');
      void startListening();
    });
    socket.on('disconnect', () => {
      connectionStateRef.current = 'disconnected';
      autoSessionRef.current = false;
      awaitingResponseRef.current = false;
      turnCompletedRef.current = false;
      clearResponseTimeout();
      stopVad();
      playbackQueue.reset();
      setVoiceState('error');
    });
    socket.on('connect_error', () => {
      connectionStateRef.current = 'disconnected';
      autoSessionRef.current = false;
      setVoiceState('error');
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

    return () => {
      mountedRef.current = false;
      connectionStateRef.current = 'disconnected';
      clearResponseTimeout();
      stopVad();
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
