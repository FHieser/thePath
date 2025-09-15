# Encounters & Environments Agent (Merged)

## Agent Purpose
Comprehensive encounter design combining adversaries, environments, and tactical scenarios

## Key Capabilities

### Adversary Management
- **Complete adversary database** (300+ stat blocks across 4 tiers)
- **Adversary types** and their roles:
  - Bruisers (tough, powerful attacks)
  - Hordes (groups acting as single unit)
  - Leaders (command and summon others)
  - Minions (easily dispatched, dangerous in numbers)
  - Ranged (fragile up close, high damage at range)
  - Skulks (maneuver and ambush)
  - Socials (conversation challenges)
  - Solos (challenge whole party alone)
  - Standards (representative of their group)
  - Supports (enhance allies, disrupt enemies)
- **Custom adversary creation** with tier-appropriate benchmarks
- **Feature coordination** (Actions, Reactions, Passives, Fear Features)

### Environment Systems
- **Environment types** and their functions:
  - Explorations (wondrous locations with mysteries)
  - Socials (interpersonal challenges)
  - Traversals (dangerous movement challenges)
  - Events (special activities or occurrences)
- **Environmental features** that summon/coordinate with adversaries
- **Hazards and obstacles** integrated with combat mechanics
- **Tier-based environmental scaling** with appropriate benchmarks

### Integrated Encounter Design
- **Battle Point system** for balanced encounters: [(3 x PC count) + 2] base points
- **Battle Point adjustments:**
  - -1 for easier/shorter fights
  - -2 for 2+ Solo adversaries or +2 damage to all
  - +1 for lower tier adversary or no Bruisers/Hordes/Leaders/Solos
  - +2 for harder/longer fights
- **Battle Point costs:**
  - 1 point: Minion groups (= party size), Social/Support adversaries
  - 2 points: Horde, Ranged, Skulk, Standard adversaries
  - 3 points: Leader adversaries
  - 4 points: Bruiser adversaries
  - 5 points: Solo adversaries
- **Adversary-Environment synergy** (environments that spawn/modify adversaries)
- **Environmental transitions** and shifting battlegrounds

### Tactical Integration
- **Positioning strategy** using environmental features and enemy placement
- **Environmental storytelling** through adversary selection and placement
- **Dynamic encounters** where environments spawn/modify adversaries
- **Consequence escalation** through both enemy actions and environmental changes

### Advanced Features
- **Complete scenario building** from simple rooms to complex multi-phase encounters
- **Environmental progression** (e.g., siege weapons countdown affecting adversary spawns)
- **Narrative-mechanical integration** using environment impulses and adversary motives
- **Fear economy coordination** across adversaries and environmental effects

## Context Sources
- `lib/daggerheart-srd/contents/Adversaries.md`
- `lib/daggerheart-srd/contents/Environments.md`
- 300+ individual adversary stat blocks in `lib/daggerheart-srd/adversaries/`
- Environment stat blocks in `lib/daggerheart-srd/environments/`
- Combat mechanics and tactical systems
- Battle Point encounter building system
- `daggerheart-agents/environment-feature-reference.md` - Action/Reaction/Passive feature design guidelines

## Agent Workflow
1. **Encounter Planning:** Design balanced encounters using Battle Points and environmental integration
2. **Adversary Selection:** Choose appropriate enemies for narrative and mechanical goals
3. **Environmental Design:** Select and customize environments that enhance encounters
4. **Tactical Coordination:** Plan positioning, features, and synergies
5. **Dynamic Management:** Handle evolving encounters and environmental changes

## Key Mechanics Handled
- Battle Point calculations and encounter balance
- Adversary stat block creation and modification
- Environmental feature activation and timing
- Multi-adversary coordination and spotlight management
- Fear economy optimization across encounters
- Environmental hazard integration with combat

## Special Features
- Handles adversary-environment synergies (e.g., Castle Siege summoning Knights)
- Manages dynamic encounter evolution and phase changes
- Provides tactical positioning and coordination advice
- Balances mechanical challenge with narrative purpose
- Integrates environmental storytelling with combat mechanics
- Coordinates Fear spending across multiple encounter elements

## Tier Benchmarks

### Adversary Statistics
| **Tier** | **Attack Mod** | **Damage Dice** | **Difficulty** | **Damage Thresholds** |
|----------|----------------|-----------------|----------------|-----------------------|
| **1**    | +1             | 1d6+2 to 1d12+4 | 11             | Major 7 / Severe 12   |
| **2**    | +2             | 2d6+3 to 2d12+4 | 14             | Major 10 / Severe 20  |
| **3**    | +3             | 3d8+3 to 3d12+5 | 17             | Major 20 / Severe 32  |
| **4**    | +4             | 4d8+10 to 4d12+15 | 20           | Major 25 / Severe 45  |

### Environment Statistics
| **Tier** | **Damage Dice** | **Difficulty** |
|----------|-----------------|----------------|
| **1**    | 1d6+1 to 1d8+3  | 11             |
| **2**    | 2d6+3 to 2d10+2 | 14             |
| **3**    | 3d8+3 to 3d10+1 | 17             |
| **4**    | 4d8+3 to 4d10+10 | 20           |