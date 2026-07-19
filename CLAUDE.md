# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "The Path" - a custom Daggerheart RPG campaign frame featuring a mist-shrouded world where players traverse shifting interconnected locations. The repository contains campaign materials, homebrew content, and reference materials built on the official Daggerheart System Reference Document.

## Core Architecture

### Directory Structure
- `the-path-campaign/` - Campaign-specific content for "The Path" setting
  - `framework/` - Core campaign mechanics and overview
  - `locations/` - Path locations organized by type
    - `path-locations/surface-locations/` - 25 surface environment files
    - `path-locations/underground-locations/` - 15 underground environment files
    - `path-locations/starfall-city/` - 9 location files for the Starfall City sub-area (Craftsmen's Ward, Sealed District, Council Hall, etc.)
    - `path-locations/special-locations/` - Non-standard locations (Vanishing Mist, Village in the Mist overview)
    - `village-in-the-mist/` - Central hub: 6 location cards (incl. `underground-access-card.yaml`) plus `village-overview.md` and `upgrades.md`
  - `items/` - Equipment and item catalogs (`items.yaml`, `starfall-crystals.yaml`)
  - `adversaries/` - Custom adversaries organized by type: `mist/`, `beasts/`, `siege/`, `crystal-plague/`, `spider-queen/`, `the-croak/`, `antagonists/`
  - `lore/` - Campaign lore and worldbuilding
    - `factions/` - One folder per faction with `faction-details.yaml` and an `npcs/` subfolder (see Data Access Patterns below)
    - `mist-islands/` - Starfall City / Starfall Kingdom lore and character write-ups
  - `mechanics/` - Core mechanics files
    - `path-mechanics.yaml` - Path network mechanics reference
    - `crafting-and-trading-mechanics.yaml` - Crafting and trading system rules
    - `starfall-city-mechanics.yaml` - Starfall City-specific mechanics
    - `wandering-stars.md` - Wandering Stars mechanic
    - `village-siege/` - Village siege encounter framework
  - `campaign/` - Active campaign tracking (e.g., Moonfield, FreeMountain)
  - `example-path/` - Example Path configurations, incl. `path-library/` of reusable path YAMLs
  - `zarchive/` - Deprecated/superseded content kept for reference
- `lib/daggerheart-srd/` - Git submodule containing official Daggerheart SRD with complete rules and content
- `lib/og-dhsrd/` - HTML version of SRD with benchmarks and scaling guidelines
- `homebrew-kit/` - Official Daggerheart Homebrew Kit PDF (v1.0) for content creation guidelines
- `path-webapp/` - Static web app for browsing campaign content (locations, adversaries, factions, path mechanics); deployed to GitHub Pages
- `.github/workflows/deploy.yml` - Builds `index.html`, `path-webapp/`, and `the-path-campaign/` into `_site` and publishes to GitHub Pages on push to `main`
- `.claude/agents/` - 10 specialized Daggerheart agents for content creation
- `README.md` - Repository overview and link to the deployed GitHub Pages site
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
- Use location design framework from `the-path-campaign/mechanics/path-mechanics.yaml` (Concept → Modifiers → Features → Integration)

### Campaign Locations
Locations are organized in `the-path-campaign/locations/` with detailed descriptions:
- **Surface Locations** (25 environments) in `path-locations/surface-locations/` - e.g. Windswept Grasslands, Ancient Crossing, Forest Refuge, Highland Watch, Misty Waters, Overgrown Temple, Sacred Mountain Pass, Stone Works, Coldspire Keep, The Reeds
- **Underground Locations** (15 environments) in `path-locations/underground-locations/` - e.g. Flooded Network, Fungal Depths, Geothermal Caverns, Mining Complex, Sacred Underground, Sanctum Line, Brood Throne
- **Starfall City** (9 locations) in `path-locations/starfall-city/` - a self-contained sub-area (Craftsmen's Ward, Sealed District, Scaffold Square, Sanctuary Keep, Old Gate, Riot Market, Mechanics Workshop, Council Hall, University/Burning Fields)
- **Special Locations** in `path-locations/special-locations/` - non-standard entries (Vanishing Mist, Village in the Mist overview)
- **Village in the Mist** (hub): 6 location cards (Sacred Flame Sanctuary, Forge, Community Hearth, Flame Gatherer's Lodge, Supply Cache, Underground Access)
- Each location uses Daggerheart environment structure with Features, Difficulty, and Modifiers
- Locations connect via "The Path" using tarot-based generation system
- Underground locations connect only to other Underground or Cave Mouth locations
- All locations maintain the mist theme and Sacred Flame mechanics
- Location/adversary/faction counts above drift as content is added — run `find the-path-campaign/locations/path-locations -maxdepth 2 -type f | wc -l`-style checks (or see `FILE-INDEX.md`) to confirm current counts rather than trusting this list blindly

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
- **Starfall City locations**: Place in `the-path-campaign/locations/path-locations/starfall-city/`
- **Special locations**: Place in `the-path-campaign/locations/path-locations/special-locations/`
- **Village locations**: Place location cards in `the-path-campaign/locations/village-in-the-mist/`
- **Items**: Place in `the-path-campaign/items/` (`items.yaml` is the main catalog; give a distinct item family its own file, as with `starfall-crystals.yaml`)
- **Adversaries**: Organize by type in `the-path-campaign/adversaries/[type]/` — current types: `mist/`, `beasts/`, `siege/`, `crystal-plague/`, `spider-queen/`, `the-croak/`, `antagonists/`
- **Factions**: Each faction lives in `the-path-campaign/lore/factions/[faction-id]/faction-details.yaml`
- **Faction NPCs**: Place in `the-path-campaign/lore/factions/[faction-id]/npcs/[npc-id].yaml`
- **Mist-islands / Starfall lore**: Place in `the-path-campaign/lore/mist-islands/`
- **Path mechanics**: `the-path-campaign/mechanics/path-mechanics.yaml`
- **Crafting & trading mechanics**: `the-path-campaign/mechanics/crafting-and-trading-mechanics.yaml`
- **Starfall City mechanics**: `the-path-campaign/mechanics/starfall-city-mechanics.yaml`
- **Village siege**: `the-path-campaign/mechanics/village-siege/`
- **Campaign sessions**: Track in `the-path-campaign/campaign/[campaign-name]/`
- **Webapp**: `path-webapp/` reads campaign YAML directly via HTTP fetch for auto-discovery; see `path-webapp/README.md` for local dev and content-discovery details. `path-webapp/js/content-index.js` is generated by `.github/scripts/generate-index.js` — regenerate it after adding new content folders/files rather than hand-editing it

### File Organization
- **Framework files**: Place in `the-path-campaign/framework/` (campaign-overview.md, etc.)
- **Path mechanics**: Document in `the-path-campaign/mechanics/path-mechanics.yaml`
- **Village siege**: Files in `the-path-campaign/mechanics/village-siege/`
- **Surface locations**: Use single-file YAML format in `surface-locations/[location-name].yaml`
- **Underground locations**: Use single-file YAML format in `underground-locations/[location-name].yaml`
- **Starfall City locations**: Use single-file YAML format in `starfall-city/[location-name].yaml`
- **Village locations**: Use `[feature]-card.yaml` format (e.g., `forge-card.yaml`, `community-hearth-card.yaml`)
- **Items**: Use `[item-set-name].yaml` format (e.g., `items.yaml`, `starfall-crystals.yaml`)
- **Adversaries**: Use `[adversary-name].yaml` format inside the relevant type folder
- **Factions**: Use kebab-case folder names (e.g., `fire-born/`, `brass-mechanicorum/`) with `faction-details.yaml` inside
- **Faction NPCs**: Use lowercase-with-dashes (e.g., `spider-queen.yaml`) inside the faction's `npcs/` subfolder
- Use descriptive filenames that match the content purpose
- **Style Guide**: Follow `STYLE-GUIDE.md` for consistent modifier terminology and formatting

## Campaign Development Status

> Note: the previous version of this section (14 locations, 2/9 factions) was stale relative to the actual file tree — content has grown well beyond that snapshot. The counts below reflect what currently exists on disk; treat design/narrative *completeness* (not just file presence) as something to confirm with the campaign owner rather than infer from this list.

- Core framework and Path network mechanics
- 49 Path locations on disk: 25 surface, 15 underground, 9 in the Starfall City sub-area
- Village in the Mist hub with 6 location cards
- Sacred Flame resource management system
- Location modifier system (Stable/Unstable, Underground, Cave Mouth, etc.)
- Tarot-based Path generation mechanics, plus a 12-entry reusable `path-library/`
- Crafting & trading mechanics and an items catalog (`items.yaml`, `starfall-crystals.yaml`)
- Village siege framework and a Wandering Stars mechanic
- 9 faction folders exist in `lore/factions/`: `brass-mechanicorum`, `copper-rust-clan`, `factionless`, `fire-born`, `mist-born`, `rootbound`, `spider-colony`, `the-croak`, `village-in-the-mist` (most have at least one NPC file; narrative completeness varies per folder — verify before assuming a faction is "done"). `factionless` is an umbrella for unaffiliated NPCs (marauder bands through named individuals like the Archon of Mercy) — each NPC carries its own agenda, and its own `item_identity` if it has one, rather than the faction sharing a single one.
- 7 adversary type folders (`mist/`, `beasts/`, `siege/`, `crystal-plague/`, `spider-queen/`, `the-croak/`, `antagonists/`) covering ~28 individual adversary files
- Starfall City / mist-islands lore (Starfall Kingdom, character write-ups)
- `zarchive/` holds superseded content kept for reference (not part of current canon)

## Important Notes

- This repository is built under the Darrington Press Community Gaming License
- All content must comply with official Daggerheart design principles
- Campaign frame focuses on mist mechanics and shifting Path configurations
- The `lib/daggerheart-srd/` submodule provides authoritative rules reference
- Location content should be modular to support the shifting Path concept
- Use specialized agents in `.claude/agents/` for content creation tasks
- Reference `Progression.md` for complete development history and design decisions