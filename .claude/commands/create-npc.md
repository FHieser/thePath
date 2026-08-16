# Create NPC Command

You are helping the user create a new NPC for "The Path" campaign through collaborative iteration.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files (path-mechanics.yaml and Glossary.md) before beginning NPC creation.

## Process Overview

Work through NPC creation step-by-step, one element at a time. Do NOT generate all sections automatically — iterate with the user on each element. Propose a single piece, wait for a reaction, refine it in their words, then move to the next. Use the `/give-me-five` approach when developing interaction beats, secrets, and exchange dynamics.

## NPC Types

NPC depth and focus depends on type. Ask the user to choose one:

| Type | Focus | Sections |
|---|---|---|
| **Merchant** | Trade, goods, conditions | Offer/Want, Secrets (price-gated) |
| **Fighter** | Combat, hire, loyalty | Combat Stats, Motivations, Price |
| **Sage** | Knowledge, lore, information | Secrets, Conditions, Hidden agenda |
| **Leader** | Faction, social influence, agenda | Goals, Interaction Beats, Theme |
| **Full** | Complete complex NPC | All sections |

Lighter types skip or compress sections that aren't central to their role. A Merchant doesn't need Key Interaction Beats. A Fighter doesn't need detailed Secrets. Use judgment.

**Typical size:** most NPCs land at 40–70 lines of YAML. Only a campaign-spanning antagonist needs more (archon-of-mercy is 237 and is the outlier, not the target).

---

## Step 1: Initial Concept

Ask the user for:
- **NPC name**
- **Basic concept** (1-2 sentences)
- **Type:** Merchant / Fighter / Sage / Leader / Full
- **Faction:** Which faction, or `factionless`
- **Location:** Where they're typically found

Then help craft:
- **Role** — their function in the world. Keep it a **short title**, not a sentence ("Colony Sovereign", "The First Warden", "Researcher / Antagonist"). Longer description belongs in other fields.
- **The Twist** (what makes them surprising or memorable — moral complexity, hidden agenda, unexpected ability)

**Pronouns:** if the NPC's pronouns aren't stated, use they/them, and keep them consistent across every field.

## Step 2: Appearance & Personality

Work through together:
- **Appearance** — 2-5 bullet points, physical description and distinguishing features
- **Personality** — optional; only about 1 in 7 existing NPCs use a separate `personality` field, because for many the traits already live inside `the_twist` and `gm_notes`. Add it when the NPC's manner is distinct enough to need its own space.

Keep these grounded in the NPC's type. A Merchant's appearance should hint at their trade. A Fighter's personality should reflect what they've survived.

## Step 3: Theme in Relation to PCs

One of the most important sections. Discuss together:

- How does this NPC **challenge** the party's values or choices?
- How do they **mirror** or **contrast** the party's situation?
- What recurring tension do they create?

**Examples from "The Path":**
- *Spider Queen* — Greed/Morals and pure survival instinct. Is a creature that hunts people to survive evil?
- *The Bound Raven* — Freedom vs. security. The prison became something else over time.
- *Netos* — Alien-rational morality. Talking honestly with it risks agreeing with the thing consuming your world.

Use this section to define the NPC's **dramatic purpose**, not just their personality.

## Step 4: Goals & Exchange

Work through these elements one at a time:

### Goals & Motivations *(optional — `goals:` field)*
- What do they want, why, and what are they willing to do to get it?

### What They Want *(`wants:` — required)*
Information, favors, payment, proof of worth. Prefer **one dominant want** with supporting detail over a flat list of five equal asks — a single overriding motivation is far easier to play at the table.

### What They Offer *(`offers:` — required)*
Services, goods, knowledge, protection. Include conditions or costs.

Present **5 different options** for the exchange dynamic:
1. **Simple & transactional** — clear goods for clear payment
2. **Conditional** — offers unlock based on trust or reputation
3. **Mutual need** — NPC and players want the same thing for different reasons
4. **Asymmetric** — NPC has far more to offer OR far more to ask than expected
5. **Escalating** — relationship deepens across sessions, offer/want changes over time

Let user choose, combine, or ask for 5 more.

## Step 5: Key Interaction Beats *(Full and Leader types)*

Stored as `interaction_beats:` — a list of `{ moment, description }` entries. Present **5 options** for how the first meeting could go, then develop the arc:

- **First meeting** — how does the NPC typically present themselves?
- **Trust threshold** — what shifts the relationship?
- **Breaking point** — what causes them to withdraw, attack, or betray?

## Step 6: Secrets & Knowledge *(Full, Sage, and Leader types)*

Stored as `secrets:` with `what_they_know`, `what_they_hide`, and `conditions`. Determine together:
- **What they know** that's valuable to players
- **What they're hiding** and why
- **Conditions** — what must happen before they'll share?

Not everything needs to be unlockable. A secret the NPC will **never** share at any price is often stronger than one gated behind a trust threshold — it gives them an interior life the players can't purchase.

Use `/give-me-five` to develop the most interesting secret if needed.

## Step 7: Combat Statistics *(Fighter type or if combat is likely)*

The `combat_stats:` field takes one of two shapes:

**Pointing at a full adversary stat block** (preferred when the NPC can actually fight):
```yaml
combat_stats:
  ref: adversaries/spider-queen/spider-queen.yaml
  tier: 2
  type: Solo/Bruiser
  difficulty: 15
```

**A note explaining why they don't fight:**
```yaml
combat_stats:
  ref: null
  note: Copass is a Surveyor, not a combat unit. It will retreat rather than fight.
```

If creating a new stat block, reference the SRD for scaling — **Difficulty:** 11 (T1), 14-15 (T2), 17-18 (T3), and 2-3 Experiences relevant to their role.

## Step 8: Compile Final NPC

Write to `the-path-campaign/lore/factions/[faction-id]/npcs/[npc-id].yaml`

For an unaffiliated NPC use the `factionless/` folder. If the faction has no `npcs/` folder yet, create it.

**Do not add an `id:` field** — the filename is the identifier, and nothing reads a top-level `id`.

**Ten fields appear in every existing NPC** — treat these as the core: `name`, `faction`, `role`, `location`, `appearance`, `the_twist`, `theme`, `wants`, `offers`, `gm_notes`.

```yaml
name: [NPC Name]
faction: [faction-id, or factionless]
role: [Short title]
location: [Where found]

appearance:
  - [2-5 bullets]

personality:            # optional
  - [Traits, mannerisms]

the_twist: |
  [What makes them surprising or memorable]

theme: |
  [Their dramatic purpose — how they challenge or mirror the party]

goals:                  # optional
  primary: [Main goal]
  secondary: [Supporting goal]

wants:
  - [What they want from the players]

offers:
  - [Services, goods, knowledge]

interaction_beats:      # optional — Full / Leader
  - moment: First Meeting
    description: |
      [How they present themselves]

secrets:                # optional — Full / Sage / Leader
  what_they_know: |
    [Valuable knowledge]
  what_they_hide: |
    [And why]
  conditions: |
    [What unlocks it — and what never unlocks]

combat_stats:           # optional — see Step 7
  ref: adversaries/[type]/[name].yaml
  tier: [N]
  type: [Adversary type]
  difficulty: [Number]

gm_notes:
  - [Roleplay tips, long-term hooks, connections to other NPCs or factions]
```

Beyond these, NPCs freely add bespoke fields when the character needs them — `ancestry`, `item_identity`, `history`, `relationships`, `rumors`, `plot_hooks`, `storylines`, `speech_pattern`, and others all appear in one or two files. Add what the character needs; don't pad with fields that have nothing to say.

## Step 9: System Integration

- [ ] Verify the YAML parses cleanly
- [ ] Regenerate the webapp index if the faction's `npcs/` folder is new: `node .github/scripts/generate-index.js`
- [ ] Confirm the NPC appears on that faction's page (`path-webapp/faction.html?id=[faction-id]`, NPCs tab)

**Note on webapp rendering:** the NPC card currently displays `name`, `role`, `location`, `appearance`, `the_twist`, `theme`, `wants`, `item_identity`, `item_reference`, `gm_notes`, and `combat_stats`. Other fields — including `offers`, `personality`, `goals`, `secrets`, and `interaction_beats` — are stored but not yet rendered. Write them anyway; they're read directly from the YAML at the table.

---

## Important Guidelines

**DO:**
- Work step-by-step with user input at each stage — one element per exchange
- Provide multiple options (usually 5) and let the user pick or blend
- Tailor depth to NPC type — not every NPC needs all sections
- Use `/give-me-five` for exchange dynamics, interaction beats, and secrets
- Tie the NPC's theme to a real tension in the campaign
- Ask about connections to existing NPCs and factions
- Keep personality grounded in what the NPC has survived or built
- Preserve the user's own phrasing when they rewrite something

**DON'T:**
- Auto-generate NPCs without user input, or bundle several sections into one proposal
- Apply the Full template to every NPC — respect the type
- Make every NPC secretly complex — some are just merchants
- Add an `id:` field
- Write the file as Markdown, or place it outside `lore/factions/[faction-id]/npcs/`
- Forget GM Notes that help with roleplay at the table
- Create NPCs without a clear dramatic purpose (Theme section)

## Reference Examples

Read these directly for tone, depth, and field usage:

- **The Spider Queen** — `the-path-campaign/lore/factions/spider-colony/npcs/spider-queen.yaml` (46 lines) — Full type, strong Theme, long-game hooks, `combat_stats` pointing at an adversary file
- **The Bound Raven** — `the-path-campaign/lore/factions/factionless/npcs/the-bound-raven.yaml` (71 lines) — `interaction_beats`, `item_reference`, and a bespoke cross-NPC connection field
- **Netos** — `the-path-campaign/lore/factions/mist-born/npcs/netos.yaml` (66 lines) — `secrets` with a never-shared secret, `interaction_beats`, they/them pronouns, composes with an event file
- **The Spider Emissary** — `the-path-campaign/lore/factions/spider-colony/npcs/spider-emissary.yaml` (39 lines) — the lean end; core fields only
- **The Archon of Mercy** — `the-path-campaign/lore/factions/factionless/npcs/archon-of-mercy.yaml` (237 lines) — the maximal end, with `storylines`, `plot_hooks`, `relationships`, and `territory`. Note its nested `id:` fields on storyline phases **are** required — `branches[].next` references them.

> `zarchive/` holds superseded content (including the old `drift.md`). Don't use it as a reference.

---

## Session Checklist

**Step 1: Initial Concept**
- [ ] Name chosen
- [ ] Type selected (Merchant / Fighter / Sage / Leader / Full)
- [ ] Faction and location defined
- [ ] Role crafted (short title)
- [ ] The Twist defined

**Step 2: Appearance & Personality**
- [ ] Appearance (2-5 bullets)
- [ ] Personality added, or consciously skipped

**Step 3: Theme**
- [ ] Theme in Relation to PCs defined
- [ ] Dramatic purpose clear

**Step 4: Goals & Exchange**
- [ ] Goals (optional)
- [ ] Wants
- [ ] Offers
- [ ] Exchange dynamic chosen (5 options presented)

**Step 5: Interaction Beats** *(Full / Leader)*
- [ ] First meeting defined
- [ ] Trust threshold and breaking point

**Step 6: Secrets** *(Full / Sage / Leader)*
- [ ] Key secrets defined
- [ ] Conditions for sharing

**Step 7: Combat Stats** *(Fighter / if likely)*
- [ ] `combat_stats` block with `ref` or explanatory `note`

**Step 8: Compile**
- [ ] YAML written to `lore/factions/[faction-id]/npcs/[npc-id].yaml`
- [ ] No `id:` field
- [ ] All ten core fields present
- [ ] GM Notes added

**Step 9: System Integration**
- [ ] YAML parses cleanly
- [ ] Index regenerated if the `npcs/` folder is new
- [ ] NPC appears on the faction page

---

Start by asking the user what NPC they want to create, then guide them through the process step-by-step!
