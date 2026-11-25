# python3 ad3_mix.py events_ad3_ru.json bed.wav out.wav  -> bed (ad_audio.py output) ducked under voice lines v1..v7.wav
import json, sys, wave
import numpy as np
SR = 44100
d = json.load(open(sys.argv[1])); N = int(SR * d['dur'])
def rd(p):
    w = wave.open(p); sr = w.getframerate(); ch = w.getnchannels(); n = w.getnframes()
    a = np.frombuffer(w.readframes(n), np.int16).reshape(-1, ch).mean(1) / 32768.0
    if sr != SR: a = np.interp(np.arange(int(n * SR / sr)) * sr / SR, np.arange(n), a)
    return a
bed = rd(sys.argv[2])[:N]; bed = np.pad(bed, (0, N - len(bed)))
voice = np.zeros(N)
for i, st in enumerate(d['voice']):
    v = rd('v%d.wav' % (i + 1)); s = int(st * SR); e = min(N, s + len(v)); voice[s:e] += v[:e - s]
voice = voice / (np.max(np.abs(voice)) + 1e-9) * 0.9
# duck envelope from voice energy (smoothed)
env = np.convolve(np.abs(voice), np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
env = np.clip(env / (env.max() + 1e-9) * 3, 0, 1)
duck = 1 - 0.55 * env
# build-up: bed gain grows toward climax (~27 s), then settles
t = np.arange(N) / SR
gain = 0.30 + 0.20 * np.clip((t - 16) / 11, 0, 1) - 0.12 * np.clip((t - 28.5) / 2, 0, 1)
gain += 0.25 * np.exp(-((t - 27.0) / 0.6) ** 2)  # climax swell
out = bed * gain * duck + voice
# soft limiter
out = np.tanh(out * 1.3) / np.tanh(1.3)
out = out / (np.max(np.abs(out)) + 1e-9) * 0.89
pcm = (out * 32767).astype(np.int16)
w = wave.open(sys.argv[3], 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
w.writeframes(np.stack([pcm, pcm], 1).tobytes()); w.close()
