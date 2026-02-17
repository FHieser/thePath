# Create Item Command

You are helping the user create a new Daggerheart item for "The Path" campaign through collaborative iteration.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files (path-mechanics.md and Glossary.md) before beginning item creation.

## Process Overview

Work through item creation step-by-step. Do NOT create all steps automatically - iterate with the user on each element. Use the `/give-me-five` approach when developing mechanics.

**Note:** This workflow covers General items and Faction items (both consumable and reusable). It does NOT cover equipment (weapons and armor) - those follow the Daggerheart SRD equipment system.

## Step 1: Item Concept

Ask the user for:
- **Item name**
- **Basic concept** (1-2 sentences)
- **Type:** General or Faction (if Faction, which faction?)
- **Usage:** Consumable (one-time) or Reusable (persistent)

Then help craft:
- **Flavor line** (1 evocative sentence describing the item)

## Step 2: Mechanical Identity

Discuss and determine together:

### Effect Category
What does this item do?
- **Restoration** - Heal HP, clear Stress, remove Mist tokens
- **Protection** - Reduce damage, resist conditions, ward against mist
- **Enhancement** - Boost rolls, grant advantage, temporary buff
- **Utility** - Solve problems, create opportunities, interact with environment
- **Disruption** - Hinder enemies, create hazards, deal damage

### Path Interaction
Does this item interact with a campaign mechanic?
- Sacred Flame / Flame Essence
- Mist / Mist tokens
- Nothing / Everything modifiers
- Location features or counters
- None (standalone effect)

### Cost/Consequence
What's the price of using it?
- Free use
- Spend Hope
- GM gains Fear
- Mark Stress
- Narrative cost (draws attention, consumes a resource, etc.)

## Step 3: Mechanic Development

Present **5 different mechanical options** for how the item could work. Each option should fit the concept, match the Effect Category from Step 2, and include specific numbers where relevant.

### Option Spread Pattern
1. **Simple & clean** - Straightforward, easy to remember at the table
2. **Tactical choice** - Gives the user a meaningful decision when they use it
3. **Risk/reward** - Powerful effect but with a real downside
4. **Reactive** - Triggers on a specific situation or condition
5. **Scaling/progressive** - Effect changes based on circumstances

Let the user choose, combine elements from multiple options, or ask for 5 more. Refine the chosen approach together.

### Faction Item Themes

For faction items, the mechanic MUST reinforce the faction's identity. Reference the **Item Identity** section in each faction's file for agreed-upon themes and typical costs:

- `the-path-campaign/lore/factions/FireBorn.md` - Item Identity section
- `the-path-campaign/lore/factions/Rootbound.md` - Item Identity section
- `the-path-campaign/lore/factions/MistBorn.md` - Item Identity section
- `the-path-campaign/lore/factions/BrassMechanicorum.md` - Item Identity section
- *(Read the relevant faction file before developing a faction item)*

## Step 4: Compile Final Item

Add the completed item to the items file: `the-path-campaign/items.yaml`

Items are sorted by type in this file: General items first, then faction items grouped by faction name.

### Item Template

```yaml
- name: [Item Name]
  type: [General / Fire Born / Rootbound / Mist Born / etc.]
  usage: [Consumable / Reusable]
  flavor: "[One-sentence evocative description]"
  effect:
    category: [Restoration / Protection / Enhancement / Utility / Disruption]
    description: |
      [Full mechanical description. Be specific about triggers, effects, durations, and costs.]
```

### Example Items

**General Consumable:**
```yaml
- name: Mist Ward Salve
  type: General
  usage: Consumable
  flavor: "A thick, ashen paste that burns cold against the skin."
  effect:
    category: Protection
    description: |
      Apply to exposed skin before entering a Mist-Touched location. The next time you would gain Mist tokens from resting in a Mist-Touched location, reduce the tokens gained by 1 (minimum 0). The salve flakes away after one rest.
```

**Faction Reusable:**
```yaml
- name: Rootbound Listening Stone
  type: Rootbound
  usage: Reusable
  flavor: "A smooth river stone wrapped in living moss that hums faintly near natural sanctuaries."
  effect:
    category: Utility
    description: |
      Hold the stone and focus for a moment. If a Mushroom Circle exists on the current Path, the moss grows warm and points toward the nearest one. The stone only responds to natural connections - it goes silent in Mist-Touched locations.
```

## Important Guidelines

**DO:**
- Work step-by-step with user input at each stage
- Use `/give-me-five` (5 options with the option spread pattern) for mechanic development
- Read the relevant faction file before creating a faction item
- Ask clarifying questions
- Iterate and refine based on feedback
- Keep mechanics simple enough to remember at the table

**DON'T:**
- Auto-generate items without user input
- Skip the iteration process
- Create items that replace class features or overshadow character abilities
- Forget to tie faction items to the faction's Item Identity themes
- Create equipment (weapons and armor) - those use the SRD system

## Reference Files

- **Items file:** `the-path-campaign/items.yaml` (where items are stored)
- **Faction files:** `the-path-campaign/lore/factions/` (Item Identity sections for faction themes)
- **Path mechanics:** `the-path-campaign/locations/path-locations/path-mechanics.yaml` (mist, flame, and Path systems)
- **Glossary:** `the-path-campaign/locations/path-locations/Glossary.md` (location reference)

---

## Session Checklist

**Step 1: Item Concept**
- [ ] Item name chosen
- [ ] Basic concept defined
- [ ] Type selected (General or Faction)
- [ ] Usage selected (Consumable or Reusable)
- [ ] Flavor line crafted

**Step 2: Mechanical Identity**
- [ ] Effect Category determined
- [ ] Path Interaction discussed
- [ ] Cost/Consequence discussed

**Step 3: Mechanic Development**
- [ ] 5 options presented (option spread pattern)
- [ ] User chose or combined elements
- [ ] Mechanic refined together
- [ ] Faction identity confirmed (if faction item)

**Step 4: Compile**
- [ ] Item added to `the-path-campaign/items.yaml`
- [ ] Sorted correctly by type

---

Start by asking the user what item they want to create, then guide them through the process step-by-step!
