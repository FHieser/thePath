# File Index — The Path Campaign Repository

Auto-generated index of all tracked, non-gitignored files. Organized by directory with brief descriptions to aid navigation.

> **Excluded**: `path-webapp/` (web app, gitignored), `lib/daggerheart-srd/` contents (git submodule), `lib/og-dhsrd/` contents (git submodule)

---

## Root

| File | Description |
|------|-------------|
| [CLAUDE.md](CLAUDE.md) | Project instructions for Claude Code — architecture overview, data access patterns, content creation standards |
| [FILE-INDEX.md](FILE-INDEX.md) | This file — repository file index for agent navigation |
| [Pitch.md](Pitch.md) | Campaign concept, core mechanics overview, and setting premise |
| [Progression.md](Progression.md) | Development changelog and campaign advancement tracking |
| [STYLE-GUIDE.md](STYLE-GUIDE.md) | Standardized modifier terminology and formatting rules |
| [TODO.md](TODO.md) | Active task tracking and backlog |
| [.gitignore](.gitignore) | Ignored paths: `path-webapp/`, `serve.sh`, `serve.bat`, `/index.html` |
| [.gitmodules](.gitmodules) | Submodule definitions for `lib/daggerheart-srd` and `lib/og-dhsrd` |
| [.gitattributes](.gitattributes) | Git attributes configuration |

---

## .claude/

### .claude/agents/ — Specialized AI agents for content creation

| File | Description |
|------|-------------|
| [.claude/agents/adventure-running-gm.md](.claude/agents/adventure-running-gm.md) | GM support agent: Fear economy, GM moves, session pacing, encounter management |
| [.claude/agents/adversary-builder.md](.claude/agents/adversary-builder.md) | Adversary and environment designer using JSON templates and scaling guidelines |
| [.claude/agents/campaign-frames.md](.claude/agents/campaign-frames.md) | Campaign frame creation, theme development, and long-term narrative structure |
| [.claude/agents/character-creator.md](.claude/agents/character-creator.md) | Character creation and progression levels 1–10 |
| [.claude/agents/combat-mechanics.md](.claude/agents/combat-mechanics.md) | Duality Dice mechanics, damage calculations, conditions, tactical guidance |
| [.claude/agents/encounters-environments.md](.claude/agents/encounters-environments.md) | Encounter design with Battle Point system and environmental storytelling |
| [.claude/agents/equipment-crafter.md](.claude/agents/equipment-crafter.md) | Homebrew weapon, armor, and loot creation using Homebrew Kit guidelines |
| [.claude/agents/equipment.md](.claude/agents/equipment.md) | Equipment selection, upgrades, economic systems, build optimization |
| [.claude/agents/homebrew-designer.md](.claude/agents/homebrew-designer.md) | Homebrew ancestries, communities, domains, classes, and content validation |
| [.claude/agents/rules-expert.md](.claude/agents/rules-expert.md) | Core rules systems, homebrew mechanics integration, design principles |

### .claude/commands/ — Slash commands

| File | Description |
|------|-------------|
| [.claude/commands/create-adversary.md](.claude/commands/create-adversary.md) | `/create-adversary` command definition |
| [.claude/commands/create-chime.md](.claude/commands/create-chime.md) | `/create-chime` command definition |
| [.claude/commands/create-item.md](.claude/commands/create-item.md) | `/create-item` command definition |
| [.claude/commands/create-location.md](.claude/commands/create-location.md) | `/create-location` command definition |
| [.claude/commands/create-npc.md](.claude/commands/create-npc.md) | `/create-npc` command definition |
| [.claude/commands/create-path.md](.claude/commands/create-path.md) | `/create-path` command definition |
| [.claude/commands/give-me-five.md](.claude/commands/give-me-five.md) | `/give-me-five` — generates 5 examples of a solution |
| [.claude/commands/loadBase.md](.claude/commands/loadBase.md) | `/loadBase` — loads core reference documents into context |
| [.claude/commands/one-by-one.md](.claude/commands/one-by-one.md) | `/one-by-one` — steps through problem aspects sequentially |

---

## homebrew-kit/

| File | Description |
|------|-------------|
| [homebrew-kit/Daggerheart-Homebrew-Kit-v1.0-July-31-2025.pdf](homebrew-kit/Daggerheart-Homebrew-Kit-v1.0-July-31-2025.pdf) | Official Daggerheart Homebrew Kit PDF (v1.0) — content creation guidelines and templates |

---

## lib/ — External References (Submodules)

| Path | Description |
|------|-------------|
| [lib/daggerheart-srd/](lib/daggerheart-srd/) | Git submodule — official Daggerheart SRD with complete rules, classes, ancestries, equipment, adversaries. Key path: `lib/daggerheart-srd/.build/json/` for structured JSON data |
| [lib/og-dhsrd/](lib/og-dhsrd/) | Git submodule — HTML version of the SRD with adversary benchmarks, tier scaling, and design guidelines. Key file: `lib/og-dhsrd/index.html` |

---

## the-path-campaign/

### the-path-campaign/ (root files)

| File | Description |
|------|-------------|
| [the-path-campaign/items.yaml](the-path-campaign/items.yaml) | Campaign item definitions |

### the-path-campaign/adversaries/ — Custom adversaries organized by type

| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/adversary-template.yaml](the-path-campaign/adversaries/adversary-template.yaml) | Template for creating new adversaries |
| [the-path-campaign/adversaries/Example Encounters.md](the-path-campaign/adversaries/Example%20Encounters.md) | Example encounter configurations |

#### Antagonists
| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/antagonists/archon-of-mercy.yaml](the-path-campaign/adversaries/antagonists/archon-of-mercy.yaml) | Archon of Mercy — major antagonist adversary stat block |

#### Beasts
| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/beasts/bff-big-frog.yaml](the-path-campaign/adversaries/beasts/bff-big-frog.yaml) | Big Friendly Frog — beast adversary |
| [the-path-campaign/adversaries/beasts/blood-fern-predator.yaml](the-path-campaign/adversaries/beasts/blood-fern-predator.yaml) | Blood Fern Predator — beast adversary |
| [the-path-campaign/adversaries/beasts/eeligator.yaml](the-path-campaign/adversaries/beasts/eeligator.yaml) | Eeligator — eel/alligator hybrid beast adversary |

#### Crystal Plague
| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/crystal-plague/crystal-plague-todo.md](the-path-campaign/adversaries/crystal-plague/crystal-plague-todo.md) | Development notes and TODO for Crystal Plague adversary set |
| [the-path-campaign/adversaries/crystal-plague/creature-of-the-cellar.yaml](the-path-campaign/adversaries/crystal-plague/creature-of-the-cellar.yaml) | Creature of the Cellar — crystal plague adversary |
| [the-path-campaign/adversaries/crystal-plague/crystal-fused-guard.yaml](the-path-campaign/adversaries/crystal-plague/crystal-fused-guard.yaml) | Crystal Fused Guard — humanoid infected by crystal plague |
| [the-path-campaign/adversaries/crystal-plague/crystal-zombie.yaml](the-path-campaign/adversaries/crystal-plague/crystal-zombie.yaml) | Crystal Zombie — undead crystal plague adversary |
| [the-path-campaign/adversaries/crystal-plague/crystalline-charger.yaml](the-path-campaign/adversaries/crystal-plague/crystalline-charger.yaml) | Crystalline Charger — aggressive crystal plague adversary |
| [the-path-campaign/adversaries/crystal-plague/trap-crystal.yaml](the-path-campaign/adversaries/crystal-plague/trap-crystal.yaml) | Trap Crystal — static hazard/adversary |

#### Mist Creatures
| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/mist/mist-crab-t1.yaml](the-path-campaign/adversaries/mist/mist-crab-t1.yaml) | Mist Crab — Tier 1 |
| [the-path-campaign/adversaries/mist/mist-crab-t2.yaml](the-path-campaign/adversaries/mist/mist-crab-t2.yaml) | Mist Crab — Tier 2 |
| [the-path-campaign/adversaries/mist/mist-stalker-t1.yaml](the-path-campaign/adversaries/mist/mist-stalker-t1.yaml) | Mist Stalker — Tier 1 |
| [the-path-campaign/adversaries/mist/mist-stalker-t2.yaml](the-path-campaign/adversaries/mist/mist-stalker-t2.yaml) | Mist Stalker — Tier 2 |
| [the-path-campaign/adversaries/mist/mist-thrower-t1.yaml](the-path-campaign/adversaries/mist/mist-thrower-t1.yaml) | Mist Thrower — Tier 1 |
| [the-path-campaign/adversaries/mist/mist-thrower-t2.yaml](the-path-campaign/adversaries/mist/mist-thrower-t2.yaml) | Mist Thrower — Tier 2 |
| [the-path-campaign/adversaries/mist/mist-walker-t1.yaml](the-path-campaign/adversaries/mist/mist-walker-t1.yaml) | Mist Walker — Tier 1 |
| [the-path-campaign/adversaries/mist/mist-walker-t2.yaml](the-path-campaign/adversaries/mist/mist-walker-t2.yaml) | Mist Walker — Tier 2 |
| [the-path-campaign/adversaries/mist/mist-wraith-leader-t1.yaml](the-path-campaign/adversaries/mist/mist-wraith-leader-t1.yaml) | Mist Wraith Leader — Tier 1 |
| [the-path-campaign/adversaries/mist/mist-wraith-leader-t2.yaml](the-path-campaign/adversaries/mist/mist-wraith-leader-t2.yaml) | Mist Wraith Leader — Tier 2 |
| [the-path-campaign/adversaries/mist/void-pearl-monk-t2.yaml](the-path-campaign/adversaries/mist/void-pearl-monk-t2.yaml) | Void Pearl Monk — Tier 2 mist adversary |

#### Siege
| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/siege/mist-anchor.yaml](the-path-campaign/adversaries/siege/mist-anchor.yaml) | Mist Anchor — static siege objective (no attack block) |
| [the-path-campaign/adversaries/siege/pale-shell-drifter-leviathan.yaml](the-path-campaign/adversaries/siege/pale-shell-drifter-leviathan.yaml) | Pale Shell Drifter Leviathan — Colossus-type multi-segment siege adversary |

#### Spider Queen
| File | Description |
|------|-------------|
| [the-path-campaign/adversaries/spider-queen/giant-spider-guardian.yaml](the-path-campaign/adversaries/spider-queen/giant-spider-guardian.yaml) | Giant Spider Guardian — elite minion |
| [the-path-campaign/adversaries/spider-queen/spider-emissary.yaml](the-path-campaign/adversaries/spider-queen/spider-emissary.yaml) | Spider Emissary — social/diplomat spider adversary |
| [the-path-campaign/adversaries/spider-queen/spider-minion.yaml](the-path-campaign/adversaries/spider-queen/spider-minion.yaml) | Spider Minion — basic spider adversary |
| [the-path-campaign/adversaries/spider-queen/spider-queen.yaml](the-path-campaign/adversaries/spider-queen/spider-queen.yaml) | Spider Queen — boss adversary |
| [the-path-campaign/adversaries/spider-queen/spider-swarm.yaml](the-path-campaign/adversaries/spider-queen/spider-swarm.yaml) | Spider Swarm — horde adversary |

---

### the-path-campaign/campaign/ — Active campaign session tracking

| File | Description |
|------|-------------|
| [the-path-campaign/campaign/FreeMountain.md/Hooks.md](the-path-campaign/campaign/FreeMountain.md/Hooks.md) | FreeMountain campaign — story hooks |
| [the-path-campaign/campaign/FreeMountain.md/Tracking.md](the-path-campaign/campaign/FreeMountain.md/Tracking.md) | FreeMountain campaign — session and progress tracking |
| [the-path-campaign/campaign/Moonfield/Tracking.md](the-path-campaign/campaign/Moonfield/Tracking.md) | Moonfield campaign — session and progress tracking |

---

### the-path-campaign/example-path/ — Example Path configurations and templates

| File | Description |
|------|-------------|
| [the-path-campaign/example-path/Session Template.md](the-path-campaign/example-path/Session%20Template.md) | Session preparation template |
| [the-path-campaign/example-path/path-library/definitions.md](the-path-campaign/example-path/path-library/definitions.md) | Path library terminology and definitions |
| [the-path-campaign/example-path/path-library/close-encounters.yaml](the-path-campaign/example-path/path-library/close-encounters.yaml) | "Close Encounters" pre-built path configuration |
| [the-path-campaign/example-path/path-library/highland-run.yaml](the-path-campaign/example-path/path-library/highland-run.yaml) | "Highland Run" pre-built path configuration |
| [the-path-campaign/example-path/path-library/hollow-cross.yaml](the-path-campaign/example-path/path-library/hollow-cross.yaml) | "Hollow Cross" pre-built path configuration |
| [the-path-campaign/example-path/path-library/initial-path.yaml](the-path-campaign/example-path/path-library/initial-path.yaml) | Session 1 initial path configuration |
| [the-path-campaign/example-path/path-library/lake-crossing.yaml](the-path-campaign/example-path/path-library/lake-crossing.yaml) | "Lake Crossing" pre-built path configuration |
| [the-path-campaign/example-path/path-library/monastery-march.yaml](the-path-campaign/example-path/path-library/monastery-march.yaml) | "Monastery March" pre-built path configuration |
| [the-path-campaign/example-path/path-library/needle-descent.yaml](the-path-campaign/example-path/path-library/needle-descent.yaml) | "Needle Descent" pre-built path configuration |
| [the-path-campaign/example-path/path-library/plague-march.yaml](the-path-campaign/example-path/path-library/plague-march.yaml) | "Plague March" pre-built path configuration |

---

### the-path-campaign/framework/ — Core campaign mechanics documents

| File | Description |
|------|-------------|
| [the-path-campaign/framework/FearGuide.md](the-path-campaign/framework/FearGuide.md) | GM guide to Fear economy management in The Path |
| [the-path-campaign/framework/campaign-overview.md](the-path-campaign/framework/campaign-overview.md) | Core campaign overview: setting, themes, session structure |

---

### the-path-campaign/locations/ — Path locations

#### Special Locations
| File | Description |
|------|-------------|
| [the-path-campaign/locations/path-locations/special-locations/vanishing-mist.md](the-path-campaign/locations/path-locations/special-locations/vanishing-mist.md) | Vanishing Mist — special event location |
| [the-path-campaign/locations/path-locations/special-locations/village-in-the-mist.md](the-path-campaign/locations/path-locations/special-locations/village-in-the-mist.md) | Village in the Mist — central hub location (special) |

#### Path Location Reference Files
| File | Description |
|------|-------------|
| [the-path-campaign/locations/path-locations/Glossary.md](the-path-campaign/locations/path-locations/Glossary.md) | Location modifier glossary and definitions |
| [the-path-campaign/locations/path-locations/location-ideas.md](the-path-campaign/locations/path-locations/location-ideas.md) | Brainstorming notes for future locations |
| [the-path-campaign/locations/path-locations/location-template.yaml](the-path-campaign/locations/path-locations/location-template.yaml) | Template for creating new path locations |
| [the-path-campaign/locations/path-locations/path-mechanics.yaml](the-path-campaign/locations/path-locations/path-mechanics.yaml) | Core path mechanics: Concept → Modifiers → Features → Integration framework |

#### Surface Locations (24 environments)
| File | Description |
|------|-------------|
| [the-path-campaign/locations/path-locations/surface-locations/ancient-crossing.yaml](the-path-campaign/locations/path-locations/surface-locations/ancient-crossing.yaml) | Ancient Crossing — ruined bridge/ford environment |
| [the-path-campaign/locations/path-locations/surface-locations/barnacle-gardens.yaml](the-path-campaign/locations/path-locations/surface-locations/barnacle-gardens.yaml) | Barnacle Gardens — coastal/tidal environment |
| [the-path-campaign/locations/path-locations/surface-locations/bells-edge.yaml](the-path-campaign/locations/path-locations/surface-locations/bells-edge.yaml) | Bell's Edge — elevated cliff/bell tower environment |
| [the-path-campaign/locations/path-locations/surface-locations/blood-fern-valley.yaml](the-path-campaign/locations/path-locations/surface-locations/blood-fern-valley.yaml) | Blood Fern Valley — dangerous overgrown valley |
| [the-path-campaign/locations/path-locations/surface-locations/burnt-clearing.yaml](the-path-campaign/locations/path-locations/surface-locations/burnt-clearing.yaml) | Burnt Clearing — scorched open area |
| [the-path-campaign/locations/path-locations/surface-locations/devils-rock.yaml](the-path-campaign/locations/path-locations/surface-locations/devils-rock.yaml) | Devil's Rock — rocky outcropping environment |
| [the-path-campaign/locations/path-locations/surface-locations/forest-refuge.yaml](the-path-campaign/locations/path-locations/surface-locations/forest-refuge.yaml) | Forest Refuge — sheltered woodland environment |
| [the-path-campaign/locations/path-locations/surface-locations/hanging-gardens.yaml](the-path-campaign/locations/path-locations/surface-locations/hanging-gardens.yaml) | Hanging Gardens — elevated terraced garden environment |
| [the-path-campaign/locations/path-locations/surface-locations/highland-circle.yaml](the-path-campaign/locations/path-locations/surface-locations/highland-circle.yaml) | Highland Circle — standing stone circle environment |
| [the-path-campaign/locations/path-locations/surface-locations/highland-watch.yaml](the-path-campaign/locations/path-locations/surface-locations/highland-watch.yaml) | Highland Watch — elevated observation post |
| [the-path-campaign/locations/path-locations/surface-locations/hollow-woods.yaml](the-path-campaign/locations/path-locations/surface-locations/hollow-woods.yaml) | Hollow Woods — eerie hollow forest environment |
| [the-path-campaign/locations/path-locations/surface-locations/lost-flame.yaml](the-path-campaign/locations/path-locations/surface-locations/lost-flame.yaml) | Lost Flame — extinguished sacred flame site |
| [the-path-campaign/locations/path-locations/surface-locations/mantaray-tree.yaml](the-path-campaign/locations/path-locations/surface-locations/mantaray-tree.yaml) | Mantaray Tree — giant tree with manta ray-like canopy |
| [the-path-campaign/locations/path-locations/surface-locations/misty-waters.yaml](the-path-campaign/locations/path-locations/surface-locations/misty-waters.yaml) | Misty Waters — lake or river shrouded in mist |
| [the-path-campaign/locations/path-locations/surface-locations/monastery.yaml](the-path-campaign/locations/path-locations/surface-locations/monastery.yaml) | Monastery — abandoned or occupied religious complex |
| [the-path-campaign/locations/path-locations/surface-locations/overgrown-temple.yaml](the-path-campaign/locations/path-locations/surface-locations/overgrown-temple.yaml) | Overgrown Temple — reclaimed-by-nature ancient temple |
| [the-path-campaign/locations/path-locations/surface-locations/sacred-mountain-pass.yaml](the-path-campaign/locations/path-locations/surface-locations/sacred-mountain-pass.yaml) | Sacred Mountain Pass — high-altitude religious crossing |
| [the-path-campaign/locations/path-locations/surface-locations/silken-spire.yaml](the-path-campaign/locations/path-locations/surface-locations/silken-spire.yaml) | Silken Spire — spider-silk covered tower |
| [the-path-campaign/locations/path-locations/surface-locations/stone-works.yaml](the-path-campaign/locations/path-locations/surface-locations/stone-works.yaml) | Stone Works — ancient quarry or construction site |
| [the-path-campaign/locations/path-locations/surface-locations/the-giant-walls.yaml](the-path-campaign/locations/path-locations/surface-locations/the-giant-walls.yaml) | The Giant Walls — massive ancient fortification |
| [the-path-campaign/locations/path-locations/surface-locations/unstable-mist.yaml](the-path-campaign/locations/path-locations/surface-locations/unstable-mist.yaml) | Unstable Mist — dangerous mist-saturated area |
| [the-path-campaign/locations/path-locations/surface-locations/verdant-crossing.yaml](the-path-campaign/locations/path-locations/surface-locations/verdant-crossing.yaml) | Verdant Crossing — lush overgrown crossing |
| [the-path-campaign/locations/path-locations/surface-locations/windswept-grasslands.yaml](the-path-campaign/locations/path-locations/surface-locations/windswept-grasslands.yaml) | Windswept Grasslands — open plains environment |

#### Underground Locations (11 environments)
| File | Description |
|------|-------------|
| [the-path-campaign/locations/path-locations/underground-locations/black-beach.yaml](the-path-campaign/locations/path-locations/underground-locations/black-beach.yaml) | Black Beach — underground dark-sand shoreline |
| [the-path-campaign/locations/path-locations/underground-locations/black-falls.yaml](the-path-campaign/locations/path-locations/underground-locations/black-falls.yaml) | Black Falls — underground waterfall environment |
| [the-path-campaign/locations/path-locations/underground-locations/brood-throne.yaml](the-path-campaign/locations/path-locations/underground-locations/brood-throne.yaml) | Brood Throne — spider queen's underground lair |
| [the-path-campaign/locations/path-locations/underground-locations/flooded-network.yaml](the-path-campaign/locations/path-locations/underground-locations/flooded-network.yaml) | Flooded Network — partially submerged tunnel system |
| [the-path-campaign/locations/path-locations/underground-locations/fungal-depths.yaml](the-path-campaign/locations/path-locations/underground-locations/fungal-depths.yaml) | Fungal Depths — bioluminescent mushroom cavern |
| [the-path-campaign/locations/path-locations/underground-locations/geothermal-caverns.yaml](the-path-campaign/locations/path-locations/underground-locations/geothermal-caverns.yaml) | Geothermal Caverns — volcanic heat vent cavern system |
| [the-path-campaign/locations/path-locations/underground-locations/mining-complex.yaml](the-path-campaign/locations/path-locations/underground-locations/mining-complex.yaml) | Mining Complex — abandoned mine network |
| [the-path-campaign/locations/path-locations/underground-locations/needle-tunnels.yaml](the-path-campaign/locations/path-locations/underground-locations/needle-tunnels.yaml) | Needle Tunnels — narrow crystal-spire filled tunnels |
| [the-path-campaign/locations/path-locations/underground-locations/red-cellar.yaml](the-path-campaign/locations/path-locations/underground-locations/red-cellar.yaml) | Red Cellar — blood-stained underground chamber |
| [the-path-campaign/locations/path-locations/underground-locations/reed-marsh-caverns.yaml](the-path-campaign/locations/path-locations/underground-locations/reed-marsh-caverns.yaml) | Reed Marsh Caverns — underground marsh and reed beds |
| [the-path-campaign/locations/path-locations/underground-locations/sacred-underground.yaml](the-path-campaign/locations/path-locations/underground-locations/sacred-underground.yaml) | Sacred Underground — underground sacred flame site |

#### Village in the Mist (Hub Location)
| File | Description |
|------|-------------|
| [the-path-campaign/locations/village-in-the-mist/village-overview.md](the-path-campaign/locations/village-in-the-mist/village-overview.md) | Village overview, layout, and narrative context |
| [the-path-campaign/locations/village-in-the-mist/upgrades.md](the-path-campaign/locations/village-in-the-mist/upgrades.md) | Village upgrade options and costs |
| [the-path-campaign/locations/village-in-the-mist/sacred-flame-sanctuary-card.yaml](the-path-campaign/locations/village-in-the-mist/sacred-flame-sanctuary-card.yaml) | Sacred Flame Sanctuary — village location card |
| [the-path-campaign/locations/village-in-the-mist/forge-card.yaml](the-path-campaign/locations/village-in-the-mist/forge-card.yaml) | Forge — village location card |
| [the-path-campaign/locations/village-in-the-mist/community-hearth-card.yaml](the-path-campaign/locations/village-in-the-mist/community-hearth-card.yaml) | Community Hearth — village location card |
| [the-path-campaign/locations/village-in-the-mist/flame-gatherers-lodge-card.yaml](the-path-campaign/locations/village-in-the-mist/flame-gatherers-lodge-card.yaml) | Flame Gatherer's Lodge — village location card |
| [the-path-campaign/locations/village-in-the-mist/supply-cache-card.yaml](the-path-campaign/locations/village-in-the-mist/supply-cache-card.yaml) | Supply Cache — village location card |

---

### the-path-campaign/lore/ — Worldbuilding and cosmology

| File | Description |
|------|-------------|
| [the-path-campaign/lore/BaseIdea.md](the-path-campaign/lore/BaseIdea.md) | Original base concept and foundational lore |
| [the-path-campaign/lore/celestial-events.md](the-path-campaign/lore/celestial-events.md) | Calendar of celestial events affecting The Path |
| [the-path-campaign/lore/wandering-stars.md](the-path-campaign/lore/wandering-stars.md) | Lore on wandering stars and their significance |

#### Factions
| File | Description |
|------|-------------|
| [the-path-campaign/lore/factions/ExampleFaction.md](the-path-campaign/lore/factions/ExampleFaction.md) | Template for faction documents |
| [the-path-campaign/lore/factions/BrassMechanicorum.md](the-path-campaign/lore/factions/BrassMechanicorum.md) | Brass Mechanicorum faction — clockwork/engineering guild |
| [the-path-campaign/lore/factions/FireBorn.md](the-path-campaign/lore/factions/FireBorn.md) | Fire Born faction — flame-worshipping survivors |
| [the-path-campaign/lore/factions/MistBorn.md](the-path-campaign/lore/factions/MistBorn.md) | Mist Born faction — mist-adapted inhabitants |
| [the-path-campaign/lore/factions/Rootbound.md](the-path-campaign/lore/factions/Rootbound.md) | Rootbound faction — nature/plant aligned faction |

#### Mist Islands / Starfall Setting
| File | Description |
|------|-------------|
| [the-path-campaign/lore/mist-islands/mist-islands.md](the-path-campaign/lore/mist-islands/mist-islands.md) | Mist Islands overview and geography |
| [the-path-campaign/lore/mist-islands/starfall-city-characters.md](the-path-campaign/lore/mist-islands/starfall-city-characters.md) | Notable characters of Starfall City |
| [the-path-campaign/lore/mist-islands/starfall-city-mechanics.md](the-path-campaign/lore/mist-islands/starfall-city-mechanics.md) | Starfall City mechanical rules and systems |
| [the-path-campaign/lore/mist-islands/starfall-city-stories.md](the-path-campaign/lore/mist-islands/starfall-city-stories.md) | Story hooks and narrative content for Starfall City |
| [the-path-campaign/lore/mist-islands/starfall-crystals.md](the-path-campaign/lore/mist-islands/starfall-crystals.md) | Starfall crystal properties, uses, and lore |
| [the-path-campaign/lore/mist-islands/starfall-kingdom.md](the-path-campaign/lore/mist-islands/starfall-kingdom.md) | Starfall Kingdom history, politics, and structure |

---

### the-path-campaign/npcs/ — Non-player characters organized by affiliation

| File | Description |
|------|-------------|
| [the-path-campaign/npcs/SimpleNPC.md](the-path-campaign/npcs/SimpleNPC.md) | Minimal NPC template |
| [the-path-campaign/npcs/npc-template.md](the-path-campaign/npcs/npc-template.md) | Full NPC template with all fields |
| [the-path-campaign/npcs/archon-of-mercy.md](the-path-campaign/npcs/archon-of-mercy.md) | Archon of Mercy — major antagonist NPC profile |

#### Brass Mechanicorum NPCs
| File | Description |
|------|-------------|
| [the-path-campaign/npcs/brass-mechanicorum/copass.md](the-path-campaign/npcs/brass-mechanicorum/copass.md) | Copass — Brass Mechanicorum NPC |

#### Factionless NPCs
| File | Description |
|------|-------------|
| [the-path-campaign/npcs/factionless/archon-letter-to-aerion.md](the-path-campaign/npcs/factionless/archon-letter-to-aerion.md) | In-world letter from the Archon to Aerion |
| [the-path-campaign/npcs/factionless/drift.md](the-path-campaign/npcs/factionless/drift.md) | Drift — factionless NPC |
| [the-path-campaign/npcs/factionless/hund.md](the-path-campaign/npcs/factionless/hund.md) | Hund — factionless NPC |
| [the-path-campaign/npcs/factionless/spider-queen.md](the-path-campaign/npcs/factionless/spider-queen.md) | Spider Queen — boss NPC profile |
| [the-path-campaign/npcs/factionless/the-bound-raven.md](the-path-campaign/npcs/factionless/the-bound-raven.md) | The Bound Raven — mysterious factionless NPC |

#### Rootbound NPCs
| File | Description |
|------|-------------|
| [the-path-campaign/npcs/rootbound/naki.md](the-path-campaign/npcs/rootbound/naki.md) | Naki — Rootbound NPC |
| [the-path-campaign/npcs/rootbound/the-watcher.md](the-path-campaign/npcs/rootbound/the-watcher.md) | The Watcher — Rootbound NPC |

#### Village NPCs
| File | Description |
|------|-------------|
| [the-path-campaign/npcs/village/brenner-flame-keeper.md](the-path-campaign/npcs/village/brenner-flame-keeper.md) | Brenner — village Flame Keeper NPC |
| [the-path-campaign/npcs/village/donatello-flame-gatherer.md](the-path-campaign/npcs/village/donatello-flame-gatherer.md) | Donatello — village Flame Gatherer NPC |
| [the-path-campaign/npcs/village/nix-hearth-keeper.md](the-path-campaign/npcs/village/nix-hearth-keeper.md) | Nix — village Hearth Keeper NPC |

---

### the-path-campaign/village-siege/ — Siege encounter mechanics

| File | Description |
|------|-------------|
| [the-path-campaign/village-siege/npc-defenders.yaml](the-path-campaign/village-siege/npc-defenders.yaml) | NPC defender stat blocks for village siege |
| [the-path-campaign/village-siege/siege-enemy-groups.yaml](the-path-campaign/village-siege/siege-enemy-groups.yaml) | Enemy group compositions for siege encounters |
| [the-path-campaign/village-siege/siege-mechanics.yaml](the-path-campaign/village-siege/siege-mechanics.yaml) | Core siege mechanics rules and systems |

---

### the-path-campaign/zarchive/ — Archived / superseded content

| File | Description |
|------|-------------|
| [the-path-campaign/zarchive/MistBorn-Development-Summary.md](the-path-campaign/zarchive/MistBorn-Development-Summary.md) | Archived MistBorn faction development notes (superseded) |

---

*Last updated: 2026-05-01 — 152 tracked files*
