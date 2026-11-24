// Noise page — the Fire Born's words, synthesized from scratch with the Web Audio API.
// The dictionary (words, roots, sequences) lives in the-path-campaign/flavor/fire-born-language/fire-born-noise.yaml.
// This file is only the synth engine: it knows how to voice each building-block sound, and
// plays a word by scheduling its sequence of sounds.
const NOISE_URL = '../the-path-campaign/flavor/fire-born-language/fire-born-noise.yaml';

// How much each play differs from the last (pitch/timing jitter), so words never sound canned.
const VARIATION = 0.5;
// Silence between words when playing a phrase.
const WORD_GAP = 0.45;

// ─── Randomness ──────────────────────────────────────────────────────────────

function mulberry32(seed) {
    return function () {
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const freshRng = () => mulberry32((Math.random() * 4294967296) >>> 0);

// ─── Shared building blocks ──────────────────────────────────────────────────

// Formant frequencies (Hz) for the groan's "mouth". `mm` is a closed, swallowed hum.
const VOWELS = {
    oo: [300, 870, 2240, 3300],
    oh: [450, 800, 2830, 3500],
    ah: [730, 1090, 2440, 3400],
    eh: [530, 1840, 2480, 3500],
    ee: [270, 2290, 3010, 3700],
    uh: [520, 1190, 2390, 3400],
    mm: [250, 950, 2400, 3300],
};
const FORMANT_GAINS = [1, 0.7, 0.35, 0.2];

const noiseCache = new WeakMap();

function noiseBuffer(ctx) {
    let buf = noiseCache.get(ctx);
    if (!buf) {
        const len = ctx.sampleRate * 2;
        buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        noiseCache.set(ctx, buf);
    }
    return buf;
}

function noiseSource(ctx, t, dur) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(ctx);
    src.loop = true;
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
    return src;
}

// Attack / hold / release gain envelope, exponential (sounds natural for decaying metal).
function envelope(ctx, t, { attack = 0.01, hold = 0, release = 0.3, peak = 1 }) {
    const g = ctx.createGain();
    const p = Math.max(peak, 0.0002);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(p, t + attack);
    g.gain.setValueAtTime(p, t + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
    return g;
}

function filter(ctx, type, freq, q = 0.7) {
    const f = ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    return f;
}

function osc(ctx, type, freq, t, dur) {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
}

// Feedback loops (comb filters) keep their nodes alive; break them once the sound has rung out.
function cleanupLater(ctx, t, nodes) {
    if (typeof AudioContext === 'undefined' || !(ctx instanceof AudioContext)) return;
    const ms = (t - ctx.currentTime + 4) * 1000;
    setTimeout(() => nodes.forEach(n => n.disconnect()), Math.max(ms, 0));
}

// The heart of the iron-golem voice: a stream of clicks whose spacing wanders a little each time
// (jitter) and whose loudness wavers (shimmer). Slow clicks read as a creaking hinge; fast ones
// blur into a buzzing, voice-like moan. Generated sample by sample into a buffer.
function pulseTrain(ctx, dur, opts, rnd) {
    const { from, to = from, curve = 1, jitter = 0.1, shimmer = 0.2, drop = 0, wobble = 0 } = opts;
    const sr = ctx.sampleRate;
    const n = Math.max(1, Math.ceil(dur * sr));
    const buf = ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    let i = 0;
    while (i < n) {
        const x = Math.pow(i / n, curve);
        let f = from * Math.pow(to / from, x);
        f *= 1 + wobble * Math.sin(2 * Math.PI * 5 * (i / sr));
        const period = (sr / f) * (1 + jitter * (rnd() * 2 - 1));
        const amp = (1 - shimmer * rnd()) * (rnd() < drop ? 0 : 1);
        const w = Math.min(period * 0.5, sr * 0.004);
        // One click: a positive lobe swinging negative, decaying fast (roughly zero-DC).
        for (let k = 0; k < w && i + k < n; k++) {
            const ph = k / w;
            d[i + k] += amp * (1 - 2 * ph) * Math.exp(-3 * ph);
        }
        i += Math.max(1, Math.round(period));
    }
    return buf;
}

function bufferSource(ctx, buf, t) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.start(t);
    return src;
}

// Formant filters (the mouth) feeding a feedback comb (the hollow iron chest).
function ironChest(ctx, input, t, dur, { vowel = 'oh', toVowel, ring = 0.7, chestHz = 140 }) {
    const a = VOWELS[vowel] || VOWELS.oh;
    const b = VOWELS[toVowel] || a;
    const mouth = ctx.createGain();
    a.forEach((freq, i) => {
        const bp = filter(ctx, 'bandpass', freq, 6 + i * 3);
        bp.frequency.setValueAtTime(freq, t);
        bp.frequency.linearRampToValueAtTime(b[i], t + dur);
        const g = ctx.createGain();
        g.gain.value = FORMANT_GAINS[i] * 3;
        input.connect(bp).connect(g).connect(mouth);
    });

    const sum = ctx.createGain();
    const delay = ctx.createDelay(0.1);
    delay.delayTime.value = 1 / chestHz;
    const damp = filter(ctx, 'lowpass', 2800);
    const fb = ctx.createGain();
    fb.gain.value = Math.min(ring, 0.9);
    mouth.connect(sum);
    sum.connect(delay).connect(damp).connect(fb).connect(sum);
    cleanupLater(ctx, t + dur, [fb]);

    const out = ctx.createGain();
    out.gain.value = 1 - Math.min(ring, 0.9) * 0.8; // tame the comb's resonant boost
    sum.connect(out);
    return out;
}

// Inharmonic partials of a heavy metal plate, each ringing out at its own rate.
const PLATE_RATIOS = [1, 1.47, 2.09, 2.56, 3.39, 4.17, 5.43, 6.8];
// Risset's bell partials (ratio, relative amplitude, relative decay).
const BELL = [[0.56, 1, 1], [0.92, 0.67, 0.9], [1.19, 1, 0.65], [1.71, 1.8, 0.55], [2, 2.67, 0.325],
              [2.74, 1.67, 0.35], [3, 1.46, 0.25], [3.76, 1.33, 0.2], [4.07, 1.33, 0.15]];

function strike(ctx, dest, t, f, ring, gain, rnd) {
    PLATE_RATIOS.forEach((r, i) => {
        const dec = ring / (1 + i * 0.7);
        const o = osc(ctx, 'sine', f * r * (1 + (rnd() - 0.5) * 0.02), t, dec);
        const amp = ((0.6 + 0.4 * rnd()) / Math.pow(i + 1, 0.6)) * gain;
        o.connect(envelope(ctx, t, { attack: 0.003, release: dec, peak: amp })).connect(dest);
    });
}

// ─── The sounds ──────────────────────────────────────────────────────────────
// Each takes (ctx, dest, startTime, params, rnd, pitchJitter) and returns how long it "occupies"
// in the sequence (ringing tails may last longer than that).

const SOUNDS = {
    groan(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 1.2;
        const from = (p.from ?? 55) * pj;
        const to = (p.to ?? p.from ?? 55) * pj;
        const buf = pulseTrain(ctx, dur, {
            from, to, curve: p.curve ?? 1, jitter: p.rough ?? 0.15,
            shimmer: 0.3, drop: p.drop ?? 0, wobble: p.wobble ?? 0.01,
        }, rnd);
        const hp = filter(ctx, 'highpass', 35);
        bufferSource(ctx, buf, t).connect(hp);
        const body = ironChest(ctx, hp, t, dur, {
            vowel: p.vowel ?? 'oh', toVowel: p.toVowel, ring: p.ring ?? 0.7, chestHz: p.chest ?? 140,
        });
        body.connect(envelope(ctx, t, {
            attack: 0.08, hold: Math.max(0, dur - 0.3), release: 0.22, peak: (p.gain ?? 1) * 0.5,
        })).connect(dest);
        return dur;
    },

    clank(ctx, dest, t, p, rnd, pj) {
        const f = (p.pitch ?? 160) * pj;
        const ring = p.ring ?? 1.4;
        const gain = p.gain ?? 1;
        const out = ctx.createGain();
        out.gain.value = 0.22;
        let tail = out;
        if (p.damp) {
            tail = filter(ctx, 'lowpass', f * 3);
            out.connect(tail);
        }
        tail.connect(dest);

        strike(ctx, out, t, f, p.damp ? ring * 0.4 : ring, gain, rnd);
        // The hit itself: a short burst of bright noise.
        noiseSource(ctx, t, 0.05)
            .connect(filter(ctx, 'bandpass', 2500, 1))
            .connect(envelope(ctx, t, { attack: 0.001, release: 0.04, peak: 0.8 * gain }))
            .connect(out);
        if (p.weight) {
            const o = osc(ctx, 'sine', 90, t, 0.35);
            o.frequency.exponentialRampToValueAtTime(40, t + 0.25);
            o.connect(envelope(ctx, t, { attack: 0.003, release: 0.3, peak: 3 * gain })).connect(out);
        }
        return p.dur ?? 0.28;
    },

    creak(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 0.8;
        const rate = p.rate ?? 18;
        const f = (p.pitch ?? 900) * pj;
        const buf = pulseTrain(ctx, dur, {
            from: rate, to: p.toRate ?? rate * 1.6, jitter: 0.45, shimmer: 0.6, drop: 0.1,
        }, rnd);
        const src = bufferSource(ctx, buf, t);
        const env = envelope(ctx, t, {
            attack: 0.02, hold: Math.max(0, dur - 0.12), release: 0.1, peak: (p.gain ?? 1) * 2.5,
        });
        [[1, 1], [2.13, 0.6], [3.7, 0.3]].forEach(([r, g]) => {
            const gn = ctx.createGain();
            gn.gain.value = g;
            src.connect(filter(ctx, 'bandpass', f * r, 18)).connect(gn).connect(env);
        });
        env.connect(dest);
        return dur;
    },

    roar(ctx, dest, t, p, rnd) {
        const dur = p.dur ?? 1.5;
        const gain = p.gain ?? 1;
        const lp = filter(ctx, 'lowpass', 250, 1);
        lp.frequency.setValueAtTime(250, t);
        lp.frequency.exponentialRampToValueAtTime(900 + 700 * Math.min(gain, 1.5), t + dur * 0.4);
        lp.frequency.exponentialRampToValueAtTime(350, t + dur);
        noiseSource(ctx, t, dur)
            .connect(lp)
            .connect(envelope(ctx, t, { attack: dur * 0.35, release: dur * 0.65, peak: 0.6 * gain }))
            .connect(dest);
        SOUNDS.crackle(ctx, dest, t, { dur, density: 12, gain: 0.5 * gain }, rnd);
        return dur;
    },

    crackle(ctx, dest, t, p, rnd) {
        const dur = p.dur ?? 1.2;
        const density = p.density ?? 25;
        const sr = ctx.sampleRate;
        const n = Math.ceil(dur * sr);
        const buf = ctx.createBuffer(1, n, sr);
        const d = buf.getChannelData(0);
        const pops = Math.round(density * dur);
        for (let j = 0; j < pops; j++) {
            const r = rnd();
            const pos = Math.floor(n * (p.dying ? r * r : r));
            const amp = 0.2 + 0.8 * rnd() * rnd();
            const len = 30 + Math.floor(rnd() * 220);
            for (let k = 0; k < len && pos + k < n; k++) {
                d[pos + k] += amp * (rnd() * 2 - 1) * Math.exp(-k / (len * 0.3));
            }
        }
        bufferSource(ctx, buf, t)
            .connect(filter(ctx, 'highpass', 1200))
            .connect(envelope(ctx, t, {
                attack: 0.05, hold: Math.max(0, dur - 0.2), release: 0.15, peak: (p.gain ?? 1) * 0.7,
            }))
            .connect(dest);
        return dur;
    },

    hiss(ctx, dest, t, p) {
        const dur = p.dur ?? 0.9;
        const bp = filter(ctx, 'bandpass', p.pitch ?? 5000, 0.8);
        bp.frequency.setValueAtTime(p.pitch ?? 5000, t);
        if (p.toPitch) bp.frequency.exponentialRampToValueAtTime(p.toPitch, t + dur);
        noiseSource(ctx, t, dur)
            .connect(filter(ctx, 'highpass', 1200))
            .connect(bp)
            .connect(envelope(ctx, t, {
                attack: 0.04, hold: Math.max(0, dur - 0.3), release: 0.26, peak: (p.gain ?? 1) * 0.35,
            }))
            .connect(dest);
        return dur;
    },

    hum(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 2.5;
        const f = (p.pitch ?? 65) * pj;
        const trem = ctx.createGain();
        trem.gain.value = 0.65;
        const lfo = osc(ctx, 'sine', 4.5 + rnd() * 2, t, dur);
        const depth = ctx.createGain();
        depth.gain.value = 0.35;
        lfo.connect(depth).connect(trem.gain);
        // Slightly detuned pairs beat against each other: the shimmer in the air.
        [[1, 1], [1.003, 0.8], [2, 0.5], [2.007, 0.4], [3.01, 0.25], [4.23, 0.15], [5.4, 0.08]]
            .forEach(([r, a]) => {
                const g = ctx.createGain();
                g.gain.value = a;
                osc(ctx, 'sine', f * r, t, dur).connect(g).connect(trem);
            });
        const attack = Math.min(0.6, dur * 0.3);
        const release = Math.min(0.8, dur * 0.35);
        trem.connect(envelope(ctx, t, {
            attack, hold: Math.max(0, dur - attack - release), release, peak: (p.gain ?? 1) * 0.3,
        })).connect(dest);
        return dur;
    },

    chime(ctx, dest, t, p, rnd) {
        const count = p.count ?? 3;
        const spacing = p.spacing ?? 0.18;
        const base = p.pitch ?? 880;
        const steps = [1, 1.2, 1.5, 1.78, 2];
        const ring = 2.5;
        for (let j = 0; j < count; j++) {
            const st = t + j * spacing;
            const f = base * steps[Math.floor(rnd() * steps.length)];
            BELL.forEach(([r, a, dec]) => {
                const o = osc(ctx, 'sine', f * r, st, ring * dec);
                o.connect(envelope(ctx, st, {
                    attack: 0.002, release: ring * dec, peak: (a / 12) * (p.gain ?? 1),
                })).connect(dest);
            });
        }
        return (count - 1) * spacing + 0.3;
    },

    thud(ctx, dest, t, p, rnd) {
        const gain = p.gain ?? 1;
        const o = osc(ctx, 'sine', 75, t, 0.5);
        o.frequency.exponentialRampToValueAtTime(32, t + 0.25);
        o.connect(envelope(ctx, t, { attack: 0.005, release: 0.45, peak: 0.9 * gain })).connect(dest);
        noiseSource(ctx, t, 0.25)
            .connect(filter(ctx, 'lowpass', 180))
            .connect(envelope(ctx, t, { attack: 0.003, release: 0.2, peak: 1.2 * gain }))
            .connect(dest);
        SOUNDS.clank(ctx, dest, t, { pitch: 60, ring: 0.5, damp: true, gain: 0.4 * gain }, rnd, 1);
        return p.dur ?? 0.5;
    },

    horn(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 2.4;
        const from = (p.pitch ?? 42) * pj;
        const to = p.to != null ? p.to * pj : from * 0.94;
        const buf = pulseTrain(ctx, dur, { from, to, jitter: 0.03, shimmer: 0.05, wobble: 0.01 }, rnd);
        const hp = filter(ctx, 'highpass', 30);
        bufferSource(ctx, buf, t).connect(hp);
        const body = ironChest(ctx, hp, t, dur, {
            vowel: p.vowel ?? 'oo', toVowel: p.toVowel ?? 'oh', ring: 0.82, chestHz: 90,
        });
        const env = envelope(ctx, t, {
            attack: dur * 0.25, hold: dur * 0.5, release: dur * 0.25, peak: (p.gain ?? 1) * 0.55,
        });
        body.connect(env);
        const sub = osc(ctx, 'sine', from / 2, t, dur);
        sub.frequency.linearRampToValueAtTime(to / 2, t + dur);
        const subGain = ctx.createGain();
        subGain.gain.value = 0.5;
        sub.connect(subGain).connect(env);
        env.connect(dest);
        return dur;
    },

    pulse(ctx, dest, t, p, rnd, pj) {
        const count = p.count ?? 4;
        let interval = p.interval ?? 0.45;
        let f = (p.pitch ?? 320) * pj;
        let st = t;
        for (let j = 0; j < count; j++) {
            [[1, 1], [2.76, 0.3]].forEach(([r, a]) => {
                osc(ctx, 'sine', f * r, st, 0.4)
                    .connect(envelope(ctx, st, { attack: 0.004, release: 0.35, peak: 0.35 * a * (p.gain ?? 1) }))
                    .connect(dest);
            });
            if (j < count - 1) st += interval;
            interval *= p.accel ?? 1;
            f *= p.rise ?? 1;
        }
        return st - t + 0.3;
    },

    grind(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 1.4;
        const rate = (p.rate ?? 38) * pj;
        const gain = p.gain ?? 1;
        const env = envelope(ctx, t, { attack: 0.1, hold: Math.max(0, dur - 0.4), release: 0.3, peak: 0.6 * gain });
        const buf = pulseTrain(ctx, dur, {
            from: rate, to: (p.toRate ?? rate * 0.8) * pj, jitter: 0.5, shimmer: 0.7, drop: 0.05,
        }, rnd);
        const src = bufferSource(ctx, buf, t);
        [[420, 3, 2], [1250, 5, 1.2]].forEach(([freq, q, g]) => {
            const gn = ctx.createGain();
            gn.gain.value = g;
            src.connect(filter(ctx, 'bandpass', freq * pj, q)).connect(gn).connect(env);
        });
        // Gritty noise chopped on and off at the gear rate.
        const chop = ctx.createGain();
        chop.gain.value = 0.5;
        const lfo = osc(ctx, 'square', rate, t, dur);
        const depth = ctx.createGain();
        depth.gain.value = 0.5;
        lfo.connect(depth).connect(chop.gain);
        const nGain = ctx.createGain();
        nGain.gain.value = 0.35;
        noiseSource(ctx, t, dur).connect(filter(ctx, 'bandpass', 700, 2)).connect(chop).connect(nGain).connect(env);
        env.connect(dest);
        return dur;
    },

    rest(ctx, dest, t, p) {
        return p.dur ?? 0.5;
    },
};

// ─── Sequencing ──────────────────────────────────────────────────────────────

// Schedules a word's sequence starting at t0. Returns its length in seconds.
function scheduleSequence(ctx, dest, steps, t0, rnd) {
    let prevStart = t0;
    let prevEnd = t0;
    let end = t0;
    for (const step of steps || []) {
        const fn = SOUNDS[step.p];
        if (!fn) {
            console.warn(`Unknown Fire Born sound "${step.p}"`);
            continue;
        }
        let start;
        if (step.at != null) start = t0 + step.at;
        else if (step.with) start = prevStart;
        else start = prevEnd + (step.gap ?? 0.06);
        start = Math.max(start, t0);
        const pitchJitter = 1 + (rnd() - 0.5) * 0.1 * VARIATION;
        const dur = fn(ctx, dest, start, step, rnd, pitchJitter);
        prevStart = start;
        prevEnd = start + dur;
        end = Math.max(end, prevEnd);
    }
    return end - t0;
}

// A dark, metallic hall built from decaying noise: it gives the Fire Born their size.
function makeImpulse(ctx, seconds) {
    const sr = ctx.sampleRate;
    const n = Math.floor(sr * seconds);
    const buf = ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
        const d = buf.getChannelData(ch);
        let lp = 0;
        for (let i = 0; i < n; i++) {
            const x = i / n;
            lp += ((Math.random() * 2 - 1) - lp) * (0.6 - 0.45 * x);
            d[i] = lp * Math.pow(1 - x, 3.5);
        }
    }
    return buf;
}

function buildChain(ctx) {
    const input = ctx.createGain();
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    const verb = ctx.createConvolver();
    const comp = ctx.createDynamicsCompressor();
    const master = ctx.createGain();
    verb.buffer = makeImpulse(ctx, 3.2);
    dry.gain.value = 0.85;
    wet.gain.value = 0.35;
    comp.threshold.value = -20;
    comp.ratio.value = 5;
    comp.attack.value = 0.005;
    comp.release.value = 0.25;
    input.connect(dry).connect(comp);
    input.connect(verb).connect(wet).connect(comp);
    comp.connect(master);
    return { input, master };
}

// ─── Playback ────────────────────────────────────────────────────────────────

const engine = { ctx: null, chain: null, current: null, volume: 0.8 };

function ensureAudio() {
    if (!engine.ctx) {
        engine.ctx = new AudioContext();
        engine.chain = buildChain(engine.ctx);
        engine.chain.master.gain.value = engine.volume;
        engine.chain.master.connect(engine.ctx.destination);
    }
    if (engine.ctx.state === 'suspended') engine.ctx.resume();
    return engine.ctx;
}

function stopAll() {
    const cur = engine.current;
    if (!cur) return;
    engine.current = null;
    clearTimeout(cur.timer);
    cur.bus.gain.setTargetAtTime(0, engine.ctx.currentTime, 0.06);
    setTimeout(() => cur.bus.disconnect(), 500);
    cur.onEnd?.();
}

// Plays one or more words back to back. `onWord(i)` fires as each word starts.
function playWords(words, { onWord, onEnd } = {}) {
    const ctx = ensureAudio();
    stopAll();
    const bus = ctx.createGain();
    bus.connect(engine.chain.input);
    const handle = { bus, timer: null, onEnd };
    engine.current = handle;

    let t = ctx.currentTime + 0.05;
    words.forEach((word, i) => {
        const startAt = t;
        if (onWord) setTimeout(() => engine.current === handle && onWord(i), (startAt - ctx.currentTime) * 1000);
        t += scheduleSequence(ctx, bus, word.sequence, t, freshRng()) + WORD_GAP;
    });
    handle.timer = setTimeout(() => {
        if (engine.current === handle) {
            engine.current = null;
            onEnd?.();
        }
    }, (t - ctx.currentTime + 0.3) * 1000);
}

// ─── Page ────────────────────────────────────────────────────────────────────

const phrase = [];
let wordsById = {};

function renderWordCard(word) {
    const roots = (word.roots || []).map(r => `<span class="root-chip">${escapeHtml(r)}</span>`).join('');
    return `
        <div class="word-card" data-id="${escapeAttr(word.id)}">
            <button class="word-play" data-play="${escapeAttr(word.id)}" title="Play">
                <span class="word-icon">▶</span>
                <span class="word-name">${escapeHtml(word.word)}</span>
            </button>
            <button class="word-add" data-add="${escapeAttr(word.id)}" title="Add to phrase">+</button>
            ${roots ? `<div class="word-roots">${roots}</div>` : ''}
            ${word.note ? `<p class="word-note">${escapeHtml(word.note)}</p>` : ''}
        </div>`;
}

function renderPhrase() {
    const bar = document.getElementById('phrase-words');
    bar.innerHTML = phrase.length
        ? phrase.map((id, i) => `<button class="phrase-chip" data-remove="${i}" title="Remove">${escapeHtml(wordsById[id].word)} ×</button>`).join('')
        : '<span class="phrase-empty">Press + on words to build a phrase</span>';
    document.getElementById('phrase-play').disabled = !phrase.length;
    document.getElementById('phrase-clear').disabled = !phrase.length;
}

function setPlaying(el) {
    document.querySelectorAll('.playing').forEach(n => n.classList.remove('playing'));
    if (el) el.classList.add('playing');
}

function render(data) {
    const words = data.words || [];
    wordsById = Object.fromEntries(words.map(w => [w.id, w]));
    const categories = data.categories || [...new Set(words.map(w => w.category))];

    document.getElementById('noise-intro').innerHTML = formatDescription(data.description || '');

    document.getElementById('noise-words').innerHTML = categories.map(cat => {
        const inCat = words.filter(w => w.category === cat);
        if (!inCat.length) return '';
        return `
            <section class="nav-section">
                <h2>${escapeHtml(cat)}</h2>
                <div class="word-grid">${inCat.map(renderWordCard).join('')}</div>
            </section>`;
    }).join('');

    document.getElementById('noise-roots').innerHTML = (data.roots || []).map(r => `
        <tr><td><strong>${escapeHtml(r.root)}</strong></td><td>${escapeHtml(r.sound)}</td><td>${escapeHtml(r.meaning)}</td></tr>
    `).join('');

    document.getElementById('noise-sounds').innerHTML = (data.sounds || []).map(s => `
        <div class="sound-row">
            <button class="sound-play" data-sound="${escapeAttr(s.id)}" title="Play with defaults">▶ ${escapeHtml(s.id)}</button>
            <div><p>${escapeHtml(s.description)}</p><p class="sound-params">${escapeHtml(s.params || '')}</p></div>
        </div>`).join('');

    renderPhrase();
}

function wireEvents() {
    document.addEventListener('click', e => {
        const play = e.target.closest('[data-play]');
        if (play) {
            const card = play.closest('.word-card');
            if (card.classList.contains('playing')) { stopAll(); return; }
            setPlaying(card);
            playWords([wordsById[play.dataset.play]], { onEnd: () => setPlaying(null) });
            return;
        }
        const add = e.target.closest('[data-add]');
        if (add) {
            phrase.push(add.dataset.add);
            renderPhrase();
            return;
        }
        const remove = e.target.closest('[data-remove]');
        if (remove) {
            phrase.splice(Number(remove.dataset.remove), 1);
            renderPhrase();
            return;
        }
        const sound = e.target.closest('[data-sound]');
        if (sound) {
            setPlaying(sound);
            playWords([{ sequence: [{ p: sound.dataset.sound }] }], { onEnd: () => setPlaying(null) });
        }
    });

    document.getElementById('phrase-play').addEventListener('click', () => {
        const chips = () => document.querySelectorAll('.phrase-chip');
        playWords(phrase.map(id => wordsById[id]), {
            onWord: i => setPlaying(chips()[i]),
            onEnd: () => setPlaying(null),
        });
    });
    document.getElementById('phrase-clear').addEventListener('click', () => {
        phrase.length = 0;
        renderPhrase();
    });
    document.getElementById('stop-all').addEventListener('click', () => {
        stopAll();
        setPlaying(null);
    });
    document.getElementById('volume').addEventListener('input', e => {
        engine.volume = Number(e.target.value);
        if (engine.chain) engine.chain.master.gain.setTargetAtTime(engine.volume, engine.ctx.currentTime, 0.05);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    wireEvents();
    try {
        const response = await fetch(NOISE_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        render(jsyaml.load(await response.text()));
    } catch (error) {
        console.error('Failed to load Fire Born noise:', error);
        document.getElementById('noise-words').innerHTML = '<p class="error">Error loading the Fire Born dictionary.</p>';
    }
});
