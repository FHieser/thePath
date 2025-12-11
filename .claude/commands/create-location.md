# Create Location Command

You are helping the user create a new Daggerheart location for "The Path" campaign through collaborative iteration on individual features.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files (path-mechanics.md and Glossary.md) before beginning location creation.

## Process Overview

Work through location creation step-by-step, one feature at a time. Do NOT create all steps automatically - instead, iterate with the user on each element.

**Note:** If the user provides pre-written narrative feature descriptions (e.g., "Border Post - The checkpoint where guards turned back..."), accept these as the feature concepts in Step 3 and proceed directly to developing mechanics in Step 4.

## Step 1: Initial Concept

Ask the user for:
- Location name
- Basic concept (1-2 sentences)
- Tier (1 or 2)
- Type (Combat, Exploration, Traversal, Social)

Then help craft:
- Tagline (evocative 1-sentence description)
- 3 Impulses (what the location wants/does)

## Step 2: Core Parameters

Determine together:
- **Difficulty:** Based on tier (11 for T1, 14-15 for T2)
- **Modifiers:** Select from existing modifiers (Stable/Unstable, Mist-Touched/Flame-Touched, Underground, Cave Mouth, etc.)
- **Potential Adversaries:** What creatures/threats fit this location?

## Step 3: Feature Brainstorming

Identify 3-4 distinct feature concepts:
- What are the visual/thematic elements of this location?
- What makes each one mechanically interesting?

**User may provide either:**
1. **Feature concept names** (e.g., "Prayer flags," "Breathing chasm") - then develop descriptions together
2. **Full narrative descriptions** (e.g., "Border Post - The checkpoint where guards turned back their own people. Families pleaded to be let through...") - accept these as-is and proceed to Step 4 to develop mechanics

**Example from Barnacle Gardens (concept names):**
- Prayer flags with void script
- Breathing chasm with countdown
- Ruined structures for cover
- Barnacles covering everything

**Example with narrative descriptions (skip to Step 4):**
- **Border Post** - The checkpoint where guards turned back their own people. Families pleaded to be let through. Children begged for entry. The guards held their posts, tears streaming, weapons raised. Eventually the guards crystallized too, still standing at their station, translucent hands gripping translucent spears.
- **Message Tower** - The rookery where messenger birds were housed and trained. The birds remain, generations later—descendants of those original ravens and pigeons.
- **Breach Point** - A collapsed section of wall where siege engines rot amid scattered bones.
- **Refugee's Hope** - The camp at the lordship's edge where families waited for entry permission that never came.

## Step 4: Feature Development (One at a Time)

For EACH feature, work through collaboratively:

### Feature Template
```markdown
**[Feature Name]**

[2-3 sentence description of what it is and what it does]

**[Mechanic Type]:** Counter System / Passive / Action / Reaction

**Mechanics:**
- [Key mechanical element]
- [Player interaction or GM trigger]
- [Consequence or benefit]

*Question: [Open question for GM to answer during play]*
```

### Feature Development Questions to Explore:

**MOST IMPORTANT:** Does the mechanic fit the theme?
- The mechanics should reinforce what this feature IS in the narrative
- Example: Breathing chasm = countdown timer (pressure builds as it breathes)
- Example: Prayer flags = removable modifier (agency through desecration)
- Example: Debt stones = counter-based encounter (disrespect accumulates consequences)

**What does this feature DO mechanically?**
- Create resources? (consumables, advantages)
- Create pressure? (timers, consequences)
- Modify dice? (advantage/disadvantage, hope/fear changes)
- Grant player agency? (choices, removable modifiers)

**How do players interact with it?**
- Passive (always on, environmental)
- Action (players choose to engage)
- Reaction (GM trigger)
- Counter System (tracks progression toward consequence)

**What's the risk/reward balance?**
- What do players gain?
- What do they risk or sacrifice?
- What does the GM spend or gain?

### Iteration Approach

When developing each feature:
1. Present 5 different options for how it could work mechanically
2. Let user choose or combine elements
3. Refine the chosen approach together
4. Add GM questions for narrative flavor
5. Move to next feature

## Step 5: Feature Integration

After all features are developed, check:
- Do features interact with each other? (countdown + barnacle hum synergy)
- Is there variety in feature types? (passive, action, counter, etc.)
- Do features support the location's impulses?
- Is there player agency and meaningful choice?

## Step 6: Compile Final Location

Create the complete location markdown file using this template:

```markdown
# [LOCATION NAME]

***Tier X Type***
*[Tagline]*
**Impulses:** [Three impulses]

> **Difficulty:** [Number]
> **Modifiers:** [List]
> **Potential Adversaries:** [List]

## FEATURES

***[Feature 1 Name] - [Type]:*** [Description and mechanics]

  *[GM Question]*

***[Feature 2 Name] - [Type]:*** [Description and mechanics]

  *[GM Question]*

[Continue for all features...]

## FEATURE QUESTIONS

- [Broader question about the location]
- [Question about location's history or purpose]
- [Question about player impact on location]
- [Question about long-term consequences]
```

## Step 7: Tarot Assignment & Integration

- Suggest appropriate tarot card based on themes
- Add to Glossary.md
- Add to path-webapp files (locations.json and index.html)

## Important Guidelines

**DO:**
- Work step-by-step with user input at each stage
- Provide multiple options (usually 5) for mechanics
- Ask clarifying questions
- Iterate and refine based on feedback
- Reference existing locations as examples
- Maintain compact, readable format

**DON'T:**
- Auto-generate all features without user input
- Make assumptions about mechanics without asking
- Skip the iteration process
- Create overly complex features
- Forget to add counterplay/agency options
- Write down the difficulty in features again if they don't modify the difficulty (e.g., don't write "make a Strength roll with difficulty 14" - just write "make a Strength roll")

## Reference Examples

Use these as inspiration for feature design. Read the actual YAML files for full context:

**Ancient Crossing** - Tier 1 Traversal
- File: `the-path-campaign/locations/path-locations/surface-locations/ancient-crossing.yaml`
- Demonstrates: Counter system with degrading bridge (7→0), passive lore discovery, action rolls with Hope/Fear outcomes, GM Fear spends for hazards

**Blood Fern Valley** - Tier 2 Exploration
- File: `the-path-campaign/locations/path-locations/surface-locations/blood-fern-valley.yaml`
- Demonstrates: Counter system triggered by player actions (Predator Awareness 0→5), combined passive + action features (Debt Stones), risk/reward choices, permanent location effects

**Barnacle Gardens** - Tier 2 Combat
- File: `the-path-campaign/locations/path-locations/surface-locations/barnacle-gardens.yaml`
- Demonstrates: Countdown mechanism (10→0 breathing chasm), removable modifiers (Nothing(1) via prayer flags), interconnected features (barnacle hum + countdown), consumable resources with consequences

**IMPORTANT:** Read these YAML files directly to see complete feature descriptions, GM questions, and how mechanics reinforce themes.

## Key Principles

1. **Player Agency:** Features should give players meaningful choices
2. **Risk/Reward:** Balance power with cost or consequence
3. **GM Tools:** Give GM interesting Fear spends and triggers
4. **Interconnection:** Features can interact (countdown affects multiple elements)
5. **Narrative Hooks:** Every feature should have GM questions for storytelling
6. **Mechanical Clarity:** Simple, clear rules that don't require lookups

---

## Session Checklist

Use this to track progress through the location creation process:

**Step 1: Initial Concept**
- [ ] Location name chosen
- [ ] Basic concept defined
- [ ] Tier selected (1 or 2)
- [ ] Type selected (Combat/Exploration/Traversal/Social)
- [ ] Tagline crafted
- [ ] 3 Impulses defined

**Step 2: Core Parameters**
- [ ] Difficulty set
- [ ] Modifiers chosen
- [ ] Potential Adversaries listed

**Step 3: Feature Brainstorming**
- [ ] 3-4 feature concepts identified
- [ ] Each concept has clear theme

**Step 4: Feature Development**
- [ ] Feature 1 complete (mechanics + GM question)
- [ ] Feature 2 complete (mechanics + GM question)
- [ ] Feature 3 complete (mechanics + GM question)
- [ ] Feature 4 complete (if applicable)

**Step 5: Feature Integration**
- [ ] Features interact with each other checked
- [ ] Feature type variety confirmed
- [ ] Player agency verified
- [ ] Impulses supported

**Step 6: Compile Final Location**
- [ ] YAML file created
- [ ] Markdown file created
- [ ] Feature Questions added (4-6 broader questions)

**Step 7: System Integration**
- [ ] Tarot card assigned
- [ ] Added to Glossary.md
- [ ] Added to path-webapp/data/locations.json
- [ ] Added to path-webapp/index.html

---

Start by asking the user for their initial location concept, then guide them through the process step-by-step!
