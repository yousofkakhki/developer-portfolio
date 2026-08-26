"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const AVATAR_VISUAL_ENABLED = process.env.NEXT_PUBLIC_ENABLE_VRM_AVATAR !== 'false';
const AVATAR_TRANSITION_DELAY_MS = 3200;
const AVATAR_TRANSITION_DURATION_MS = 900;

const VOICE_STATUS_STYLES = {
  starting: {
    dotClass: 'bg-amber-300',
    ringClass: 'border-amber-300/40 bg-slate-950/80 text-amber-100',
  },
  requestingMic: {
    dotClass: 'bg-amber-300 animate-pulse',
    ringClass: 'border-amber-300/40 bg-slate-950/80 text-amber-100',
  },
  ready: {
    dotClass: 'bg-cyan-300',
    ringClass: 'border-cyan-300/40 bg-slate-950/80 text-cyan-100',
  },
  listening: {
    dotClass: 'bg-emerald-400 animate-pulse',
    ringClass: 'border-emerald-300/45 bg-slate-950/80 text-emerald-100',
  },
  speaking: {
    dotClass: 'bg-rose-400 animate-pulse',
    ringClass: 'border-rose-300/45 bg-slate-950/80 text-rose-100',
  },
  processing: {
    dotClass: 'bg-violet-300 animate-pulse',
    ringClass: 'border-violet-300/45 bg-slate-950/80 text-violet-100',
  },
  playing: {
    dotClass: 'bg-cyan-300 animate-pulse',
    ringClass: 'border-cyan-300/45 bg-slate-950/80 text-cyan-100',
  },
  paused: {
    dotClass: 'bg-slate-400',
    ringClass: 'border-slate-500 bg-slate-950/80 text-slate-200',
  },
  blocked: {
    dotClass: 'bg-amber-300',
    ringClass: 'border-amber-300/45 bg-slate-950/80 text-amber-100',
  },
  error: {
    dotClass: 'bg-rose-400',
    ringClass: 'border-rose-300/45 bg-slate-950/80 text-rose-100',
  },
};

export function AvatarFaceOverlay() {
  const t = useTranslations('accessibility');
  const [AvatarFaceCanvas, setAvatarFaceCanvas] = useState(null);
  const [AvatarVoiceSession, setAvatarVoiceSession] = useState(null);
  const [stage, setStage] = useState('waiting');
  const [visualState, setVisualState] = useState('portrait');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceSessionKey, setVoiceSessionKey] = useState(0);
  const [voiceState, setVoiceState] = useState(null);
  const stageReadyRef = useRef(false);
  const delayElapsedRef = useRef(false);
  const visualStateRef = useRef('portrait');
  const transitionDelayRef = useRef(null);
  const transitionCompleteRef = useRef(null);
  const voiceStatus = voiceState ? (VOICE_STATUS_STYLES[voiceState] || VOICE_STATUS_STYLES.error) : null;
  const voiceLabel = voiceState ? t(`voiceStates.${voiceState}`) : null;

  useEffect(() => {
    visualStateRef.current = visualState;
  }, [visualState]);

  const clearVisualTimers = useCallback(() => {
    if (transitionDelayRef.current !== null) {
      window.clearTimeout(transitionDelayRef.current);
      transitionDelayRef.current = null;
    }
    if (transitionCompleteRef.current !== null) {
      window.clearTimeout(transitionCompleteRef.current);
      transitionCompleteRef.current = null;
    }
  }, []);

  const enterFallback = useCallback(() => {
    clearVisualTimers();
    stageReadyRef.current = false;
    delayElapsedRef.current = false;
    setStage('fallback');
    setVisualState('fallback');
  }, [clearVisualTimers]);

  const beginReveal = useCallback(() => {
    if (!stageReadyRef.current || document.visibilityState !== 'visible') {
      return;
    }

    if (transitionCompleteRef.current !== null) {
      window.clearTimeout(transitionCompleteRef.current);
    }
    setVisualState('transitioning');
    transitionCompleteRef.current = window.setTimeout(() => {
      transitionCompleteRef.current = null;
      if (document.visibilityState === 'visible') {
        setVisualState('avatar');
      } else {
        delayElapsedRef.current = false;
        setVisualState('portrait');
      }
    }, AVATAR_TRANSITION_DURATION_MS);
  }, []);

  const startVoiceSession = useCallback(() => {
    setVoiceActive(true);
    setVoiceState('starting');
    import('./avatar-voice-session')
      .then(({ AvatarVoiceSession: Session, default: DefaultSession }) => {
        setAvatarVoiceSession(() => Session || DefaultSession);
      })
      .catch(() => {
        setVoiceState('error');
      });
  }, []);

  const handleAvatarReady = useCallback(() => {
    stageReadyRef.current = true;
    setStage('ready');
    if (delayElapsedRef.current && document.visibilityState === 'visible') {
      beginReveal();
    }
  }, [beginReveal]);

  const stopVoiceSession = useCallback(() => {
    setVoiceActive(false);
    setAvatarVoiceSession(null);
    setVoiceState(null);
  }, []);

  const retryVoiceSession = useCallback(() => {
    setVoiceState('starting');
    if (AvatarVoiceSession) {
      setVoiceSessionKey(key => key + 1);
      return;
    }
    startVoiceSession();
  }, [AvatarVoiceSession, startVoiceSession]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const saveData = navigator.connection?.saveData === true;

    if (!AVATAR_VISUAL_ENABLED || reducedMotion || saveData) {
      enterFallback();
      return undefined;
    }

    let cancelled = false;
    let started = false;
    let idleHandle;
    let hardFallbackTimer;

    const importAvatar = () => {
      if (cancelled || started) {
        return;
      }

      started = true;
      setStage('loading');
      if (hardFallbackTimer !== undefined) {
        window.clearTimeout(hardFallbackTimer);
      }

      import('./avatar-face-canvas')
        .then(({ default: Canvas }) => {
          if (!cancelled) {
            setAvatarFaceCanvas(() => Canvas);
          }
        })
        .catch(() => {
          if (!cancelled) {
            enterFallback();
          }
        });
    };

    const scheduleImport = () => {
      setStage('scheduled');
      hardFallbackTimer = window.setTimeout(importAvatar, 3000);

      if ('requestIdleCallback' in window) {
        idleHandle = window.requestIdleCallback(importAvatar, { timeout: 2000 });
      }
    };

    if (document.readyState === 'complete') {
      scheduleImport();
    } else {
      window.addEventListener('load', scheduleImport, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener('load', scheduleImport);
      if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleHandle);
      }
      if (hardFallbackTimer !== undefined) {
        window.clearTimeout(hardFallbackTimer);
      }
    };
  }, [enterFallback]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const saveData = navigator.connection?.saveData === true;

    if (!AVATAR_VISUAL_ENABLED || reducedMotion || saveData) {
      return undefined;
    }

    const markDelayElapsed = () => {
      transitionDelayRef.current = null;
      if (
        document.visibilityState !== 'visible' ||
        visualStateRef.current === 'avatar' ||
        visualStateRef.current === 'fallback'
      ) {
        return;
      }

      delayElapsedRef.current = true;
      if (stageReadyRef.current) {
        beginReveal();
      } else {
        setVisualState('preparing');
      }
    };

    const scheduleTransition = () => {
      if (
        document.visibilityState !== 'visible' ||
        visualStateRef.current === 'avatar' ||
        visualStateRef.current === 'fallback'
      ) {
        return;
      }

      clearVisualTimers();
      delayElapsedRef.current = false;
      setVisualState('portrait');
      transitionDelayRef.current = window.setTimeout(markDelayElapsed, AVATAR_TRANSITION_DELAY_MS);
    };

    const updateVisibility = () => {
      const visible = document.visibilityState === 'visible';
      if (!visible) {
        if (
          visualStateRef.current !== 'avatar' &&
          visualStateRef.current !== 'fallback'
        ) {
          clearVisualTimers();
          delayElapsedRef.current = false;
          setVisualState('portrait');
        }
        return;
      }
      scheduleTransition();
    };

    const handlePageHide = () => {
      if (
        visualStateRef.current !== 'avatar' &&
        visualStateRef.current !== 'fallback'
      ) {
        clearVisualTimers();
        delayElapsedRef.current = false;
        setVisualState('portrait');
      }
    };
    const handlePageShow = () => scheduleTransition();
    const handleLoad = () => scheduleTransition();

    document.addEventListener('visibilitychange', updateVisibility);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('pageshow', handlePageShow);
    if (document.readyState === 'complete') {
      scheduleTransition();
    } else {
      window.addEventListener('load', handleLoad, { once: true });
    }

    return () => {
      clearVisualTimers();
      document.removeEventListener('visibilitychange', updateVisibility);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('load', handleLoad);
    };
  }, [beginReveal, clearVisualTimers]);

  return (
    <div className="pointer-events-none absolute inset-0" data-voice-state={voiceState || 'off'}>
      <div
        aria-hidden="true"
        data-avatar-stage={stage}
        data-avatar-visual-state={visualState}
        className="avatar-face-layer absolute left-[27%] top-[7.5%] h-[58%] w-[46%] overflow-hidden rounded-[48%_48%_43%_43%]"
      >
        {AvatarFaceCanvas ? (
          <AvatarFaceCanvas onReady={handleAvatarReady} onFailure={enterFallback} />
        ) : null}
      </div>

      {voiceActive && AvatarVoiceSession ? (
        <AvatarVoiceSession key={voiceSessionKey} onStateChange={setVoiceState} />
      ) : null}

      <div className="pointer-events-auto absolute inset-x-2 bottom-2 flex flex-wrap items-center gap-1.5" role="group" aria-label={t('voiceControls')}>
        {!voiceActive ? (
          <button type="button" onClick={startVoiceSession} className="brand-voice-control">
            {t('startVoiceIntroduction')}
          </button>
        ) : (
          <>
            {voiceStatus && (
              <div
                data-vad-indicator
                role="status"
                aria-live="polite"
                aria-label={t('voiceState', { state: voiceLabel })}
                className={`inline-flex min-h-[32px] min-w-0 flex-1 items-center gap-1.5 rounded-full border px-2 py-1 text-[8px] font-mono font-medium uppercase tracking-[0.08em] shadow-sm ${voiceStatus.ringClass}`}
              >
                <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${voiceStatus.dotClass}`} />
                <span className="truncate">{voiceLabel}</span>
              </div>
            )}
            {(voiceState === 'blocked' || voiceState === 'error') && (
              <button type="button" onClick={retryVoiceSession} className="brand-voice-control">
                {t('retryVoiceIntroduction')}
              </button>
            )}
            <button type="button" onClick={stopVoiceSession} className="brand-voice-control">
              {t('stopVoiceIntroduction')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AvatarFaceOverlay;
