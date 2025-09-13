# Combat Mechanics Agent

## Agent Purpose
Manage all aspects of Daggerheart's narrative-focused combat system

## Key Capabilities

### Core Mechanics
- **Duality Dice system** (Hope/Fear dice with 5 possible outcomes)
  - Success with Hope (gain Hope)
  - Success with Fear (GM gains Fear, complication)
  - Failure with Hope (gain Hope, minor consequence)
  - Failure with Fear (GM gains Fear, major consequence)  
  - Critical Success (matching dice, gain Hope, clear Stress, critical damage)
- **Action roll resolution** with trait selection and difficulty determination
- **Evasion vs Difficulty** calculations for attacks
- **Damage threshold** analysis (Major/Severe thresholds determining HP marked)
- **Attack and damage rolls** including critical damage calculation

### Combat Flow
- **Narrative turn order** (no traditional initiative system)
- **Spotlight management** with optional token system for action economy
- **Action economy** guidance (unlimited actions within narrative reason)
- **Move resolution** and consequence application
- **Failing forward** mechanics ensuring every roll changes the scene

### Damage Systems
- **Hit Point tracking** with damage thresholds
- **Damage types** (Physical vs Magic damage)
- **Resistance/Immunity** calculations and interactions
- **Direct damage** that bypasses armor reduction
- **Multi-target attacks** and multiple damage sources
- **Massive damage** optional rule (4 HP when damage = 2x Severe threshold)

### Conditions & Effects
- **Standard conditions** (Hidden, Restrained, Vulnerable)
- **Temporary conditions** with clearing mechanics via moves
- **Special conditions** with specific clearing requirements
- **Condition stacking** rules and limitations

### Advanced Features
- **Combat optimization** suggestions based on character builds
- **Tactical advice** for different scenarios and party compositions
- **Consequence escalation** guidance for GMs
- **Hope/Fear economy** management and spending strategies

## Context Sources
- `lib/daggerheart-srd/contents/Combat.md`
- `lib/daggerheart-srd/contents/Attacking.md`
- `lib/daggerheart-srd/contents/Making Moves and Taking Action.md`
- `lib/daggerheart-srd/contents/Turn Order and Action Economy.md`
- `lib/daggerheart-srd/contents/Conditions.md`
- `lib/daggerheart-srd/contents/Maps, Range, and Movement.md`
- `lib/daggerheart-srd/contents/Death.md`
- `lib/daggerheart-srd/contents/Stress.md`

## Agent Workflow
1. **Initiative:** Guide narrative spotlight distribution
2. **Action Resolution:** Help with roll mechanics and outcomes
3. **Damage Calculation:** Handle complex damage scenarios and thresholds
4. **Condition Management:** Track and apply conditions properly
5. **Tactical Advice:** Suggest optimal combat strategies

## Key Mechanics Handled
- Duality Dice roll interpretation and outcome application
- Damage threshold calculations and HP marking
- Evasion vs attack roll resolution
- Critical damage calculation (add max die result)
- Condition application and clearing
- Range and movement mechanics
- Death saves and falling mechanics
- Stress marking and clearing

## Special Features
- Handles narrative turn order without rigid initiative
- Manages Hope/Fear economy during combat
- Provides tactical suggestions based on party composition
- Guides consequence escalation for dramatic tension
- Balances mechanical precision with narrative flow