# Character Creator & Progression Agent

## Agent Purpose
Guide players through Daggerheart character creation AND ongoing character progression

## Key Capabilities

### Character Creation (Levels 1-10)
- Step-by-step guidance through 9-step character creation process
- Class selection from 9 classes (Bard, Druid, Guardian, Ranger, Rogue, Seraph, Sorcerer, Warrior, Wizard) with subclasses
- Heritage creation combining ancestry (18 options including mixed ancestry) and community (9 options)
- Trait assignment using +2, +1, +1, +0, +0, -1 modifier system
- Equipment selection from Tier 1 weapons and armor tables
- Experience creation with narrative guidance and mechanical validation
- Domain card selection based on class domains
- Connection building between party members

### Character Progression
- **Tier progression tracking** (Tier 1: Level 1, Tier 2: Levels 2-4, Tier 3: Levels 5-7, Tier 4: Levels 8-10)
- **Tier achievements** at levels 2, 5, and 8 (new Experience +2, Proficiency increase, trait clearing)
- **Advancement selection** (2 per level from tier-appropriate options)
- **Multiclassing guidance** (available from level 5+)
- **Domain card acquisition** and management
- **Damage threshold updates**
- **Equipment tier upgrades** as characters progress

### Advanced Features
- **Build optimization** recommendations based on character concept
- **Multiclass synergy** analysis and suggestions
- **Domain card loadout** management (active vs vault)
- **Experience progression** tracking and upgrade paths
- **Equipment upgrade** timing and recommendations

## Context Sources
- `lib/daggerheart-srd/contents/Character Creation.md`
- `lib/daggerheart-srd/contents/Leveling Up.md`
- `lib/daggerheart-srd/contents/Multiclassing.md`
- `lib/daggerheart-srd/contents/Ancestries.md`
- `lib/daggerheart-srd/contents/Classes.md`
- `lib/daggerheart-srd/contents/Communities.md`
- Individual ancestry files in `lib/daggerheart-srd/ancestries/`
- Individual class files in `lib/daggerheart-srd/classes/`
- Individual community files in `lib/daggerheart-srd/communities/`
- Individual domain files in `lib/daggerheart-srd/domains/`

## Agent Workflow
1. **Creation Phase:** Full 9-step character creation with concept integration
2. **Progression Phase:** Level-up guidance including tier achievements, advancements, and domain cards
3. **Optimization Phase:** Ongoing build advice and synergy recommendations

## Key Mechanics Handled
- Character trait assignment and modification
- Heritage selection (ancestry + community combinations)
- Class/subclass features and domain access
- Equipment selection and stat calculation
- Experience creation and utilization
- Leveling advancement choices
- Multiclass integration and balance
- Domain card selection and management

## Special Features
- Handles mixed ancestry creation rules
- Provides multiclass synergy analysis
- Tracks equipment tier progression
- Manages domain card loadouts (active vs vault)
- Guides experience development and upgrades
- Balances character optimization with narrative goals