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
- The Mist root is the **hiss**: water hitting a brazier. When a Fire Born names the mist, it makes the sound of itself being smothered. To them, the mist and danger are one and the same thing.
- **Flame (Life) against hiss (Mist)** is the core opposition of the language. Death is the two together: a dying crackle doused by a hiss.

### Six roots, one per sound

Each base sound is one root with its own category. Every word is one root on its own or a combination of them.

| Base sound | Root | Use it for |
|---|---|---|
| Low Drone | **Things** | Objects and places, here and there, the deep |
| Flame Crackle | **Life** | We, the Fire Born, being alive, strength and weakness |
| Hiss | **Mist** | The mist, the Mist Born, danger, threat, foes |
| High Drone | **The God** | The god, holy things and artifacts (the same word), prayer, asking |
| Hovering | **Motion** | Coming and going |
| Hushing | **Tactics** | Waiting, hiding, quiet, holding position |

A high tone is holy and a low tone is mundane: a relic is a high drone, an ordinary object a low one. Tactics is the one root players might guess straight away, because "shh" means "quiet" to humans too. That's intended: it gives them a foothold.

### Three shapes

A root can be said in different shapes. The shape changes the meaning:

| Shape | How | Meaning |
|---|---|---|
| **Toward** | The sound rises in pitch | Approach, here, positive, a question |
| **Away** | The sound falls in pitch, or recedes and fades | Departure, there, negative |
| **Repeated** | The sound is said two or three times | Urgency, emphasis |

Hello and Bye are the clearest example: both are Life + Things, said Toward ("alive, here": the drone rises, the crackle builds) or Away ("alive, there": the drone sinks, the crackle settles).

### Each root in its shapes

Every base sound has a steady form and three variants on the Noise page, and each one is a word of its own. Rising and falling follow the Toward/Away shapes. The other variants change the root's intensity (deeper, sparser, faster, darker) and carry their own meaning.

| Root | Variant | Meaning |
|---|---|---|
| **Things** | Steady | Thing / object / something |
| | Rising | Here / this place / near |
| | Falling | There / that place / far |
| | Deeper | Below / underground / the deep |
| **Life** | Steady | We / the Fire Born / alive |
| | Flaring | Strong / burning bright |
| | Dying | Weak / fading / hurt |
| | Sparse | A spark: small / few / young |
| **Mist** | Steady | The mist / danger |
| | Rising | The mist is coming / a threat approaches |
| | Falling | The mist withdraws / the threat is gone |
| | Bursts | Danger now! / alarm |
| **The God** | Steady | Holy / artifact |
| | Rising | Prayer / asking (What?) |
| | Falling | Defiled / destroyed |
| | Higher | The God himself |
| **Motion** | Steady | Moving / travel |
| | Coming | Come / approach / toward us |
| | Going | Go / leave / away from us |
| | Fast | Hurry / charge / flee |
| **Tactics** | Steady | Careful / a plan |
| | Long swell | Wait / hold position |
| | Darker | Hide / stay unseen |
| | Repeated | Quiet! / be still |

These are stored in the YAML under `base_sounds`: `meaning:` on the base sound for the steady form, and `meaning:` on each variant. When you add a variant, give it a meaning too.

**Yes and No are combination words.** Each is an evaluation plus a direction:

- **Yes** = Life flaring + Motion coming: "I burn bright, it comes to me."
- **No** = Mist + Motion going: "Mist, away."

### Building a new word

1. **Decide which roots the meaning touches.** Usually one or two, three at most.
2. **Decide the shape.** Is it toward, away, urgent, or neutral (steady)?
3. **Let one root lead.** Make it the loudest, or put it first. Three equal roots sound like mush.

**Example: "Carrier".** A carrier is a thing (Things) that holds a living flame (Life) and walks (Motion). So: a low drone with crackle on top and a slow hover underneath. Tag it `roots: [Things, Life, Motion]`.

**Example: "Ambush".** Hiding (Tactics), then danger (Mist) coming at someone. So: a dark hush, then a hiss rising in pitch (Toward). Tag it `roots: [Tactics, Mist, Toward]`.

**Example: "Mortals".** Small flames (Life, sparse), many of them. So: a sparse crackle, said twice. Tag it `roots: [Life, Repeated]`.

### Rules of thumb

1. **Never translate at the table.** The players hear only the noise. Their understanding should come from repetition and the roots, not from you.
2. **Keep words short:** about 1 to 3 seconds. Phrases are built by chaining words in the phrase bar. Long words make phrases tiring.
3. **One meaning, one sound.** Don't let a root drift. If Hiss means Mist, never use it for something friendly, or the players can't learn it.
4. **The shape carries the most meaning.** If you're unsure how a word should sound, decide first whether it's toward or away.

### Using it in play

- Use the **phrase bar** for conversation: queue words with **+**, then press **Speak**. "Mist Born · Here · Hide" is a whole message.
- Add **What?** after a word to make it a question: "Relic · What?" is "Is that a relic?"
- The Fire Born talk through their flame as well. Describe the brazier brightening toward allies and dimming toward threats while the sound plays. Together, the sound and the flame are all the players get.
- When players start guessing roots correctly, let them. Their sense of slowly understanding is the payoff.

---

## Part 2 — How the synthesis works

All sound is made in the browser with the **Web Audio API**: oscillators (pure tones), noise, filters and volume envelopes, connected together. The engine is `path-webapp/js/noise.js`. You don't need to read it to make words, but knowing what each sound does helps when tuning parameters.

### Low Drone (`lowDrone`): Things

Several deep tones (around 48 Hz by default) plus an octave below and a couple of harmonics above. The trick is **beating**: two of the tones sit a fraction of a Hz apart (`beat`), so they drift in and out of step and the volume swells and dips slowly. A single pure tone sounds electronic; a beating pair sounds like a presence in the room. `pitch` → `to` glides it up (Toward) or down (Away).

### Flame Crackle (`crackle`): Life

A fire in three layers. Random pops alone sound like static or rain; it's the layers together that make the ear hear "fire":

1. **Lapping:** low, rumbling noise whose volume flickers at random. This is the body of the fire. `body` sets how loud it is (default 0.35).
2. **Crackles:** each pop is a tiny burst of noise sent through a **resonator**, a filter that rings at one pitch. Every pop gets its own random pitch and ring length, so it sounds like wood splitting rather than static. Most pops are small, bright ticks; a few are big, low snaps.
3. **Hiss:** a faint, bright layer that rides the same flicker as the lapping.

The engine places pops one at a time by asking "how long until the next one?", based on the density at that moment. Everything can change over the length of the sound:

- `density` → `toDensity`: pops per second.
- `gain` → `toGain`: overall loudness.
- `size` → `toSize`: bigger pops are lower and ring longer, and more of them are big snaps. A flare grows; a dying fire shrinks to tiny ticks.
- `body` → `toBody`: the lapping underneath. A flare's body swells; a dying fire's falls away.
- `tone` → `toTone`: brightness. Sweeping it down muffles the fire, like embers under ash.

`dying: true` is a shortcut that does all of it at once: fewer pops, quieter, smaller, less body and duller toward the end.

### Hiss (`hiss`): Mist

Bright noise (random static) through a filter that keeps only the high, sharp part, around 5,000 to 9,000 Hz. The filter can sweep (`pitch` → `toPitch`): sweeping up sounds like pressure building, sweeping down like steam letting off. `attack` and `release` set how fast it fades in and out. Short values give a sharp hiss; long values give a soft swell.

### High Drone (`highDrone`): The God

A glassy tone (650 Hz by default) with a second tone a few Hz away for a shimmer, a slight vibrato (the pitch wavers about five times a second), and two **undertones** an octave and two octaves below. The undertones blend in as part of one sound, giving it body instead of a thin whistle. `under: 0` removes them for a purer, higher tone.

### Hovering (`hover`): Motion

A soft mid tone (180 Hz by default) whose volume pulses on and off at `rate` times per second, the "wub-wub", while its pitch drifts slowly. Slow rates feel like floating; fast rates feel like something charging. `rate` → `toRate` makes the throb speed up (pulling you along) or slow down. `fade: true` lets it drift away into silence.

### Hushing (`hush`): Tactics

The same noise as the hiss, but filtered much lower and softer (around 1,600 Hz), with a slow swell in and out and a gentle wavering in volume, like breath. Lower `pitch` makes it darker. `pitch` → `toPitch` makes it creep in or recede. Hiss and hush are deliberately twins: the same material, one sharp and one gentle, for Mist and Tactics. Keep Tactics words soft and slow and Mist words sharp so the two stay apart.

### The room

Every word goes through a reverb (an echo built from decaying noise, so it sounds like a dark hall) and a compressor that keeps loud words from clipping. Each play also shifts pitch slightly at random, so the same word never sounds exactly the same twice. That's what keeps it feeling alive rather than recorded.

---

## Part 3 — Writing a word in the YAML

```yaml
- id: carrier                    # unique, kebab-case
  word: Carrier                  # shown on the button
  category: Things               # must match one of `categories`
  roots: [Things, Life, Motion]  # roots and shapes it uses (shown as tags)
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
