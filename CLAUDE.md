# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "The Path" - a custom Daggerheart RPG campaign frame featuring a mist-shrouded world where players traverse shifting interconnected locations. The repository contains campaign materials, homebrew content, and reference materials built on the official Daggerheart System Reference Document.

## Core Architecture

### Directory Structure
- `the-path-campaign/` - Campaign-specific content for "The Path" setting
  - `framework/` - Core campaign mechanics and overview
  - `locations/` - Path locations organized by type
    - `path-locations/surface-locations/` - 9 surface environment files
    - `path-locations/underground-locations/` - 5 underground environment files
    - `village-in-the-mist/` - Central hub with 5 location cards
  - `adversaries/` - Custom adversaries organized by type
    - `mist/` - Mist creatures (Walkers, Stalkers, Wraith Leaders)
  - `lore/` - Campaign lore and worldbuilding
    - `factions/` - Faction documentation and templates
  - `npcs/` - Non-player characters organized by affiliation
  - `campaign/` - Active campaign tracking (e.g., Moonfield campaign)
  - `example-path/` - Example Path configurations
- `lib/daggerheart-srd/` - Git submodule containing official Daggerheart SRD with complete rules and content
- `lib/og-dhsrd/` - HTML version of SRD with benchmarks and scaling guidelines
- `homebrew-kit/` - Official Daggerheart Homebrew Kit PDF (v1.0) for content creation guidelines
- `.claude/agents/` - 10 specialized Daggerheart agents for content creation
- `Pitch.md` - Campaign concept and core mechanics overview
- `Progression.md` - Development changelog and campaign advancement tracking
- `STYLE-GUIDE.md` - Standardized modifier terminology and formatting rules

### Campaign Frame: "The Path"
- World shrouded in otherworldly mist making normal travel impossible
- Players traverse "The Path" - shifting interconnected locations between sessions
- Core mechanic: Tarot-based Path generation where players draw and arrange location cards
- Binary location stability: Stable (persistent) or Unstable (disappear between sessions)
- Sacred Flame resource management: Village consumes 1 Flame Essence per day
- Sessions can begin in "Village in the Mist" or in media res on the Path
- Ancient Sacred Flames keep mist at bay in sanctuary locations
- Modifier system defines location properties (Underground, Cave Mouth, Inhabited, Wild Beasts, Mist-Touched)

### Data Sources
- **Official SRD**: `lib/daggerheart-srd/` contains complete rules, classes, ancestries, equipment, adversaries
- **SRD HTML Reference**: `lib/og-dhsrd/index.html` contains the complete Daggerheart SRD in HTML format with adversary benchmarks, scaling guidelines, and design principles
- **Campaign Content**: `the-path-campaign/` contains location-specific materials and framework
- **Processed Data**: `lib/daggerheart-srd/.build/json/` contains structured game data (weapons, adversaries, environments, etc.)

## Key Systems

### Content Creation Standards
- Follow Daggerheart's core design principles
- Use tier-appropriate scaling: Tier 1 (level 1), Tier 2 (levels 2-4), Tier 3 (levels 5-7), Tier 4 (levels 8-10)
- Current campaign content is Tier 1 (level 1 only)
- Maintain asymmetrical design (PC vs adversary mechanics)
- Reference existing SRD content in `lib/daggerheart-srd/`
- Keep "The Path" campaign themes and mist mechanics central
- Follow modifier formatting from `STYLE-GUIDE.md` (capitalize: Stable, Underground, Cave Mouth, etc.)
- Use location design framework from `path-mechanics.md` (Concept → Modifiers → Features → Integration)

### Campaign Locations
Locations are organized in `the-path-campaign/locations/` with detailed descriptions:
- **Surface Locations** (9 environments): Windswept Grasslands, Ancient Crossing, Forest Refuge, Highland Watch, Misty Waters, Overgrown Temple, Sacred Mountain Pass, Stone Works, Trading Grounds
- **Underground Locations** (5 environments): Flooded Network, Fungal Depths, Geothermal Caverns, Mining Complex, Sacred Underground
- **Village in the Mist** (hub): 5 location cards (Sacred Flame Sanctuary, Forge, Community Hearth, Flame Gatherer's Lodge, Supply Cache)
- Each location uses Daggerheart environment structure with Features, Difficulty, and Modifiers
- Locations connect via "The Path" using tarot-based generation system
- Underground locations connect only to other Underground or Cave Mouth locations
- All locations maintain the mist theme and Sacred Flame mechanics

## Working with This Repository

### When Creating Campaign Content
1. Reference existing SRD content in `lib/daggerheart-srd/`
2. Follow tier scaling guidelines (T1-T4)
3. Maintain "The Path" campaign themes and mist mechanics
4. Use existing location structure as templates
5. Ensure content fits within the shifting Path framework

### Data Access Patterns
- **SRD content**: Read from `lib/daggerheart-srd/contents/` and subdirectories
- **SRD HTML reference**: Use `lib/og-dhsrd/index.html` for adversary benchmarks, tier scaling, and design guidelines
- **Game data**: Access JSON files in `lib/daggerheart-srd/.build/json/` (adversaries.json, weapons.json, environments.json, etc.)
- **Campaign content**: Organize in `the-path-campaign/` following existing patterns
- **Surface locations**: Place in `the-path-campaign/locations/path-locations/surface-locations/`
- **Underground locations**: Place in `the-path-campaign/locations/path-locations/underground-locations/`
- **Village locations**: Place location cards in `the-path-campaign/locations/village-in-the-mist/`
- **Adversaries**: Organize by type in `the-path-campaign/adversaries/[type]/` (e.g., mist/, flame/, etc.)
- **Factions**: Place in `the-path-campaign/lore/factions/` using ExampleFaction.md template
- **NPCs**: Organize by affiliation in `the-path-campaign/npcs/[faction]/`
- **Campaign sessions**: Track in `the-path-campaign/campaign/[campaign-name]/`

### File Organization
- **Framework files**: Place in `the-path-campaign/framework/` (campaign-overview.md, etc.)
- **Path mechanics**: Document in `the-path-campaign/locations/path-locations/path-mechanics.md`
- **Surface locations**: Use single-file format in `surface-locations/[location-name].md`
- **Underground locations**: Use single-file format in `underground-locations/[location-name].md`
- **Village locations**: Use `[feature]-card.md` format (e.g., `forge-card.md`, `community-hearth-card.md`)
- **Adversaries**: Use `[adversary-name].md` format
- **Factions**: Use capitalized names (e.g., `FireBorn.md`, `Rootbound.md`)
- **NPCs**: Use lowercase-with-dashes (e.g., `the-watcher.md`)
- Use descriptive filenames that match the content purpose
- **Style Guide**: Follow `STYLE-GUIDE.md` for consistent modifier terminology and formatting

## Campaign Development Status

### Completed (98% Ready for Play)
- ✅ Core framework and Path network mechanics
- ✅ 14 Path locations (9 surface, 5 underground)
- ✅ Village in the Mist hub with 5 location cards
- ✅ Sacred Flame resource management system
- ✅ Location modifier system (Stable/Unstable, Underground, Cave Mouth, etc.)
- ✅ Tarot-based Path generation mechanics
- ✅ Session 1 prototype (Initial Path configuration with 3 encounters)
- ✅ 3 Mist creature adversaries (Walker, Stalker, Wraith Leader)
- ✅ High Lore cosmology (imprisoned god, mist as divine prison)
- ✅ 2/9 factions complete (Fire Born, Rootbound)

### In Progress
- 🔄 Faction development (7 remaining: Mist Born, Flame Seekers, Ember Traders, Factionless, Mist Clergy, Deep Dwellers, Brass Mechanicorum)
- 🔄 NPC roster expansion
- 🔄 Additional adversary types

## Important Notes

- This repository is built under the Darrington Press Community Gaming License
- All content must comply with official Daggerheart design principles
- Campaign frame focuses on mist mechanics and shifting Path configurations
- The `lib/daggerheart-srd/` submodule provides authoritative rules reference
- Location content should be modular to support the shifting Path concept
- Use specialized agents in `.claude/agents/` for content creation tasks
- Reference `Progression.md` for complete development history and design decisions