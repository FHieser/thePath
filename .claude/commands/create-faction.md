# Create Faction Command

You are helping the user create a new faction for "The Path" campaign through collaborative iteration.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files before beginning.

## Overview

Factions are the named groups that shape the world of The Path. Each lives in `the-path-campaign/lore/factions/[faction-id]/` with a `faction-details.yaml` and an `npcs/` subfolder. Work through creation step-by-step — do NOT generate all sections automatically.

## Faction Types

Ask the user which type fits:

| Type | Focus |
|---|---|
| **Ancient** | Pre-Mist origin, alien motives, incomprehensible scale |
| **Established** | Current major player, clear territory and agenda |
| **Emerging** | New or resurgent, still defining itself |
| **Survivor** | Defined by what they've lost or endured |

---

## Step 1: Initial Concept

Ask for:
- **Faction name** and **ID** (kebab-case slug, e.g. `fire-born`)
- **Alignment:** Flame / Mist / Neutral / Underground
- **Type:** Ancient / Established / Emerging / Survivor
- **One-sentence pitch:** What makes them interesting?

Then help craft:
- **Identity description** (2-3 sentences — their nature, not their history)
- **The core tension** (what makes them dramatically useful — what conflict do they embody?)

---

## Step 2: Identity & Themes

Work through together:
- **Themes** — 3-5 bullet points. What do they represent? What ideas do they force players to engage with?
- **Philosophy** — how do they see the world? What do they believe is true that others don't?

---

## Step 3: History

Establish:
- **Origin** — how did they come to be? What transformed or created them?
- **Key events** — 2-3 named events that shaped them. Each should change what they are, not just what they did.

---

## Step 4: Goals & Territory

Work through separately:

### Goals
- **Primary** — one clear sentence
- **Secondary** — 2-3 supporting objectives
- **Long-term** — what does success look like in a generation?

### Territory
- **Type:** Fixed / Nomadic / Widespread / Hidden
- **Description** — how do they claim and hold space?
- **Locations** — named Path locations they control or frequent

---

## Step 5: Mist Relationship

Define how they survive the mist:
- **Type:** Immune / Protected / Engineered / Adapted / Dependent / Vulnerable
- **Description** — the mechanism, its strengths, and its specific weaknesses

This is a key differentiator between factions. A faction's mist relationship shapes every encounter with them.

---

## Step 6: Subgroups

Present **5 options** using the spread pattern:
1. **Role-based** — divisions by function (fighters, crafters, diplomats)
2. **Belief-based** — divisions by ideology within the faction
3. **Age-based** — old guard vs new, veterans vs initiates
4. **Origin-based** — different groups absorbed or allied under one banner
5. **Specialization-based** — extreme experts in narrow domains

Let user choose or combine. Develop 2-4 subgroups with name, role, and 2-3 descriptive bullet points each.

---

## Step 7: Faction Relationships

Go through all 8 factions systematically:

| Faction | Alignment |
|---|---|
| Fire Born | Flame |
| Flame Seekers | Flame |
| Ember Traders | Neutral |
| Factionless | Neutral |
| The Rootbound | Neutral |
| Mist Clergy | Mist |
| Mist Born | Mist |
| Deep Dwellers / Brass Mechanicorum | Underground |

For each: **stance** (allied / friendly / indifferent / wary / hostile / complex) + **1-2 sentence reason**.

---

## Step 8: Item Identity

Define the faction's artifact aesthetic:
- **Theme** — what do their items look, feel, and behave like?
- **Effect categories** — what do they tend to do? (Disruption, Protection, Entanglement, Utility, etc.)
- **Typical Cost** — the faction-appropriate price of using their items

**Exception — umbrella factions with no shared culture** (e.g. Factionless, or any faction whose whole
point is that its members don't share an agenda): don't invent a unified theme. Instead write
`item_identity` as a short pointer to the NPC level — see `the-path-campaign/lore/factions/factionless/faction-details.yaml`
for the pattern. Individual NPCs under that faction may carry their own optional `item_identity` field
(see Step 11) when they have a distinct enough material/aesthetic identity to warrant one.

---

## Step 9: Rumors & Plot Hooks

### Rumors (4 entries)
Each rumor should:
- Be something common people say, not scholars
- Be grounded in observable details, not lore
- Be ambiguous — might be true, might not

### Plot Hooks (4 entries)
Each hook needs:
- **id** — kebab-case slug
- **name** — short title
- **description** — concrete scenario, 3-5 sentences. Who, where, what's at stake, what decision does it force?

---

## Step 10: Storylines

Storylines use a phase graph structure. Each storyline has:
- **id** — kebab-case
- **name** — short title
- **summary** — 2-3 sentences
- **status** — `active` / `dormant` / `resolved`
- **phases** — nodes in the graph

Each phase has:
- **id** — kebab-case
- **type** — `entry` / `milestone` / `active` / `branch` / `climax` / `resolution` / `dead-end` / `setback`
- **name** — short title
- **description** — what happens here
- **triggers** — (entry phases only) what brings players here
- **branches** — list of `{ label, next }` where `next` is another phase id or null

Use `/give-me-five` to generate 5 different storyline premises and let user choose.

**Phase type guide:**
- `entry` — first contact with this storyline
- `milestone` — major beat, things change
- `active` — ongoing multi-session progress
- `branch` — decision point that splits direction
- `climax` — the high-stakes resolution moment
- `resolution` — outcome, either success or failure variant
- `dead-end` — path closes, relationship burned
- `setback` — partial failure, can recover

---

## Step 11: NPCs

After faction is created, ask: which NPCs belong to this faction?

For each NPC:
- Should they be created now with `/create-npc`?
- Or listed as a reference to create later?

Add each NPC to the faction's `npcs:` list in `faction-details.yaml`.

**Optional per-NPC `item_identity`:** if the faction's own `item_identity` defers to the NPC level
(see Step 8 exception), an individual NPC file may carry its own `item_identity: {theme, cost}`
block, in the same shape as the faction-level field. It's optional — only add it once that NPC has
a developed material/aesthetic identity worth reusing across multiple items. When rendering or
reading an NPC file, show/use this field only if it's present.

---

## Step 12: Compile

Write all files:
1. Create folder: `the-path-campaign/lore/factions/[faction-id]/`
2. Create folder: `the-path-campaign/lore/factions/[faction-id]/npcs/`
3. Write `faction-details.yaml` using the schema below
4. Write each NPC as `npcs/[npc-id].yaml`
5. Run `node .github/scripts/generate-index.js` to verify auto-discovery

---

## faction-details.yaml Schema

```yaml
name: [Full Name]
id: [kebab-case-id]
alignment: [Flame / Mist / Neutral / Underground]
tier: [Ancient / Established / Emerging / Survivor]

identity:
  description: |
    [2-3 sentences]
  themes:
    - [theme]

history:
  origin: |
    [paragraph]
  events:
    - name: [Event Name]
      description: |
        [paragraph]

goals:
  primary: [one sentence]
  secondary:
    - [objective]
  long_term: [one sentence]

territory:
  type: [Fixed / Nomadic / Widespread / Hidden]
  description: |
    [paragraph]
  locations:
    - [Location Name]

mist_protection:
  type: [Immune / Protected / Engineered / Adapted / Dependent / Vulnerable]
  description: |
    [paragraph]

subgroups:
  - name: [Name]
    role: [Role]
    description: |
      [paragraph]

relationships:
  - faction: [faction-id]
    stance: [allied / friendly / indifferent / wary / hostile / complex]
    description: |
      [1-2 sentences]

item_identity:
  theme: |
    [paragraph]
  cost: |
    [paragraph]

rumors:
  - "[rumor text]"

plot_hooks:
  - id: [kebab-case]
    name: [Short Title]
    description: |
      [paragraph]

storylines:
  - id: [kebab-case]
    name: [Name]
    summary: |
      [paragraph]
    status: [active / dormant / resolved]
    phases:
      - id: [kebab-case]
        type: [entry / milestone / active / branch / climax / resolution / dead-end / setback]
        name: [Name]
        description: |
          [paragraph]
        triggers:
          - [trigger condition]   # entry phases only
        branches:
          - label: [Player choice or outcome]
            next: [phase-id or null]

npcs:
  - id: [npc-id]
    file: npcs/[npc-id].yaml
    role: [Role]

adversaries:
  - id: [adversary-id]
    ref: ../../../adversaries/[folder]/[file].yaml
```

---

## Reference Examples

- **Spider Colony** — `the-path-campaign/lore/factions/spider-colony/faction-details.yaml` — Established, Neutral, strong storyline with progress tracking
- **Fire Born** — `the-path-campaign/lore/factions/FireBorn.md` *(pending migration)* — Ancient, Flame, alien motives

---

## Important Guidelines

**DO:**
- Work step-by-step, iterate with user at each stage
- Use `/give-me-five` for subgroup options, storyline premises, and plot hooks
- Ground rumors in observable details, not lore dumps
- Make storyline phases feel like real branching — dead-ends and setbacks matter
- Tie item identity to the faction's core tension, not just aesthetics

**DON'T:**
- Auto-generate the entire faction without user input
- Skip the Mist Relationship — it defines how every encounter with them works
- Make every faction secretly complex — some are just hostile, and that's fine
- Forget to run `generate-index.js` after creating files

---

## Session Checklist

- [ ] Name, ID, alignment, type
- [ ] Identity description and core tension
- [ ] Themes (3-5)
- [ ] History: origin + 2-3 events
- [ ] Goals: primary, secondary, long-term
- [ ] Territory: type, description, locations
- [ ] Mist relationship
- [ ] Subgroups (2-4)
- [ ] All 8 faction relationships
- [ ] Item identity
- [ ] 4 rumors
- [ ] 4 plot hooks
- [ ] At least 1 storyline with phases
- [ ] NPC list
- [ ] Files written and generate-index.js verified

---

Start by asking the user what faction they want to create, then guide them step by step!
