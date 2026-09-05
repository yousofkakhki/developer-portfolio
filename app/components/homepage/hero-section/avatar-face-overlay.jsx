"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const voiceSessionImport = import('./avatar-voice-session');

export function AvatarFaceOverlay() {
  const t = useTranslations('accessibility');
  const [AvatarFaceCanvas, setAvatarFaceCanvas] = useState(null);
  const [AvatarVoiceSession, setAvatarVoiceSession] = useState(null);
  const [stage, setStage] = useState('waiting');
  const [voiceState, setVoiceState] = useState('connecting');
  const voiceLoadStartedRef = useRef(false);

  const loadVoiceSession = useCallback(() => {
    if (voiceLoadStartedRef.current) {
      return;
    }

    voiceLoadStartedRef.current = true;
    voiceSessionImport
      .then(({ AvatarVoiceSession: Session, default: DefaultSession }) => {
        setAvatarVoiceSession(() => Session || DefaultSession);
      })
      .catch(() => {
        setVoiceState('error');
      });
  }, []);

  const handleAvatarReady = useCallback(() => {
    setStage('ready');
  }, []);

  useEffect(() => {
    loadVoiceSession();
  }, [loadVoiceSession]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const saveData = navigator.connection?.saveData === true;

    if (reducedMotion || saveData) {
      setStage('fallback');
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
            setStage('fallback');
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
  }, []);

  return (
    <div
      data-avatar-stage={stage}
      data-voice-state={voiceState}
      className={`absolute left-[30.5%] top-[3.5%] h-[43%] w-[39%] overflow-hidden rounded-[48%_48%_43%_43%] transition-opacity duration-700 ${
        stage === 'ready' ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0">
        <span className="sr-only" aria-live="polite">{t('voiceState', { state: t(`voiceStates.${voiceState}`) })}</span>

        {AvatarFaceCanvas ? <AvatarFaceCanvas onReady={handleAvatarReady} /> : null}
        {AvatarVoiceSession ? <AvatarVoiceSession onStateChange={setVoiceState} /> : null}
      </div>
    </div>
  );
}

export default AvatarFaceOverlay;

// The indicator remains intentionally tiny; the avatar is hands-free and has no microphone button.
