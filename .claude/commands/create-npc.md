# Create NPC Command

You are helping the user create a new NPC for "The Path" campaign through collaborative iteration.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files (path-mechanics.md and Glossary.md) before beginning NPC creation.

## Process Overview

Work through NPC creation step-by-step. Do NOT generate all sections automatically — iterate with the user on each element. Use the `/give-me-five` approach when developing interaction beats and secrets.

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

---

## Step 1: Initial Concept

Ask the user for:
- **NPC name**
- **Basic concept** (1-2 sentences)
- **Type:** Merchant / Fighter / Sage / Leader / Full
- **Faction:** Which faction, or None
- **Location:** Where they're typically found

Then help craft:
- **Role** (their function in the world — 1 line)
- **The Twist** (what makes them surprising or memorable — moral complexity, hidden agenda, unexpected ability)

## Step 2: Appearance & Personality

Work through together:
- **Appearance** — 2-4 bullet points, physical description and distinguishing features
- **Personality** — core traits, mannerisms, how they interact with others

Keep these grounded in the NPC's type. A Merchant's appearance should hint at their trade. A Fighter's personality should reflect what they've survived.

## Step 3: Theme in Relation to PCs

One of the most important sections. Discuss together:

- How does this NPC **challenge** the party's values or choices?
- How do they **mirror** or **contrast** the party's situation?
- What recurring tension do they create?

**Examples from "The Path":**
- *Spider Queen* — Greed/Morals and pure survival instinct. Is a creature that hunts people to survive evil?
- *Drift* — Loyalty vs. independence. What does it mean to choose no side?

Use this section to define the NPC's **dramatic purpose**, not just their personality.

## Step 4: Goals & Exchange

Work through these three elements one at a time:

### Goals & Motivations
- What do they want?
- Why do they want it?
- What are they willing to do to get it?

### What They Offer
- Services, goods, or knowledge
- Conditions or costs

### What They Want (from players specifically)
- Information, favors, payment, proof of worth

Present **5 different options** for the exchange dynamic using the option spread pattern:
1. **Simple & transactional** — clear goods for clear payment
2. **Conditional** — offers unlock based on trust or reputation
3. **Mutual need** — NPC and players want the same thing for different reasons
4. **Asymmetric** — NPC has far more to offer OR far more to ask than expected
5. **Escalating** — relationship deepens across sessions, offer/want changes over time

Let user choose, combine, or ask for 5 more.

## Step 5: Key Interaction Beats *(Full and Leader types)*

For each beat, work through collaboratively. Present **5 options** for how the first meeting could go, then develop the relationship arc:

- **First meeting** — how does the NPC typically present themselves?
- **Trust threshold** — what shifts the relationship?
- **Breaking point** — what causes them to withdraw, attack, or betray?

## Step 6: Secrets & Knowledge *(Full, Sage, and Leader types)*

Determine together:
- **What they know** that's valuable to players
- **What they're hiding** and why
- **Conditions** — what must happen before they'll share?

Use `/give-me-five` to develop the most interesting secret if needed.

## Step 7: Combat Statistics *(Fighter type or if combat is likely)*

Reference the Daggerheart SRD for appropriate stat scaling:
- **Difficulty:** 11 (T1), 14-15 (T2), 17-18 (T3)
- **Experiences:** 2-3 relevant to their role
- **Thresholds:** Major/Severe counts appropriate to tier
- **Key Moves:** 2-3 signature abilities that reflect their personality

## Step 8: Compile Final NPC

Write the complete NPC file to `the-path-campaign/npcs/[faction]/[npc-name].md`

Use the following structure (omit sections not relevant to NPC type):

```markdown
# [NPC Name]

**Faction:** [Faction or None]
**Location:** [Where found]
**Role:** [One-line function]

---

## Appearance
- [Bullet points]

## Personality
- [Bullet points]

## The Twist
[Paragraph]

## Theme in Relation to PCs
[Paragraph]

---

## Goals & Motivations
- [Bullet points]

## What They Offer
- [Bullet points]

## What They Want
- [Bullet points]

## Key Interaction Beats *(if applicable)*
- [Bullet points]

## Secrets & Knowledge *(if applicable)*
- [Bullet points]

## Combat Statistics *(if applicable)*
**See** `[path-to-yaml]` or inline stats

---

## GM Notes
- [Roleplay tips]
- [Long-term story potential]
- [Connections to other NPCs or factions]
```

---

## Important Guidelines

**DO:**
- Work step-by-step with user input at each stage
- Tailor depth to NPC type — not every NPC needs all sections
- Use `/give-me-five` for exchange dynamics, interaction beats, and secrets
- Tie the NPC's theme to a real tension in the campaign
- Ask about connections to existing NPCs and factions
- Keep personality grounded in what the NPC has survived or built

**DON'T:**
- Auto-generate NPCs without user input
- Apply the Full template to every NPC — respect the type
- Make every NPC secretly complex — some are just merchants
- Forget to give GM Notes that help with roleplay at the table
- Create NPCs without a clear dramatic purpose (Theme section)

## Reference Examples

Use these for tone and depth:

- **Spider Queen** — `the-path-campaign/npcs/factionless/spider-queen.md` — Full type, strong Theme, long-game hooks
- **Drift** — `the-path-campaign/npcs/factionless/drift.md` — Lighter type, lean structure

---

## Session Checklist

**Step 1: Initial Concept**
- [ ] Name chosen
- [ ] Type selected (Merchant / Fighter / Sage / Leader / Full)
- [ ] Faction and location defined
- [ ] Role crafted
- [ ] The Twist defined

**Step 2: Appearance & Personality**
- [ ] Appearance (2-4 bullets)
- [ ] Personality traits and mannerisms

**Step 3: Theme**
- [ ] Theme in Relation to PCs defined
- [ ] Dramatic purpose clear

**Step 4: Goals & Exchange**
- [ ] Goals & Motivations
- [ ] What They Offer
- [ ] What They Want
- [ ] Exchange dynamic chosen (5 options presented)

**Step 5: Interaction Beats** *(Full / Leader)*
- [ ] First meeting defined
- [ ] Trust threshold and breaking point

**Step 6: Secrets** *(Full / Sage / Leader)*
- [ ] Key secrets defined
- [ ] Conditions for sharing

**Step 7: Combat Stats** *(Fighter / if likely)*
- [ ] Difficulty, Experiences, Thresholds, Key Moves

**Step 8: Compile**
- [ ] File written to correct faction folder
- [ ] Sections appropriate to NPC type included
- [ ] GM Notes added

---

Start by asking the user what NPC they want to create, then guide them through the process step-by-step!
