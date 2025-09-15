# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is "The Path" - a custom Daggerheart RPG campaign frame featuring a mist-shrouded world where players traverse shifting interconnected locations. The repository contains specialized AI agents, homebrew content, and campaign materials built on the official Daggerheart System Reference Document.

## Core Architecture

### Directory Structure
- `daggerheart-agents/` - 10 specialized AI agents for different RPG aspects (character creation, combat, equipment, etc.)
- `lib/daggerheart-srd/` - Git submodule containing official Daggerheart SRD with complete rules and content
- `daggerheart-reference-json/` - JSON templates for homebrew content creation based on official Homebrew Kit
- `campaign-frame/` - Campaign-specific content for "The Path" setting
- `homebrew-content/` - Custom ancestries, domains, equipment, and spells
- `homebrew-kit/` - Official Daggerheart Homebrew Kit PDF (v1.0)
- Content directories: `adversaries/`, `environments/`, `factions/`, `npcs/`, `reference-materials/`

### Agent System
The repository features 10 specialized agents (markdown files) that define roles for different RPG aspects:
1. **Character Creator & Progression Agent** - Character creation through all 10 levels
2. **Combat Mechanics Agent** - Duality dice system and narrative combat
3. **Equipment Agent** - Weapons, armor, and loot systems
4. **Encounters & Environments Agent** - Complete encounter design
5. **Campaign Frames Agent** - Long-term campaign structure
6. **Adventure Running Agent** - GM support and session management
7. **Homebrew Designer Agent** - Custom content creation
8. **Adversary Builder Agent** - NPC and monster creation
9. **Equipment Crafter Agent** - Custom equipment design
10. **Rules Expert Agent** - Rules clarification and expertise

### Content Development Protocol
**CRITICAL**: Before creating ANY campaign content, you MUST follow the development protocol in `daggerheart-agents/shared-protocols/development-protocol.md`:
1. Present outline first (DO NOT write content yet)
2. Identify ALL game mechanics involved
3. Request explicit approval using specified format
4. Wait for user confirmation before proceeding

### Data Sources
- **Official SRD**: `lib/daggerheart-srd/` contains complete rules, classes, ancestries, equipment, adversaries
- **JSON Templates**: `daggerheart-reference-json/` provides structured templates for homebrew content
- **Built Data**: `lib/daggerheart-srd/.build/json/` contains processed game data (weapons, adversaries, etc.)

## Key Systems

### Campaign Frame: "The Path"
- World shrouded in otherworldly mist making normal travel impossible
- Players traverse "The Path" - shifting interconnected locations between sessions
- Core mechanic: Path configuration changes each adventure session
- Sessions begin in "Village in the Mist"
- Ancient fires keep mist at bay in sanctuary locations

### Content Creation Standards
- Follow Daggerheart's 7 core design principles
- Use tier-appropriate scaling (Tiers 1-4)
- Maintain asymmetrical design (PC vs adversary mechanics)
- Reference existing SRD content in `lib/daggerheart-srd/`
- Use JSON templates from `daggerheart-reference-json/` for structure

### Agent Integration
- Agents work together across all game aspects
- Each agent references specific SRD files for accurate system knowledge
- Agents provide optimization focus and build synergy recommendations
- Emphasis on collaborative storytelling and narrative support

## Working with This Repository

### When Creating Campaign Content
1. **Always** check development protocol first
2. Reference existing SRD content in `lib/daggerheart-srd/`
3. Use JSON templates for structure validation
4. Follow tier scaling guidelines (T1-T4)
5. Maintain "The Path" campaign themes and mist mechanics

### When Using Agents
- Each agent has specific capabilities and context sources listed
- Agents can be used individually or as a complete system
- Reference agent README files for detailed workflows
- Consider cross-agent integration for complex tasks

### Data Access Patterns
- SRD content: Read from `lib/daggerheart-srd/contents/` and subdirectories
- Game data: Access JSON files in `lib/daggerheart-srd/.build/json/`
- Templates: Use structures from `daggerheart-reference-json/`
- Campaign content: Organize in appropriate directories (adversaries/, environments/, etc.)

## Important Notes

- This repository is built under the Darrington Press Community Gaming License
- All content must comply with official Daggerheart design principles
- The development protocol is mandatory for quality control and game balance
- Agents are documentation files that define specialized roles, not executable code
- Campaign frame focuses on mist mechanics and shifting Path configurations