# Daggerheart Reference JSON Structures

This folder contains JSON templates and reference structures for creating homebrew Daggerheart content, based on the official **Daggerheart Homebrew Kit v1.0** (July 31, 2025).

## Files Overview

### Core Reference Files

| File | Purpose | Key Content |
|------|---------|-------------|
| `environments.json` | Environment creation | Templates, types, features, examples |
| `equipment.json` | Weapons & armor design | Damage scaling, features, balance rules |
| `adversaries.json` | Adversary creation | Types, scaling tables, features, examples |
| `index.json` | Master reference | Usage guidelines, validation, design principles |

## Quick Start

### For Agents
1. Reference `index.json` for overview and validation guidelines
2. Use specific files for detailed templates and examples
3. Follow scaling tables for tier-appropriate content
4. Validate against design principles before finalizing

### For Developers
```json
// Example: Load weapon template
{
  "name": "string",
  "tier": "1-4",
  "damage": {
    "dice": "1d8",
    "bonus": 3,
    "type": "physical"
  }
}
```

## Key Design Principles

All content should follow Daggerheart's core principles:

1. **Balance narrative focus and dynamic combat**
2. **Streamline, then streamline again**
3. **Make the game tactile**
4. **Limit cognitive load**
5. **Embrace collaboration**
6. **Design for flexibility**
7. **Think asymmetrically**

## Scaling Reference

### By Tier
- **Tier 1**: Attack +1, Difficulty 11, Damage 1d6+2 to 1d12+4
- **Tier 2**: Attack +2, Difficulty 14, Damage 2d6+3 to 2d12+4
- **Tier 3**: Attack +3, Difficulty 17, Damage 3d8+3 to 3d12+5
- **Tier 4**: Attack +4, Difficulty 20, Damage 4d8+10 to 4d12+15

### Weapon Damage (Primary Weapons)
| Range | One-Handed | Two-Handed | Tier Bonuses |
|-------|------------|------------|--------------|
| Melee/Close | d8 base | d10 base | T1: +1/+3 |
| Far | d6 base | d6 base | T2: +3/+6 |
|  |  |  | T3: +6/+9 |
|  |  |  | T4: +9/+12 |

## Usage Examples

### Creating a Tier 2 Weapon
```json
{
  "name": "Enchanted Longsword",
  "tier": 2,
  "range": "Melee",
  "damage": {
    "dice": "1d8",
    "bonus": 3,
    "type": "magic"
  },
  "feature": {
    "name": "Reliable",
    "description": "+1 to attack rolls"
  }
}
```

### Creating a Social Environment
```json
{
  "name": "Noble Court",
  "tier": 2,
  "type": "Social",
  "difficulty": 14,
  "features": {
    "passives": [
      {
        "name": "Formal Etiquette",
        "description": "PCs gain advantage on Presence rolls when following proper court protocols."
      }
    ]
  }
}
```

## Validation Checklist

Before finalizing homebrew content:

- [ ] Follows appropriate tier scaling guidelines
- [ ] Uses correct Daggerheart terminology
- [ ] Respects asymmetrical design (PC vs adversary mechanics)
- [ ] Maintains reasonable cognitive load
- [ ] Enhances rather than replaces existing content
- [ ] Aligns with core design principles

## Source Reference

All structures based on the official Daggerheart Homebrew Kit v1.0, available at the Daggerheart SRD website. These templates ensure compliance with the Darrington Press Community Gaming License.