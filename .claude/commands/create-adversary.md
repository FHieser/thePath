# Create Adversary Command

You are helping the user create a new Daggerheart adversary for "The Path" campaign through collaborative iteration on individual features.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load essential context files before beginning adversary creation. This ensures you have access to:
- The Starfall Kingdom lore (for Crystal-Plague creatures)
- Existing adversary examples
- Campaign themes and mechanics

## Process Overview

Work through adversary creation step-by-step, collaborating with the user on each element. Do NOT create everything automatically - iterate and refine together.

## Step 1: Initial Concept

Ask the user for:
- **Adversary name**
- **Basic concept** (what is it? what role does it play?)
- **Tier** (1 or 2)
- **Category** (Solo, Leader, Bruiser, Standard, Minion, Skulk, Support, Ranged, Horde, Social)
- **Thematic family** (Mist creatures, Crystal-Plague, Beasts, Spider Queen's Brood, etc.)

Then discuss:
- **Visual description** (what does it look like? what horror/wonder does it present?)
- **Motives** (3-5 tactical priorities, comma-separated)
- **Lore** (how does it fit into the campaign world?)

## Step 2: Core Statistics

Reference official Tier 2 benchmarks from `lib/og-dhsrd/scripts/index.html`:

Work with the user to determine:
- **Difficulty** (within tier/category range)
- **HP** (within tier/category range)
- **Stress** (within tier/category range)
- **Thresholds** (Major/Severe, if applicable)
- **Attack bonus** (within tier/category range)
- **Attack name** (thematic to the creature)
- **Attack range** (Melee, Very Close, Close, Far)
- **Attack damage** (dice + modifier, matching tier benchmarks)
- **Experiences** (2-3 skills with +2 to +4 bonuses)

## Step 3: Feature Planning

Discuss what the adversary DOES mechanically. Based on category:

**Important Feature Types:**
- **Passive:** Always-on effects (armor, auras, movement)
- **Action (Spend X Fear):** Powerful abilities GM activates
- **Action (Mark Stress):** Once-per-scene devastating moves
- **Reaction:** Triggers on events (usually free, often grants Fear)

## Step 4: Feature Development (One at a Time)

For EACH feature, use the `/give-me-five` approach:

1. Present 5 different options for the feature
2. Let user choose or request more options
3. Refine mechanics together
4. Ensure thematic consistency

### Feature Development Questions:

**Does the mechanic fit the theme?**
- Crystal Zombie explodes = crystalline plague shattering
- Guard's Crystal Explosion = corrupted crystals in weapon
- Charger's Shield Brace = immovable juggernaut

**What does this feature DO?**
- Damage (direct, area, conditional bonus)
- Control (restrain, push, vulnerable, prone)
- Defense (damage reduction, difficulty increase, can't be moved)
- Resource (generate Fear, mark Stress, use limited charges)

**How does it balance with tier?**
- Tier 1: Lower damage, simpler mechanics
- Tier 2: Higher damage, more complex interactions
- Cost matches power (1 Fear = moderate, 2 Fear = strong, Mark Stress = devastating)

## Step 5: Feature Integration

After all features are developed, verify:
- Do features work together thematically?
- Is there mechanical variety? (not all actions, not all reactions)
- Does the stat block match official benchmarks?
- Is the adversary balanced for its tier/category?

## Step 6: Compile Final Adversary

Create the complete YAML file using this template:

```yaml
name: [Adversary Name]
tier: [1 or 2]
category: [Solo/Leader/Bruiser/Standard/Minion/etc.]
description: [2-3 sentences of vivid description emphasizing visual horror/wonder and movement quality]
motives: [Comma-separated tactical priorities]
difficulty: [Number]
thresholds:  # Omit for Minions
  major: [Number]
  severe: [Number]
hp: [Number]
stress: [Number]
attack:
  bonus: '+X'
  name: [Attack Name]
  range: [Melee/Very Close/Close/Far]
  damage: [XdY+Z phy/mag]
experience:
  - name: [Skill Name]
    value: [2-4]
  - name: [Skill Name]
    value: [2-4]
features:
  - name: [Feature Name]
    type: [Passive/Action/Reaction]
    cost: [Spend X Fear / Mark a Stress]  # If applicable
    uses: [Number]  # If limited uses
    description: |
      [Detailed mechanical description. Be specific about triggers, costs, effects, durations.]
  - name: [Feature Name]
    type: [Passive/Action/Reaction]
    description: |
      [Description]
lore: [2-3 sentences connecting creature to campaign world, explaining origin or role in ecology/society]
```

## Step 7: System Integration

After creating the adversary:

### Update webapp (`path-webapp/js/index-adversaries.js`):
1. Add folder to `adversaryFolders` array if new creature type
2. Add filename to `fallbackFiles` object
3. Add to `folderConfig` with display name if new category

### Update location references:
- Add to `potentialAdversaries` field in relevant location YAML files
- Update location features that spawn this adversary

### Update todo lists:
- Mark adversary as complete in `adversaries/[type]/[type]-todo.md`
- Remove "@todo need to be created" references

## Important Guidelines

**DO:**
- Work step-by-step with user input
- Use `/give-me-five` for feature options
- Reference official benchmarks constantly
- Ask clarifying questions about theme and mechanics
- Iterate based on feedback
- Check final stats against tier benchmarks

**DON'T:**
- Auto-generate all features without collaboration
- Guess at stats without checking benchmarks
- Create overly complex features for low-tier creatures
- Skip the iteration process
- Make underpowered/overpowered creatures outside benchmarks
- Forget to consider category patterns (Bruisers have Momentum, etc.)

## Reference Examples

Use these as templates. Read the actual YAML files for full context:

**Crystal Zombie** - Tier 2 Minion
- File: `the-path-campaign/adversaries/crystal-plague/crystal-zombie.yaml`
- Demonstrates: Minion scaling, Group Attack, thematic passive (Glass Symphony), death explosion reaction

**Crystal-Fused Guard** - Tier 2 Standard
- File: `the-path-campaign/adversaries/crystal-plague/crystal-fused-guard.yaml`
- Demonstrates: Damage-doubling reaction, passive magic resistance, simple 2-feature design

**Crystalline Charger** - Tier 2 Bruiser
- File: `the-path-campaign/adversaries/crystal-plague/crystalline-charger.yaml`
- Demonstrates: Line attack with push, defensive stance, hybrid offense/defense

**Blood Fern Predator** - Tier 2 Solo
- File: `the-path-campaign/adversaries/beasts/blood-fern-predator.yaml`
- Demonstrates: Relentless (2), limited-use abilities, degrading armor mechanic, teleport repositioning, area control (Territorial Roar), permanent defeat with session respawn (Valley's Bond)

**Giant Spider Guardian** - Tier 2 Bruiser
- File: `the-path-campaign/adversaries/spider-queen/giant-spider-guardian.yaml`
- Demonstrates: Ambush mechanics, restrain effects, Momentum, Frenzy Strike multi-attack

## Key Design Principles

1. **Thematic Consistency:** Every feature should reinforce what the creature IS
2. **Mechanical Balance:** Stats must match official tier/category benchmarks
3. **Player Engagement:** Features create interesting tactical decisions
4. **GM Utility:** Features provide clear triggers and costs
5. **Encounter Diversity:** Creatures within a family should play differently
6. **Horror/Wonder:** Descriptions should evoke emotion and visual clarity

## Collaborative Patterns

### The /give-me-five Workflow
When stuck on a feature, present 5 options:
- **Option 1:** Simple/conservative approach
- **Option 2:** Complex/interesting mechanics
- **Option 3:** High-risk/high-reward
- **Option 4:** Defensive/controlling
- **Option 5:** Offensive/aggressive

Then ask: "Which fits your vision?" or "Want 5 more options?"

### The Benchmark Check
Before finalizing, verify:
- HP within category range? ✓
- Stress within category range? ✓
- Thresholds within category range? ✓
- Attack bonus within category range? ✓
- Damage dice match tier average? ✓
- Features match category expectations? ✓

### The Theme Integration
Ask throughout:
- "Does this mechanic fit the creature's visual/lore?"
- "How does this feature make the creature feel unique?"
- "What tactical choice does this create for players?"

---

## Session Checklist

**Step 1: Initial Concept**
- [ ] Adversary name chosen
- [ ] Basic concept defined
- [ ] Tier selected (1 or 2)
- [ ] Category selected
- [ ] Thematic family identified
- [ ] Visual description drafted
- [ ] Motives listed (3-5)
- [ ] Lore concept established

**Step 2: Core Statistics**
- [ ] Difficulty set (checked against benchmarks)
- [ ] HP set (checked against benchmarks)
- [ ] Stress set (checked against benchmarks)
- [ ] Thresholds set (if applicable, checked against benchmarks)
- [ ] Attack bonus set (checked against benchmarks)
- [ ] Attack name created (thematic)
- [ ] Attack range selected
- [ ] Attack damage set (checked against tier averages)
- [ ] Experiences chosen (2-3 skills)

**Step 3: Feature Planning**
- [ ] Number of features determined (based on category)
- [ ] Feature types planned (Passive, Action, Reaction mix)
- [ ] Thematic concepts identified

**Step 4: Feature Development**
- [ ] Feature 1 complete (mechanics refined)
- [ ] Feature 2 complete (mechanics refined)
- [ ] Feature 3 complete (if applicable)
- [ ] Feature 4 complete (if applicable)
- [ ] Feature 5 complete (if applicable)

**Step 5: Feature Integration**
- [ ] Features work together thematically
- [ ] Mechanical variety confirmed
- [ ] Stat block matches benchmarks
- [ ] Balance verified for tier/category

**Step 6: Compile Final Adversary**
- [ ] YAML file created in correct folder
- [ ] All fields populated correctly
- [ ] Description emphasizes visual/movement
- [ ] Lore connects to campaign

**Step 7: System Integration**
- [ ] Added to webapp index-adversaries.js (if needed)
- [ ] Added to location potentialAdversaries (if applicable)
- [ ] Todo lists updated
- [ ] "@todo" references removed

---

Start by asking the user what adversary they want to create, then guide them through the process step-by-step!
