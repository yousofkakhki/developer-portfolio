import { io } from 'socket.io-client';
import { readFileSync } from 'node:fs';

const url = process.argv[2] || 'wss://ai.kakhki.me/ai?guest=true';
const sendAudio = process.argv.includes('--send-audio');
const audioFixture = process.env.REALTIME_PCM_FIXTURE;
const expectedTerms = (process.env.REALTIME_EXPECT_TRANSCRIPT || '')
  .split('|')
  .map((term) => term.trim())
  .filter(Boolean);
const timeoutMs = Number(process.env.SOCKET_PROBE_TIMEOUT_MS || 60000);

const socket = io(url, {
  path: '/socket_io',
  transports: ['websocket'],
  withCredentials: false,
  reconnection: false,
  timeout: 15000,
});

const events = [];
let settled = false;
let receivedAck = false;
let receivedAudio = false;
let receivedTerminal = false;

function finish(code, reason) {
  if (settled) return;
  settled = true;
  events.push({ event: 'finish', reason });
  console.log(JSON.stringify({ connected: socket.connected, receivedAck, receivedAudio, receivedTerminal, expectedTerms, events }, null, 2));
  socket.disconnect();
  process.exitCode = code;
}

const timer = setTimeout(() => {
  const success = socket.connected && (!sendAudio || (receivedAck && (receivedAudio || receivedTerminal)));
  finish(success ? 0 : 1, success ? 'timeout-after-required-events' : 'missing-required-events');
}, timeoutMs);

socket.on('connect', () => {
  events.push({ event: 'connect', id: socket.id });
  if (!sendAudio) {
    clearTimeout(timer);
    finish(0, 'guest-connected');
    return;
  }

  let audio;
  if (audioFixture) {
    audio = readFileSync(audioFixture);
  } else {
    // 1.2 seconds of low-amplitude 440 Hz PCM16 at the backend's expected 16 kHz.
    const sampleRate = 16000;
    const samples = new Int16Array(Math.floor(sampleRate * 1.2));
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = Math.round(Math.sin((2 * Math.PI * 440 * index) / sampleRate) * 3000);
    }
    audio = Buffer.from(samples.buffer);
  }
  socket.emit('audio-stream', audio);
  events.push({ event: 'audio-stream', bytes: audio.byteLength, fixture: audioFixture || null });
});

socket.on('audio-received', (payload) => {
  receivedAck = true;
  events.push({ event: 'audio-received', payload });
});

socket.on('audio-chunk', (payload) => {
  receivedAudio = Boolean(payload?.audio);
  events.push({ event: 'audio-chunk', bytes: payload?.audio?.length || 0 });
});

for (const name of ['responseCompleted', 'audio-response']) {
  socket.on(name, (payload) => {
    receivedTerminal = true;
    events.push({ event: name, audioBytes: payload?.audio?.length || 0, transcript: payload?.transcript || '' });
    const transcript = payload?.transcript || '';
    const normalizedTranscript = transcript.toLocaleLowerCase('fa');
    const missingTerms = expectedTerms.filter(
      (term) => !normalizedTranscript.includes(term.toLocaleLowerCase('fa')),
    );
    if (missingTerms.length) {
      events.push({ event: 'missing-expected-terms', missingTerms });
      clearTimeout(timer);
      finish(1, 'persona-assertion-failed');
    } else if (receivedAck && (receivedAudio || payload?.audio)) {
      clearTimeout(timer);
      finish(0, 'complete-realtime-turn');
    }
  });
}

socket.on('connect_error', (error) => {
  events.push({ event: 'connect_error', message: error.message });
  clearTimeout(timer);
  finish(1, 'guest-connect-failed');
});

socket.on('error', (error) => {
  events.push({ event: 'error', message: typeof error === 'string' ? error : error?.message || JSON.stringify(error) });
  if (sendAudio && receivedAck) {
    clearTimeout(timer);
    finish(1, 'backend-processing-error');
  }
});
