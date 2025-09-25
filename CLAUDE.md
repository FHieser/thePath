# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "The Path" - a custom Daggerheart RPG campaign frame featuring a mist-shrouded world where players traverse shifting interconnected locations. The repository contains campaign materials, homebrew content, and reference materials built on the official Daggerheart System Reference Document.

## Core Architecture

### Directory Structure
- `the-path-campaign/` - Campaign-specific content for "The Path" setting
  - `framework/` - Core campaign mechanics and overview
  - `locations/` - Specific locations along The Path with detailed descriptions
- `lib/daggerheart-srd/` - Git submodule containing official Daggerheart SRD with complete rules and content
- `homebrew-kit/` - Official Daggerheart Homebrew Kit PDF (v1.0) for content creation guidelines
- `Pitch.md` - Campaign concept and core mechanics overview
- `Progression.md` - Character progression and campaign advancement

### Campaign Frame: "The Path"
- World shrouded in otherworldly mist making normal travel impossible
- Players traverse "The Path" - shifting interconnected locations between sessions
- Core mechanic: Path configuration changes each adventure session
- Sessions begin in "Village in the Mist"
- Ancient fires keep mist at bay in sanctuary locations

### Data Sources
- **Official SRD**: `lib/daggerheart-srd/` contains complete rules, classes, ancestries, equipment, adversaries
- **SRD HTML Reference**: `lib/og-dhsrd/index.html` contains the complete Daggerheart SRD in HTML format with adversary benchmarks, scaling guidelines, and design principles
- **Campaign Content**: `the-path-campaign/` contains location-specific materials and framework
- **Processed Data**: `lib/daggerheart-srd/.build/json/` contains structured game data (weapons, adversaries, environments, etc.)

## Key Systems

### Content Creation Standards
- Follow Daggerheart's core design principles
- Use tier-appropriate scaling (Tiers 1-4)
- Maintain asymmetrical design (PC vs adversary mechanics)
- Reference existing SRD content in `lib/daggerheart-srd/`
- Keep "The Path" campaign themes and mist mechanics central

### Campaign Locations
Locations are organized in `the-path-campaign/locations/` with detailed descriptions:
- Each location includes environment cards and mechanical details
- Locations connect via "The Path" that shifts between sessions
- All locations maintain the mist theme and ancient fire sanctuaries

## Working with This Repository

### When Creating Campaign Content
1. Reference existing SRD content in `lib/daggerheart-srd/`
2. Follow tier scaling guidelines (T1-T4)
3. Maintain "The Path" campaign themes and mist mechanics
4. Use existing location structure as templates
5. Ensure content fits within the shifting Path framework

### Data Access Patterns
- SRD content: Read from `lib/daggerheart-srd/contents/` and subdirectories
- SRD reference: Use `lib/og-dhsrd/index.html` for adversary benchmarks, tier scaling, and design guidelines
- Game data: Access JSON files in `lib/daggerheart-srd/.build/json/`
- Campaign content: Organize in `the-path-campaign/` following existing patterns
- Location details: Place in `the-path-campaign/locations/[location-name]/`
- Adversaries: Place custom adversaries in `the-path-campaign/adversaries/`

### File Organization
- Campaign framework files go in `the-path-campaign/framework/`
- Individual location content goes in `the-path-campaign/locations/[location-name]/`
- Follow existing naming patterns (e.g., `[feature]-card.md` for location features)
- Use descriptive filenames that match the content purpose

## Important Notes

- This repository is built under the Darrington Press Community Gaming License
- All content must comply with official Daggerheart design principles
- Campaign frame focuses on mist mechanics and shifting Path configurations
- The `lib/daggerheart-srd/` submodule provides authoritative rules reference
- Location content should be modular to support the shifting Path concept