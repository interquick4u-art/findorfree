# python3 ad_audio.py events_ad_en.json out.wav  -> soft music bed + UI sounds for ad1.js
import json, sys, wave
import numpy as np
SR = 44100
d = json.load(open(sys.argv[1])); dur = d['dur']; N = int(SR * dur)
t = np.arange(N) / SR
out = np.zeros(N)
def note(f): return 440 * 2 ** ((f - 69) / 12)
# chord progression, 4 s per chord: Cmaj7 Am7 Fmaj7 G6 (warm, positive)
chords = [[48, 55, 64, 71], [45, 52, 60, 67], [41, 48, 57, 64], [43, 50, 59, 64]]
seg = 4.0
for k in range(int(dur / seg) + 1):
    ch = chords[k % 4]; a = int(k * seg * SR); b = min(N, int((k * seg + seg + 0.6) * SR))
    if a >= N: break
    tt = np.arange(b - a) / SR
    env = np.minimum(1, tt / 0.8) * np.minimum(1, np.maximum(0, (seg + 0.6 - tt) / 0.8))
    for m in ch:
        f = note(m)
        out[a:b] += 0.035 * env * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt + 0.5))
    # soft plucked arpeggio on 8ths
    for j in range(8):
        s = a + int(j * 0.5 * SR); m = ch[j % 4] + 12
        L = int(0.45 * SR)
        if s + L > N: break
        tl = np.arange(L) / SR
        out[s:s + L] += 0.05 * np.exp(-tl * 7) * np.sin(2 * np.pi * note(m) * tl)
# gentle kick-ish pulse on beats after intro
for bt in np.arange(2.0, dur - 1, 1.0):
    s = int(bt * SR); L = int(0.18 * SR)
    if s + L > N: break
    tl = np.arange(L) / SR
    out[s:s + L] += 0.12 * np.exp(-tl * 25) * np.sin(2 * np.pi * (90 - 40 * tl / 0.18) * tl)
rng = np.random.default_rng(1)
def add(at, sig):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(N, s + len(sig))
    if s < N and e > s: out[s:e] += sig[:e - s]
for e in d['ev']:
    k = e['k']; at = e['t']
    if k == 'whoosh':
        L = int(0.5 * SR); n = rng.standard_normal(L); tl = np.arange(L) / SR
        env = np.sin(np.pi * tl / 0.5) ** 2
        n = np.convolve(n, np.ones(30) / 30, 'same')
        add(at - 0.2, 0.25 * env * n)
    elif k == 'key':
        L = int(0.03 * SR); tl = np.arange(L) / SR
        add(at, 0.12 * np.exp(-tl * 200) * rng.standard_normal(L))
    elif k == 'tick':
        L = int(0.08 * SR); tl = np.arange(L) / SR
        add(at, 0.18 * np.exp(-tl * 60) * np.sin(2 * np.pi * 1800 * tl))
    elif k == 'pop':
        L = int(0.25 * SR); tl = np.arange(L) / SR
        add(at, 0.3 * np.exp(-tl * 18) * np.sin(2 * np.pi * (300 + 500 * tl) * tl))
    elif k == 'found':
        for i, m in enumerate([72, 76, 79, 84]):
            L = int(0.5 * SR); tl = np.arange(L) / SR
            add(at + i * 0.08, 0.14 * np.exp(-tl * 6) * np.sin(2 * np.pi * note(m) * tl))
    elif k == 'rise':
        L = int(1.0 * SR); tl = np.arange(L) / SR
        add(at, 0.06 * (tl / 1.0) * np.sin(2 * np.pi * (200 + 600 * tl) * tl))
# fade out
fo = int(1.5 * SR); out[-fo:] *= np.linspace(1, 0, fo)
out = out / (np.max(np.abs(out)) + 1e-9) * 0.85
pcm = (out * 32767).astype(np.int16)
st = np.stack([pcm, pcm], 1).tobytes()
w = wave.open(sys.argv[2], 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st); w.close()
