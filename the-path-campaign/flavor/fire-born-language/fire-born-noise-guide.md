# Fire Born Noise — Guide

_How to make new Fire Born words, and how the sounds are synthesized._

The dictionary lives in [`fire-born-noise.yaml`](./fire-born-noise.yaml). The webapp's **Noise** page (`path-webapp/noise.html`, under Flavor) reads it and plays every word live. There are no audio files: each word is built from a few basic sounds the moment you press play. To add or change a word, edit the YAML and reload the page.

---

## Part 1 — Flavor: what a Fire Born word should feel like

### Who is speaking

The Fire Born were divine servants, built to carry out a god's will. They refused to abandon him when he was imprisoned, and were bound to their braziers as punishment. Thousands of years of that have made them alien. They no longer fully understand mortal language, and mortals do not understand them.

Their sound comes from three sources, and every word should feel like it is made of these:

| Source | What it sounds like | Building blocks |
|---|---|---|
| **The iron body** | Groaning, creaking, grinding, being struck | `groan`, `creak`, `grind`, `clank`, `thud` |
| **The brazier** | Roaring, crackling, hissing steam | `roar`, `crackle`, `hiss` |
| **The god** | Bells and a humming in the air | `chime`, `hum`, `horn` |

### Everything vs. Nothing

The cosmology pits **Fire Born = Everything (sound, presence)** against **Mist Born = Nothing (silence, absence)**. Lean into it:

- Fire Born words are **loud, heavy and resonant**. They take up space.
- The only quiet words are the ones about the mist (`Mist`, `Mist Born`). Even saying its name, the Fire Born go muffled, as if the word itself swallows sound. Mist words use the `mm` vowel and a `drop` stutter, so the voice cuts out.

### Roots: make it learnable

The words share sound **roots** (listed in the YAML under `roots`). This is what separates a language from random noise. A new word should be built from the roots its meaning touches:

| Root | Sound | Use it for |
|---|---|---|
| Toward | Rising groan | Approach, welcome, asking, anything good |
| Away | Falling groan | Leaving, refusal, threat, anything bad |
| Flame | Roar | Fire, the Fire Born, safety |
| Mist | Hiss + muffled groan | The mist, Mist Born, the Nothing |
| Thing | Clank | Objects, matter |
| Sacred | Chime | The god, relics, what must be honored |
| Ground | Thud | Places, standing, moving across land |
| Alarm | Rapid clanks | Urgency, danger |

**Example: building "Carrier".** A carrier is a place (Ground) that holds the flame (Flame) and walks. So: two `thud`s like footsteps, a `roar` underneath, and a slow `grind` of its joints. Tag it `roots: [Ground, Flame]`.

**Example: building "Fear".** Something bad (Away) that comes from the mist (Mist). So: a `hiss` with a falling `groan` in the `mm` vowel.

### Rules of thumb

1. **Never translate at the table.** The players hear only the noise. Their understanding should come from repetition and the roots, not from you.
2. **Keep words short:** about 1 to 3 seconds. Phrases are built by chaining words in the phrase bar. Long words make phrases tiring.
3. **One root should lead.** If a word mixes three roots at equal weight, it sounds like mush. Let the main root be loudest or come first.
4. **Repetition means intensity.** "Help" is a rising groan said twice. "Danger" is clanks stacked fast. Repeating a part is how the Fire Born add emphasis.
5. **Rising vs. falling carries the most meaning.** If you're unsure how a word should sound, decide first whether it's toward or away.
6. **Keep a little wrongness.** Leave some roughness (`rough`) in groans. A perfectly clean tone sounds like a machine; a slightly broken one sounds ancient.

### Using it in play

- Use the **phrase bar** for conversation: queue words with **+**, then press **Speak**. "Mist Born · Danger · Follow" is a whole message.
- Add **What?** after a word to make it a question: "Relic · What?" is "Is that a relic?"
- The Fire Born talk through their flame as well. Describe the brazier brightening toward allies and dimming toward threats while the sound plays. Together, the sound and the flame are all the players get.
- When players start guessing meanings correctly, let them. Their sense of slowly understanding is the payoff.

---

## Part 2 — How the synthesis works

All sound is made in the browser with the **Web Audio API**: oscillators (pure tones), noise, filters and volume envelopes, connected together. The engine is `path-webapp/js/noise.js`. You don't need to read it to make words, but knowing what each building block does helps when tuning parameters.

### The iron-golem voice (`groan`, `horn`, `creak`, `grind`)

The heavy, creaky voice comes from three stages:

1. **A pulse train: the vocal cords.** A stream of tiny clicks. The number of clicks per second is the pitch (`from` → `to`, in Hz). The trick is that each click is a little **early or late** (`rough`) and a little **louder or softer** (shimmer). A perfectly regular stream sounds electronic; an irregular one sounds like metal grinding against metal.
   - Slow clicks (under ~25 per second) are heard individually: a **creaking hinge**. That's `creak`.
   - Fast clicks (30 to 120 per second) blur into a buzzing tone: a **voice**. That's `groan`.
   - `drop` randomly skips clicks, so the voice stutters and catches.
   - `wobble` adds a slow waver to the pitch, like strain.
2. **Formant filters: the mouth.** Four narrow filters pick out the frequencies that make a vowel sound like a vowel (`oo`, `oh`, `ah`, `eh`, `ee`, `uh`, and the closed `mm`). Sliding from `vowel` to `toVowel` makes the groan "say" something without it being a real word.
3. **A comb filter: the hollow iron chest.** The sound is fed back into itself after a few milliseconds. That makes it ring at one pitch, the way a voice would sound coming from inside a hollow metal body. `ring` sets how strongly it resonates (0 to 0.9).

`horn` is the same voice with very little roughness and a deep extra tone underneath, so it sounds like a long call across distance. `grind` is a very rough, slow pulse train plus chopped noise: gears catching.

### Struck metal (`clank`, `thud`, `chime`)

A struck metal plate doesn't ring at one pitch. It rings at several pitches that **don't fit together musically**, and the high ones fade faster than the low ones. The clank adds up eight such tones (modal synthesis) plus a tiny burst of noise for the moment of impact.

- `pitch`: how big the piece of metal is (lower = heavier).
- `ring`: how long it rings.
- `weight`: adds a falling low thump, like something very heavy.
- `damp`: muffles it, like metal hit while held or wrapped.

`chime` uses the same idea with bell proportions (from Jean-Claude Risset's classic synthesized bell). `thud` is a deep falling tone, a burst of low noise, and a muffled low clank: one footstep of a construct.

### The brazier (`roar`, `crackle`, `hiss`)

These are all built from **noise** (random static) shaped by filters:

- `roar`: low noise whose filter opens up and closes again, so it swells and settles like a flame flaring. It carries some crackle on top.
- `crackle`: random pops of different sizes scattered through time. `density` is pops per second. `dying: true` bunches them toward the start, so the fire dies out.
- `hiss`: high noise through a filter that can sweep (`pitch` → `toPitch`). A downward sweep sounds like steam settling, or mist creeping in.

### The air (`hum`)

Several pure tones, some tuned slightly apart so they **beat** against each other, plus a slow swell in volume. That gives a deep shimmering drone, the "air that shimmers" from the rumors about the Fire Born.

### The room

Every word goes through a reverb (an echo built from decaying noise, so it sounds like a dark metal hall) and a compressor that keeps loud words from clipping. Each play also shifts pitch and timing slightly at random, so the same word never sounds exactly the same twice. That's what keeps it feeling alive rather than recorded.

---

## Part 3 — Writing a word in the YAML

```yaml
- id: carrier                 # unique, kebab-case
  word: Carrier               # shown on the button
  category: Things            # must match one of `categories`
  roots: [Ground, Flame]      # which roots it uses (shown as tags)
  note: Optional GM note shown under the word.
  sequence:
    - { p: thud }
    - { p: thud, gap: 0.3 }
    - { p: roar, dur: 1.6, gain: 0.6, at: 0 }
    - { p: grind, dur: 1.0, rate: 24, gain: 0.5, at: 0.4 }
```

Each step in `sequence` names a building block (`p`) plus any parameters. The full parameter list for each block is in the YAML under `sounds`. Leave a parameter out to use its default.

**Timing:**

| Key | Meaning |
|---|---|
| _(nothing)_ | Starts right after the previous sound ends |
| `gap: 0.2` | Waits 0.2 s after the previous sound. A negative gap overlaps it |
| `with: true` | Starts at the same moment as the previous sound |
| `at: 1.0` | Starts 1.0 s after the word begins, regardless of what came before |

**Tuning tips:**

- **Too quiet or too loud?** Change `gain` (1 is the default; 0.5 is half).
- **Groan too buzzy?** Lower `from`/`to` toward 30 to 45. **Too creaky?** Raise them above 60, or lower `rough`.
- **Groan too clean or electronic?** Raise `rough` (0.2 to 0.35) and add some `drop`.
- **Clank too bright?** Lower `pitch` or add `damp: true`.
- **Too much echo on the groan?** Lower `ring`.
- Each building block can be played on its own with default settings under "Building blocks" at the bottom of the Noise page. Start there to hear what a block does before using it in a word.
