// Noise page — the Fire Born's words, synthesized from scratch with the Web Audio API.
// The dictionary (base sounds, roots, shapes, words) lives in
// the-path-campaign/flavor/fire-born-language/fire-born-noise.yaml.
// This file is only the synth engine: it knows how to voice the six base sounds, and plays a
// word by scheduling its sequence of sounds.
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

// Attack / hold / release gain envelope, exponential (sounds natural for fading tones).
function envelope(ctx, t, { attack = 0.01, hold = 0, release = 0.3, peak = 1 }) {
    const g = ctx.createGain();
    const p = Math.max(peak, 0.0002);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(p, t + attack);
    g.gain.setValueAtTime(p, t + attack + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + hold + release);
    return g;
}

// Envelope for sustained sounds: fade in, hold, fade out, filling exactly `dur`.
function sustain(ctx, t, dur, peak, { attack = Math.min(0.6, dur * 0.3), release = Math.min(0.9, dur * 0.4) } = {}) {
    return envelope(ctx, t, { attack, hold: Math.max(0, dur - attack - release), release, peak });
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

// An oscillator gliding from f to `to` over the sound's length.
function glide(ctx, type, f, to, t, dur) {
    const o = osc(ctx, type, f, t, dur);
    o.frequency.setValueAtTime(f, t);
    if (to !== f) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    return o;
}

// A filter whose center frequency sweeps from `from` to `to` over the sound's length.
function sweepFilter(ctx, type, from, to, q, t, dur) {
    const f = filter(ctx, type, from, q);
    f.frequency.setValueAtTime(from, t);
    if (to !== from) f.frequency.exponentialRampToValueAtTime(to, t + dur);
    return f;
}

function bufferSource(ctx, buf, t) {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.start(t);
    return src;
}

// ─── The six base sounds ─────────────────────────────────────────────────────
// Each takes (ctx, dest, startTime, params, rnd, pitchJitter) and returns how long it "occupies"
// in the sequence. Params come straight from the YAML; anything left out uses its default.

const SOUNDS = {
    // Things. Deep tones a fraction of a Hz apart, so they beat slowly: felt more than heard.
    lowDrone(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 3;
        const f = (p.pitch ?? 48) * pj;
        const to = p.to != null ? p.to * pj : f;
        const beat = p.beat ?? 0.7;
        const lp = filter(ctx, 'lowpass', 500);
        [[1, 0, 1], [1, beat, 0.9], [0.5, 0, 0.6], [2, beat * 1.5, 0.4], [3, 0, 0.15]].forEach(([r, off, a]) => {
            const g = ctx.createGain();
            g.gain.value = a;
            glide(ctx, 'sine', f * r + off, to * r + off, t, dur).connect(g).connect(lp);
        });
        lp.connect(sustain(ctx, t, dur, (p.gain ?? 1) * 0.3)).connect(dest);
        return dur;
    },

    // Life. Pops scattered through time. Density, loudness, pop size and brightness can all ramp
    // (density → toDensity, gain → toGain, size → toSize, tone → toTone). A flare grows denser,
    // louder and fuller (bigger pops, lower `highpass` lets their body through); a dying fire
    // thins out, shrinks and goes dull (tone sweeping down muffles it like embers).
    crackle(ctx, dest, t, p, rnd) {
        const dur = p.dur ?? 1.2;
        const dying = !!p.dying;
        const d0 = p.density ?? 25;
        const d1 = p.toDensity ?? (dying ? d0 * 0.08 : d0);
        const g0 = p.gain ?? 1;
        const g1 = p.toGain ?? (dying ? g0 * 0.3 : g0);
        const s0 = p.size ?? 1;
        const s1 = p.toSize ?? (dying ? s0 * 0.4 : s0);
        const tone0 = p.tone ?? 14000;
        const tone1 = p.toTone ?? (dying ? 1600 : tone0);
        const sr = ctx.sampleRate;
        const n = Math.ceil(dur * sr);
        const buf = ctx.createBuffer(1, n, sr);
        const d = buf.getChannelData(0);
        let time = 0;
        while (true) {
            const x = time / dur;
            // Wait time to the next pop depends on the density at this moment.
            time += -Math.log(1 - rnd()) / Math.max(d0 + (d1 - d0) * x, 0.5);
            if (time >= dur) break;
            const pos = Math.floor(time * sr);
            const y = time / dur;
            const level = g0 + (g1 - g0) * y;
            const size = s0 + (s1 - s0) * y;
            const amp = (0.2 + 0.8 * rnd() * rnd()) * level;
            const len = Math.floor((30 + rnd() * 220) * size);
            for (let k = 0; k < len && pos + k < n; k++) {
                d[pos + k] += amp * (rnd() * 2 - 1) * Math.exp(-k / (len * 0.3));
            }
        }
        bufferSource(ctx, buf, t)
            .connect(filter(ctx, 'highpass', p.highpass ?? 1200))
            .connect(sweepFilter(ctx, 'lowpass', tone0, tone1, 0.7, t, dur))
            .connect(envelope(ctx, t, { attack: 0.05, hold: Math.max(0, dur - 0.2), release: 0.15, peak: 0.7 }))
            .connect(dest);
        return dur;
    },

    // Mist. Bright, sharp noise, like steam venting; the filter can sweep (pitch → toPitch).
    hiss(ctx, dest, t, p) {
        const dur = p.dur ?? 0.9;
        const from = p.pitch ?? 5000;
        noiseSource(ctx, t, dur)
            .connect(filter(ctx, 'highpass', 1200))
            .connect(sweepFilter(ctx, 'bandpass', from, p.toPitch ?? from, 0.8, t, dur))
            .connect(sustain(ctx, t, dur, (p.gain ?? 1) * 0.35, {
                attack: p.attack ?? Math.min(0.35, dur * 0.3),
                release: p.release ?? Math.min(0.6, dur * 0.45),
            }))
            .connect(dest);
        return dur;
    },

    // The God. A glassy tone with a slow shimmer (two tones a few Hz apart), slight vibrato, and
    // deeper undertones an octave and two octaves below (`under` scales them; 0 removes them).
    highDrone(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 3;
        const f = (p.pitch ?? 650) * pj;
        const to = p.to != null ? p.to * pj : f;
        const beat = p.beat ?? 3;
        const under = p.under ?? 1;
        const sum = ctx.createGain();
        const vibDepth = ctx.createGain();
        vibDepth.gain.value = f * 0.003;
        osc(ctx, 'sine', 5 + rnd(), t, dur).connect(vibDepth);
        [[1, 0, 1], [1, beat, 0.7], [1.5, 0, 0.18], [2.01, 0, 0.12],
         [0.5, beat * 0.5, 0.55 * under], [0.25, 0, 0.4 * under]].forEach(([r, off, a]) => {
            if (a <= 0) return;
            const o = glide(ctx, 'sine', f * r + off, to * r + off, t, dur);
            vibDepth.connect(o.frequency);
            const g = ctx.createGain();
            g.gain.value = a;
            o.connect(g).connect(sum);
        });
        sum.connect(sustain(ctx, t, dur, (p.gain ?? 1) * 0.09)).connect(dest);
        return dur;
    },

    // Motion. A floating, throbbing tone: volume pulses at `rate` (the "wub"), pitch drifts slowly.
    hover(ctx, dest, t, p, rnd, pj) {
        const dur = p.dur ?? 3;
        const f = (p.pitch ?? 180) * pj;
        const to = p.to != null ? p.to * pj : f;
        const rate = p.rate ?? 6;
        const lp = filter(ctx, 'lowpass', 1000, 1);
        const main = glide(ctx, 'triangle', f, to, t, dur);
        const driftDepth = ctx.createGain();
        driftDepth.gain.value = f * 0.04;
        osc(ctx, 'sine', 0.25 + rnd() * 0.2, t, dur).connect(driftDepth).connect(main.frequency);
        main.connect(lp);
        const subGain = ctx.createGain();
        subGain.gain.value = 0.6;
        glide(ctx, 'sine', f * 0.5, to * 0.5, t, dur).connect(subGain).connect(lp);

        const throb = ctx.createGain();
        throb.gain.value = 0.55;
        const lfo = osc(ctx, 'sine', rate, t, dur);
        lfo.frequency.setValueAtTime(rate, t);
        if (p.toRate) lfo.frequency.linearRampToValueAtTime(p.toRate, t + dur);
        const depth = ctx.createGain();
        depth.gain.value = 0.45;
        lfo.connect(depth).connect(throb.gain);

        const env = p.fade
            ? sustain(ctx, t, dur, (p.gain ?? 1) * 0.35, { attack: 0.2, release: dur * 0.75 })
            : sustain(ctx, t, dur, (p.gain ?? 1) * 0.35);
        lp.connect(throb).connect(env).connect(dest);
        return dur;
    },

    // Tactics. Soft, dark, breathy noise that swells, fades and wavers like breath. Hiss's gentle
    // twin; the filter can sweep (pitch → toPitch) so it can recede or creep in.
    hush(ctx, dest, t, p, rnd) {
        const dur = p.dur ?? 2;
        const from = p.pitch ?? 1600;
        const breath = ctx.createGain();
        breath.gain.value = 0.75;
        const depth = ctx.createGain();
        depth.gain.value = 0.25;
        osc(ctx, 'sine', 0.6 + rnd() * 0.3, t, dur).connect(depth).connect(breath.gain);
        noiseSource(ctx, t, dur)
            .connect(sweepFilter(ctx, 'bandpass', from, p.toPitch ?? from, 0.5, t, dur))
            .connect(filter(ctx, 'lowpass', 3200))
            .connect(breath)
            .connect(envelope(ctx, t, { attack: dur * 0.4, release: dur * 0.6, peak: (p.gain ?? 1) * 0.5 }))
            .connect(dest);
        return dur;
    },

    rest(ctx, dest, t, p) {
        return p.dur ?? 0.5;
    },
};

// ─── Sequencing ──────────────────────────────────────────────────────────────

// Schedules a word's sequence starting at t0. Returns its length in seconds.
//   (default)  starts after the previous sound ends, plus `gap` (default 0.06, may be negative)
//   with: true starts together with the previous sound
//   at: 1.2    starts 1.2 s after the word begins
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

// A dark hall built from decaying noise: it gives the Fire Born their size.
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
let baseSounds = [];
let rootsByName = {};
let shapeNames = new Set();

function renderBaseSound(s, i) {
    const root = rootsByName[s.root];
    const steady = s.meaning ? `
        <div class="variant-line">
            <button class="variant-btn" data-base="${i}" data-variant="-1">▶ Steady</button>
            <span class="variant-meaning">${escapeHtml(s.meaning)}</span>
        </div>` : '';
    const variants = steady + (s.variants || []).map((v, j) => `
        <div class="variant-line">
            <button class="variant-btn" data-base="${i}" data-variant="${j}">▶ ${escapeHtml(v.label)}</button>
            ${v.meaning ? `<span class="variant-meaning">${escapeHtml(v.meaning)}</span>` : ''}
        </div>`).join('');
    return `
        <div class="word-card base-card">
            <button class="word-play" data-base="${i}" data-variant="-1" title="Play">
                <span class="word-icon">▶</span>
                <span class="base-title">
                    <span class="base-root">${escapeHtml(s.root || s.name)}</span>
                    ${s.root ? `<span class="base-sound-name">${escapeHtml(s.name)}</span>` : ''}
                </span>
            </button>
            <p class="base-desc">${escapeHtml(s.description || '')}</p>
            ${root ? `<p class="word-note">${escapeHtml(root.meaning)}</p>` : ''}
            ${variants ? `<div class="variant-row">${variants}</div>` : ''}
        </div>`;
}

function renderWordCard(word) {
    const roots = (word.roots || []).map(r =>
        `<span class="root-chip${shapeNames.has(r) ? ' shape' : ''}">${escapeHtml(r)}</span>`).join('');
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
    rootsByName = Object.fromEntries((data.roots || []).map(r => [r.root, r]));
    shapeNames = new Set((data.shapes || []).map(s => s.shape));
    const categories = data.categories || [...new Set(words.map(w => w.category))];

    document.getElementById('noise-intro').innerHTML = formatDescription(data.description || '');

    baseSounds = data.base_sounds || [];
    document.getElementById('noise-base').innerHTML = baseSounds.map(renderBaseSound).join('');

    document.getElementById('noise-words').innerHTML = categories.map(cat => {
        const inCat = words.filter(w => w.category === cat);
        if (!inCat.length) return '';
        return `
            <section class="nav-section">
                <h2>${escapeHtml(cat)}</h2>
                <div class="word-grid">${inCat.map(renderWordCard).join('')}</div>
            </section>`;
    }).join('');

    const rootRows = (data.roots || []).map(r => `
        <tr><td><span class="root-chip">${escapeHtml(r.root)}</span></td><td>${escapeHtml(r.sound)}</td><td>${escapeHtml(r.meaning)}</td></tr>`);
    const shapeRows = (data.shapes || []).map(s => `
        <tr><td><span class="root-chip shape">${escapeHtml(s.shape)}</span></td><td>${escapeHtml(s.how)}</td><td>${escapeHtml(s.meaning)}</td></tr>`);
    document.getElementById('noise-roots').innerHTML =
        '<tr><th colspan="3">Roots — one per base sound</th></tr>' + rootRows.join('') +
        '<tr><th colspan="3">Shapes — how a root is said</th></tr>' + shapeRows.join('');

    document.getElementById('noise-sounds').innerHTML = (data.sounds || []).map(s => `
        <div class="sound-row">
            <button class="sound-play" data-sound="${escapeAttr(s.id)}" title="Play with defaults">▶ ${escapeHtml(s.id)}</button>
            <div><p>${escapeHtml(s.description)}</p><p class="sound-params">${escapeHtml(s.params || '')}</p></div>
        </div>`).join('');

    renderPhrase();
}

function wireEvents() {
    document.addEventListener('click', e => {
        const base = e.target.closest('[data-base]');
        if (base) {
            const s = baseSounds[Number(base.dataset.base)];
            const variant = Number(base.dataset.variant);
            const sequence = variant >= 0 ? s.variants[variant].sequence : s.sequence;
            const el = variant >= 0 ? base : base.closest('.base-card');
            if (el.classList.contains('playing')) { stopAll(); setPlaying(null); return; }
            setPlaying(el);
            playWords([{ sequence }], { onEnd: () => setPlaying(null) });
            return;
        }
        const play = e.target.closest('[data-play]');
        if (play) {
            const card = play.closest('.word-card');
            if (card.classList.contains('playing')) { stopAll(); setPlaying(null); return; }
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
