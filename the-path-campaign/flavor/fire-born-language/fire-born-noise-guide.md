# Fire Born Noise — Guide

_How to make new Fire Born words, and how the sounds are synthesized._

The dictionary lives in [`fire-born-noise.yaml`](./fire-born-noise.yaml). The webapp's **Noise** page (`path-webapp/noise.html`, under Flavor) reads it and plays every word live. There are no audio files: each word is built from six base sounds the moment you press play. To add or change a word, edit the YAML and reload the page.

---

## Part 1 — Flavor: what a Fire Born word should feel like

### Who is speaking

The Fire Born were divine servants, built to carry out a god's will. They refused to abandon him when he was imprisoned, and were bound to their braziers as punishment. Thousands of years of that have made them alien. They no longer fully understand mortal language, and mortals do not understand them.

Their speech is not a voice. It is the sound of what they are: the drone of something vast, the brazier crackling, steam, and a hush. Everything they say is built from six sounds.

### Everything vs. Nothing

The cosmology pits **Fire Born = Everything (sound, presence)** against **Mist Born = Nothing (silence, absence)**. Lean into it:

- Fire Born words **fill the air**. Drones hang, crackle lives.
- The Mist root is the **hush**: the one soft sound in the language. Even when naming the mist, the Fire Born go quiet.

### Six roots, one per sound

Each base sound is one root. Every word is one root on its own or a combination of them.

| Base sound | Root | Use it for |
|---|---|---|
| Low Drone | **Ground** | Places, weight, bodies, things, standing still |
| Flame Crackle | **Flame** | Fire, life, the Fire Born, yes |
| Hiss | **Danger** | Threat, foes, warning, no |
| High Drone | **Sacred** | The god, relics, asking, attention |
| Hovering | **Motion** | Movement, travel, pointing, following |
| Hushing | **Mist** | The mist, the Mist Born, quiet, calm, death |

### Three shapes

A root can be said in different shapes. The shape changes the meaning:

| Shape | How | Meaning |
|---|---|---|
| **Toward** | The sound rises in pitch | Approach, welcome, positive, a question |
| **Away** | The sound falls in pitch, or recedes and fades | Departure, refusal, negative |
| **Repeated** | The sound is said two or three times | Urgency, emphasis |

Hello and Bye are the clearest example: both are Flame + Ground, said Toward (the drone rises, the crackle builds) or Away (the drone sinks, the crackle settles).

### Each root in its shapes

Every base sound has three variants on the Noise page, and each variant is a word of its own. Rising and falling follow the Toward/Away shapes. The other variants change the root's intensity (deeper, sparser, faster, darker) and carry their own meaning.

| Root | Variant | Meaning |
|---|---|---|
| **Ground** | Rising | Here / arrive / come to this place |
| | Falling | There / far away / gone from here |
| | Deeper | Below / underground / the deep |
| **Flame** | Flaring | Strong / alight / anger |
| | Dying | Weak / failing / going out |
| | Sparse | Little / few / a spark of |
| **Danger** | Rising | Danger coming / a threat approaches |
| | Falling | Danger passing / the threat is gone |
| | Bursts | Now! / alarm |
| **Sacred** | Rising | Asking / a question / prayer |
| | Falling | Forbidden / defiled |
| | Higher | The god himself / divine attention |
| **Motion** | Slow | Wander / drift / travel |
| | Fast | Hurry / charge / flee |
| | Drifting away | Leave / go away |
| **Mist** | Long swell | The mist rising / it is coming in |
| | Darker | The deep mist / the Nothing |
| | Repeated | Quiet! / be still |

These are stored in the YAML as `meaning:` on each variant under `base_sounds`. When you add a variant, give it a meaning too.

### Building a new word

1. **Decide which roots the meaning touches.** Usually one or two, three at most.
2. **Decide the shape.** Is it toward, away, urgent, or neutral (steady)?
3. **Let one root lead.** Make it the loudest, or put it first. Three equal roots sound like mush.

**Example: "Carrier".** A carrier is a place (Ground) that holds the flame (Flame) and walks (Motion). So: a low drone with crackle on top and a slow hover underneath. Tag it `roots: [Ground, Flame, Motion]`.

**Example: "Fear".** Danger that comes from the mist, coming closer. So: a hush, then a hiss rising in pitch (Toward). Tag it `roots: [Mist, Danger, Toward]`.

**Example: "Hurry".** Motion, urgently. So: a fast hover, said twice. Tag it `roots: [Motion, Repeated]`.

### Rules of thumb

1. **Never translate at the table.** The players hear only the noise. Their understanding should come from repetition and the roots, not from you.
2. **Keep words short:** about 1 to 3 seconds. Phrases are built by chaining words in the phrase bar. Long words make phrases tiring.
3. **One meaning, one sound.** Don't let a root drift. If Hiss means Danger, never use it for something friendly, or the players can't learn it.
4. **The shape carries the most meaning.** If you're unsure how a word should sound, decide first whether it's toward or away.

### Using it in play

- Use the **phrase bar** for conversation: queue words with **+**, then press **Speak**. "Mist Born · Danger · Follow" is a whole message.
- Add **What?** after a word to make it a question: "Relic · What?" is "Is that a relic?"
- The Fire Born talk through their flame as well. Describe the brazier brightening toward allies and dimming toward threats while the sound plays. Together, the sound and the flame are all the players get.
- When players start guessing roots correctly, let them. Their sense of slowly understanding is the payoff.

---

## Part 2 — How the synthesis works

All sound is made in the browser with the **Web Audio API**: oscillators (pure tones), noise, filters and volume envelopes, connected together. The engine is `path-webapp/js/noise.js`. You don't need to read it to make words, but knowing what each sound does helps when tuning parameters.

### Low Drone (`lowDrone`): Ground

Several deep tones (around 48 Hz by default) plus an octave below and a couple of harmonics above. The trick is **beating**: two of the tones sit a fraction of a Hz apart (`beat`), so they drift in and out of step and the volume swells and dips slowly. A single pure tone sounds electronic; a beating pair sounds like a presence in the room. `pitch` → `to` glides it up (Toward) or down (Away).

### Flame Crackle (`crackle`): Flame

Random pops of different sizes. Each pop is a tiny burst of noise that fades in a few milliseconds. The engine places pops one at a time by asking "how long until the next one?", based on the density at that moment. So `density` → `toDensity` makes the fire build up (flaring) or thin out (dying) naturally, and `gain` → `toGain` makes it louder or quieter over time.

### Hiss (`hiss`): Danger

Bright noise (random static) through a filter that keeps only the high, sharp part, around 5,000 to 9,000 Hz. The filter can sweep (`pitch` → `toPitch`): sweeping up sounds like pressure building, sweeping down like steam letting off. `attack` and `release` set how fast it fades in and out. Short values give a sharp hiss; long values give a soft swell.

### High Drone (`highDrone`): Sacred

A glassy tone (650 Hz by default) with a second tone a few Hz away for a shimmer, a slight vibrato (the pitch wavers about five times a second), and two **undertones** an octave and two octaves below. The undertones blend in as part of one sound, giving it body instead of a thin whistle. `under: 0` removes them for a purer, higher tone.

### Hovering (`hover`): Motion

A soft mid tone (180 Hz by default) whose volume pulses on and off at `rate` times per second, the "wub-wub", while its pitch drifts slowly. Slow rates feel like floating; fast rates feel like something charging. `rate` → `toRate` makes the throb speed up (pulling you along) or slow down. `fade: true` lets it drift away into silence.

### Hushing (`hush`): Mist

The same noise as the hiss, but filtered much lower and softer (around 1,600 Hz), with a slow swell in and out and a gentle wavering in volume, like breath. Lower `pitch` makes it darker. `pitch` → `toPitch` makes it creep in or recede. Hiss and hush are deliberately twins: the same material, one sharp and one gentle, for Danger and Mist.

### The room

Every word goes through a reverb (an echo built from decaying noise, so it sounds like a dark hall) and a compressor that keeps loud words from clipping. Each play also shifts pitch slightly at random, so the same word never sounds exactly the same twice. That's what keeps it feeling alive rather than recorded.

---

## Part 3 — Writing a word in the YAML

```yaml
- id: carrier                    # unique, kebab-case
  word: Carrier                  # shown on the button
  category: Things               # must match one of `categories`
  roots: [Ground, Flame, Motion] # roots and shapes it uses (shown as tags)
  note: Optional GM note shown under the word.
  sequence:
    - { p: lowDrone, pitch: 44, dur: 2.5 }
    - { p: crackle, dur: 2.5, density: 15, gain: 0.7, with: true }
    - { p: hover, dur: 2.5, pitch: 160, rate: 2, gain: 0.6, with: true }
```

Each step in `sequence` names a sound (`p`) plus any parameters. The full parameter list for each sound is in the YAML under `sounds`. Leave a parameter out to use its default.

**Timing:**

| Key | Meaning |
|---|---|
| _(nothing)_ | Starts right after the previous sound ends |
| `gap: 0.2` | Waits 0.2 s after the previous sound. A negative gap overlaps it |
| `with: true` | Starts at the same moment as the previous sound |
| `at: 1.0` | Starts 1.0 s after the word begins, regardless of what came before |

**Saying a root in a shape:**

| Shape | How to write it |
|---|---|
| Toward | Drones and hover: `to` higher than `pitch`. Hiss and hush: `toPitch` higher. Crackle: `toDensity` higher |
| Away | The same, but lower. Hover can also use `fade: true` |
| Repeated | The same step two or three times, with a small `gap` |

**Tuning tips:**

- **Too quiet or too loud?** Change `gain` (1 is the default; 0.5 is half).
- **Low drone inaudible?** It's very deep. Raise `pitch` toward 60, or listen on headphones; phone and laptop speakers barely play it.
- **High drone too piercing?** Lower `pitch`, or keep `under` at 1 for more body.
- **Hiss too abrupt?** Raise `attack` and `release`.
- **Hover too wobbly?** Lower `rate`.
- Each base sound and its variants can be played at the top of the Noise page. Start there to hear what a sound does before using it in a word.
