# Create Event Command

You are helping the user create a new Daggerheart event for "The Path" campaign through collaborative iteration on individual features.

An **event** is an occurrence rather than a place — "a special activity or occurrence (something happening in the space, as opposed to the physical space itself)" per the SRD. Events attach to whatever location the party is already in. They have no grid coordinate, no tarot card, and no Glossary entry.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files (path-mechanics.yaml and Glossary.md) before beginning event creation.

## Process Overview

Work through event creation step-by-step, one feature at a time. Do NOT create all steps automatically - instead, iterate with the user on each element.

**Note:** If the user provides pre-written narrative feature descriptions, accept these as the feature concepts in Step 3 and proceed directly to developing mechanics in Step 4.

## The Agnostic Rule

**Events must be reusable.** Name and write them so they work for more than the one situation that prompted them. Every Event in the SRD follows this: *Cult Ritual*, *Castle Siege*, *Ambushed*, *Divine Usurpation* — generic noun phrases, never proper nouns.

Specificity comes from a **designate step**, not from hardcoding. The SRD does this constantly:

> *"When the environment first takes the spotlight, designate one adversary as the Usurper"*

So an event about one NPC becomes an event about a **role** that NPC can fill. `Guardian Projection` works for any of the three Ancient Guardians because it designates which one at activation and defers to that NPC's own file for character.

This keeps events composable: the **NPC file holds character**, the **event holds mechanics**, and the designate step joins them. A good test — if a rule in your event references a specific character's personality, move it to the NPC file and reference it generically instead.

## Step 1: Initial Concept

Ask the user for:
- Event name (**agnostic** — see The Agnostic Rule above)
- Basic concept (1-2 sentences)
- Category (Social, Combat, Exploration, Traversal — what kind of scene it primarily presents)

Then help craft:
- Tagline (evocative 1-sentence description, present tense)
- 3 Impulses (what the event wants/does)

## Step 2: Core Parameters

Determine together:

- **Tier range:** Events use a `tiers:` array so they scale, rather than locking to one tier. Follow the pattern in `the-path-campaign/adversaries/mist/mist-crab.yaml`. Ask which tiers the event should support — not every event needs all four.
- **Difficulty per tier:** T1: 10–12 · T2: 13–15 · T3: 16–18 · T4: 19–21 (SRD Environment Benchmarks)
- **Trigger:** *Mandatory.* What causes this event to fire? Prefer **two conditions** over one — a single condition misfires easily. Include 3-4 concrete examples.
- **End condition:** *Mandatory.* How does this resolve? What happens if players disengage, refuse, or attack? Events must define their own exit.
- **Potential Adversaries:** What creatures might be present, if any?

**On scaling:** only vary what genuinely needs to vary. If the Difficulty shift already makes a tier harder, don't also scale the thresholds — that double-taxes the higher tier. Duplicate the full feature list per tier rather than diffing it; it's verbose but requires no lookups at the table.

## Step 3: Feature Brainstorming

Identify 3-5 distinct feature concepts. Every event should include:

1. **An activation feature** — what happens the moment it fires (this is usually where the designate step lives)
2. **A spine** — a counter or countdown that structures progression through the event. All six SRD events build around one.
3. **GM pressure tools** — Fear spends that let the GM escalate
4. **A boundary feature** — what players cannot do, and what happens if they try

**Fear economy tip:** have the activation feature grant the GM Fear, so the event arrives pre-loaded with the ammunition its other features spend. This makes it play consistently whether it fires early or late in a session.

## Step 4: Feature Development (One at a Time)

For EACH feature, work through collaboratively.

### Feature Template
```markdown
**[Feature Name]**

[2-3 sentence description of what it is and what it does]

**[Mechanic Type]:** Passive / Action / Reaction

**Mechanics:**
- [Key mechanical element]
- [Player interaction or GM trigger]
- [Consequence or benefit]

*Question: [Open question for GM to answer during play]*
```

### Feature Development Questions to Explore

**MOST IMPORTANT:** Does the mechanic fit the theme?
- Example: a conversation counter tracked with a physical die that gets swapped up (d6→d8→d12) as it grows — the swap silently tells players more is available without the GM saying so
- Example: a refusal penalty that costs the GM no Fear — so silence is the one strategy with no ceiling on its punishment

**Counter design:** counters can rise toward *reward* as easily as toward punishment. Decide which, and what each threshold gives. Consider hiding the higher thresholds so players discover them.

**Use the duality:** Daggerheart gives four outcomes, not two. A counter can move differently on each:
`Success with Hope +2 · Success with Fear +1 · Failure with Hope 0 · Failure with Fear −2`

**Let the GM lean on character:** where a roll opposes a designated NPC, instruct the GM to grant advantage or disadvantage based on how well the approach fits that NPC. This is what makes an agnostic event feel specific.

**Reuse your own features:** when a new consequence is needed, check whether an existing feature can simply fire for free instead. Fewer moving parts, and the punishment stays in the event's established vocabulary.

**Check costs against the campaign baseline:** `path-mechanics.yaml` prices Fear spends (e.g. 3 Fear for a party-wide Mist token). Deviating is fine — but make it a deliberate, thematically justified choice rather than an accident.

### Iteration Approach

1. Present 5 different options for how it could work mechanically
2. Let user choose or combine elements
3. Refine the chosen approach together
4. Add GM questions for narrative flavor
5. Move to next feature

## Step 5: Feature Integration

After all features are developed, check:
- Do features interact with each other?
- Is there variety in feature types? (Passive / Action / Reaction)
- Does the Fear economy balance — can the GM afford what the event asks them to spend?
- Is the event still agnostic, or has a specific NPC leaked into the mechanics?
- Do features support the event's impulses?

## Step 6: Compile Final Event

Write to `the-path-campaign/lore/events/[event-name].yaml`:

```yaml
name: [Event Name]
category: [Social / Combat / Exploration / Traversal]
description: [Tagline]
impulses: [Three impulses, comma-separated]
potentialAdversaries: [List, or omit]

trigger: |
  [When this event activates — prefer two conditions.]

  Examples: [3-4 concrete cases]

tiers:
  - tier: [N]
    difficulty: [Number]
    features:
      - name: [Feature Name]
        type: [Passive / Action / Reaction]
        description: |
          [Description and mechanics. **Bold** and `- ` bullet lists render correctly in the webapp.]
        questions: [GM question]

  - tier: [N+1]
    difficulty: [Number]
    features:
      # Full feature list repeated, with tier-varying numbers adjusted

featureQuestions:
  - [Broader question about the event]
  - [Question about what triggered it]
  - [Question about consequences or recurrence]
  - [Question about how it manifests]
```

## Step 7: System Integration

Events are **not** locations — skip tarot assignment and Glossary entirely.

- [ ] Regenerate the webapp index: `node .github/scripts/generate-index.js`
- [ ] Verify the YAML parses and the event appears at `path-webapp/events.html`
- [ ] If the event references an NPC role, confirm the matching NPC file exists in `the-path-campaign/lore/factions/[faction]/npcs/`

No changes to `events.html`, `event.html`, or `index.html` are needed for a new event — they auto-discover from the generated index.

## Important Guidelines

**DO:**
- Work step-by-step with user input at each stage
- Provide multiple options (usually 5) for mechanics
- Keep the event agnostic and reusable
- Use a designate step instead of hardcoding a specific NPC
- Define both a trigger and an end condition
- Reference existing events and SRD events as examples
- Ask clarifying questions and iterate

**DON'T:**
- Auto-generate all features without user input
- Name an event after a specific character, place, or session
- Bake one NPC's personality into the mechanics
- Leave the event without a defined way to end
- Scale every number by tier when Difficulty already does the work
- Write down the difficulty in features again if they don't modify the difficulty
- Add tarot cards, grid coordinates, or Glossary entries

## Reference Examples

**Guardian Projection** — Tier 2-3 Social
- File: `the-path-campaign/lore/events/guardian-projection.yaml`
- Demonstrates: agnostic naming with a designate step, a rising counter with hidden thresholds tracked by a physical die (d6→d8→d12), four-outcome duality movement, an unfightable antagonist, self-funding Fear economy, tier scaling via `tiers:` array

**SRD Events** in `lib/daggerheart-srd/environments/`
- `Cult Ritual.md` (T2) — Countdown (6) ticking on rolls with Fear, cancelled if its leader falls
- `Divine Usurpation.md` (T4) — chained countdowns, raises the GM's Fear ceiling, designate step
- `Ambushed.md` / `Ambushers.md` (T1) — the simplest possible event shape
- `Castle Siege.md`, `Pitched Battle.md` (T3) — large-scale event structure

**IMPORTANT:** Read these files directly to see complete feature descriptions and how mechanics reinforce themes.

## Key Principles

1. **Agnostic by Default:** an event that only works once isn't worth a file
2. **Composability:** NPC files hold character, events hold mechanics, the designate step joins them
3. **A Spine:** every event needs a counter or countdown structuring its progression
4. **Defined Exits:** trigger and end condition are both mandatory
5. **Self-Funding:** activation should give the GM the Fear the event expects them to spend
6. **Mechanical Clarity:** simple, clear rules that don't require lookups

---

## Session Checklist

**Step 1: Initial Concept**
- [ ] Event name chosen (agnostic)
- [ ] Basic concept defined
- [ ] Category selected
- [ ] Tagline crafted
- [ ] 3 Impulses defined

**Step 2: Core Parameters**
- [ ] Tier range decided
- [ ] Difficulty set per tier
- [ ] Trigger defined (prefer two conditions + examples)
- [ ] End condition defined
- [ ] Potential Adversaries listed

**Step 3: Feature Brainstorming**
- [ ] 3-5 feature concepts identified
- [ ] Activation feature included (with designate step)
- [ ] Counter/countdown spine identified
- [ ] Boundary feature identified

**Step 4: Feature Development**
- [ ] Each feature complete (mechanics + GM question)

**Step 5: Feature Integration**
- [ ] Feature interaction checked
- [ ] Feature type variety confirmed
- [ ] Fear economy balanced
- [ ] Still agnostic — no NPC personality in mechanics
- [ ] Impulses supported

**Step 6: Compile Final Event**
- [ ] YAML file created in `the-path-campaign/lore/events/`
- [ ] Feature Questions added (4-6 broader questions)
- [ ] YAML parses cleanly

**Step 7: System Integration**
- [ ] `node .github/scripts/generate-index.js` run
- [ ] Event appears on `path-webapp/events.html`
- [ ] Referenced NPC roles exist

---

Start by asking the user for their initial event concept, then guide them through the process step-by-step!
