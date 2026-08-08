// Shared audio analyser used by the avatar voice session and VRM face renderer.
// Keeping this in a tiny module avoids passing audio state through the visual overlay.
export const voiceAnalyserRef = { current: null };

export function setVoiceAnalyser(analyser) {
  voiceAnalyserRef.current = analyser || null;
}

export function clearVoiceAnalyser(analyser) {
  if (!analyser || voiceAnalyserRef.current === analyser) {
    voiceAnalyserRef.current = null;
  }
}
