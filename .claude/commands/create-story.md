# Create Story Command

You are helping the user create a new Story for "The Path" campaign through collaborative iteration.

Stories are the tales told at the bar of the **Cloudburst Inn** — self-contained one-shots the players take the parts in. The Host begins a story, the party cannot decline, and they play characters inside it. Mechanically the party spends 1 short rest and gains the effects of a long rest; the Path does not end.

A Story is therefore a **vessel**: lore from outside the mist, the world before it came, or somewhere the party would otherwise never reach — dropped into a session without breaking campaign pace.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files before beginning.

Read `the-path-campaign/lore/stories/shadow-clan-contract.yaml` as the reference implementation.

## Process Overview

Work through the story **one element at a time**. Do NOT generate all sections automatically. Propose a single piece, wait for a reaction, refine it in the user's own words, then move on. Use the `/give-me-five` approach when the user wants options.

**Preserve the user's phrasing.** They frequently rewrite a line; keep their intent and voice rather than prettifying it away. Fix only clear typos, and say which ones you fixed.

---

## Authoring Order vs File Order

These are deliberately different.

**Author in this order:**

1. `background` — the lore the story reveals
2. `characters` — who the players play
3. `goals` — what they are there to do
4. `locations` — the place-points
5. `steps` — the run of play, including all mechanics
6. `ending` — how it stops
7. `summary` — **written last**

**Write the file in this order:**
`name` → `difficulty` → `summary` → `background` → `characters` → `goals` → `locations` → `steps` → `ending`

A summary written first becomes a straitjacket. A summary written last is an actual summary.

---

## Step 1: Background

The lore the story reveals — the world the tale takes place in, not the plot.

This is where the story earns its place: it should tell the table something about the setting they could not learn on the Path. Keep the user's voice exactly. If they write it as a litany, a list, or a chant, preserve the line breaks — the rhythm is the content.

## Step 2: Characters

Who the players play. This field takes **two shapes** — ask which:

- **A build spec:** "Everyone makes a new character: this ancestry, this community, one of these classes." Fast, and the players own their character.
- **A cast list:** pre-made roles with names and histories, handed out at the table.

**Verify every build element against the SRD** before writing it down:

- Ancestries, communities and classes: `lib/og-dhsrd/index.html`
- Some names differ from memory — the SRD spells it **Slyborne**, not Slyborn

## Step 3: Goals

What the characters are there to do. Prefer **one clean objective** — this is a one-shot.

Resist adding secondary or hidden goals unless the user wants them. "Who gave the contract" and "what exactly counts as done" are often stronger left unstated, and the user may say so explicitly.

## Step 4: Locations

**Place-points only.** A name and a description of what the place is.

No mechanics here. No rolls, no counters, no adversary counts. Those all live in `steps`. Keeping this field pure means the locations stay reusable prose while the steps hold everything specific to this telling.

```yaml
locations:
  - name: The Bridge
    description: The only way into the fort. Narrow enough that two stand abreast and no more. No railing, and a long way down.
```

## Step 5: Steps

The run of play, numbered, holding **all** mechanics:

- Countdowns and their roll tables
- Adversaries, their placement and their behaviour
- Skill checks and their difficulty
- Branches — "if the alarm goes up, run X here instead and skip steps N and N+1"
- Encounter tables, inside the step where the fight happens

```yaml
steps:
  - step: 2
    name: The climb
    description: |
      ...mechanics, tables, rules...
    questions: Optional GM prompt for this step.
```

**Branches are steps, not locations.** A rule about sequence ("skip ahead if this happened") cannot be expressed in a location entry.

### Countdowns

The SRD's Progress Countdown shape works well and is worth reaching for:

| Roll result       | Countdown      |
|-------------------|----------------|
| Critical success  | tick down 3    |
| Success with Hope | tick down 2    |
| Success with Fear | tick down 1    |
| Failure with Hope | no advancement |
| Failure with Fear | tick up 1      |

Pick the starting value for the weight you want: **12** makes the obstacle a set piece; **8** makes it an approach. Attach the consequence to failure-with-Fear rather than to a GM Fear spend, so the GM has nothing to decide and the obstacle cannot be softened.

### Encounters

If the story has a fight, build the table in the style of `the-path-campaign/adversaries/Example Encounters.md`, scaled 2–6 PCs.

**Battle Points = 3 × (number of PCs) + 2**

| Adversary Type | BP |
|----------------|----|
| Minions (equal to number of PCs) | 1 |
| Social or Support | 1 |
| Horde, Ranged, Skulk, or Standard | 2 |
| Leader | 3 |
| Bruiser | 4 |
| Solo | 5 |

**Always verify adversary tier and type against the SRD** rather than trusting a reference file:

    grep -aoE '"<Name>".{0,260}' lib/og-dhsrd/scripts/og-dhsrd-features.js

Leading context does not work on those lines — trailing only. Reference files drift; `Example Encounters.md` has at least one wrong tier in it.

Reserve **1–2 BP for environmental hazards** if the location itself should do something.

## Step 6: Ending

How the story stops. Short. These are told over a bar, so they can simply end — no epilogue, no return home, no reveal.

## Step 7: Summary

Written **last**, placed **first**. Two or three sentences: who the players are, what the story is, what shape it has. Mention if players make new characters for it.

Do not include a runtime estimate unless the user asks for one.

## Step 8: Difficulty

A single `difficulty` value for the story's own rolls (climbs, alarms, skill checks). Adversaries keep their own difficulties from their stat blocks.

Tier-appropriate: 11 (T1), 14–15 (T2), 17–18 (T3).

---

## Step 9: Compile

Write to `the-path-campaign/lore/stories/[story-name].yaml`

```yaml
name: [Story Name]
difficulty: [Number]

summary: |
  [Written last]

background: |
  [The lore the story reveals]

characters: |
  [Build spec or cast list]

goals: |
  [One clean objective]

locations:
  - name: [Place]
    description: [What it is — no mechanics]

steps:
  - step: 1
    name: [Step name]
    description: |
      [All mechanics live here]
    questions: [Optional GM prompt]

ending: |
  [How it stops]
```

**Do not add an `id:` field** — the filename is the identifier.

## Step 10: System Integration

- [ ] Verify the YAML parses cleanly
- [ ] Regenerate the webapp index: `node .github/scripts/generate-index.js`
- [ ] Confirm the story appears at `path-webapp/stories.html` and renders at `story.html?id=[story-name]`

Stories are **not** locations: they get no Glossary row, no tarot card, and no grid position.

---

## Important Guidelines

**DO:**

- Work one element at a time, waiting for a real reaction between each
- Offer options (usually 5) when the user wants variety
- Verify every SRD reference — ancestries, classes, adversary tiers and types
- Keep `locations` free of mechanics
- Put branches in `steps`
- Preserve the user's phrasing and rhythm

**DON'T:**

- Draft several fields in one message
- Write the summary before the story exists
- Trust a reference file's tier or type without checking the SRD
- Add an `id:` field, or a Glossary/tarot entry
- Pad the ending with an epilogue

---

## Session Checklist

- [ ] Background (lore revealed)
- [ ] Characters (build spec or cast, SRD-verified)
- [ ] Goals (one objective)
- [ ] Locations (place-points, no mechanics)
- [ ] Steps (all mechanics, branches, encounter table)
- [ ] Ending
- [ ] Summary (last)
- [ ] Difficulty set
- [ ] YAML written to `lore/stories/`, parses cleanly
- [ ] Index regenerated, page renders
