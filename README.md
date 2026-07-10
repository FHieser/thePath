# The Path

**🔗 [View the campaign site on GitHub Pages](https://fhieser.github.io/thePath/path-webapp/)**

A custom Daggerheart RPG campaign frame set in a mist-shrouded world, where players traverse shifting, interconnected locations known as "The Path."

## The Campaign — `the-path-campaign/`

All campaign content lives here, organized by kind:

- **`locations/`** — Path locations: surface, underground, the Starfall City sub-area, special locations, and the Village in the Mist hub
- **`adversaries/`** — Custom adversaries by type (mist, beasts, siege, crystal-plague, spider-queen, the-croak, antagonists)
- **`lore/`** — Factions (one folder per faction, with NPCs) and mist-islands/Starfall lore
- **`mechanics/`** — Path generation, crafting & trading, village siege, Starfall City, and other core rules
- **`items/`** — Equipment and item catalogs
- **`campaign/`** — Active session/campaign tracking (e.g. Moonfield)
- **`example-path/`** — A reusable library of example Path configurations

See [CLAUDE.md](CLAUDE.md) for the full directory breakdown and content-creation conventions.

## The Webapp — `path-webapp/`

A static site for browsing all campaign content — locations, adversaries, factions, items, path mechanics. This is what's deployed to the GitHub Pages link above.

Run it locally:

```bash
cd path-webapp
python -m http.server 8000
```

Then open `http://localhost:8000`. See [path-webapp/README.md](path-webapp/README.md) for other server options and troubleshooting.

Pushes to `main` auto-deploy `path-webapp/` (plus `the-path-campaign/` and the root `index.html`) to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Content-Creation Commands

For use with [Claude Code](https://claude.com/claude-code) in this repo — slash commands in `.claude/commands/` walk through creating new content collaboratively:

- `/create-location`, `/create-npc`, `/create-faction`, `/create-adversary`, `/create-item`, `/create-path`, `/create-chime`

`.claude/agents/` also has 10 specialized agents (GM support, adversary building, combat mechanics, equipment, homebrew design, rules lookup, and more) for deeper help on specific systems.

---

<details>
<summary>Also in this repo</summary>

- **`lib/daggerheart-srd/`** — Git submodule with the official Daggerheart SRD
- **`lib/og-dhsrd/`** — HTML reference version of the SRD (adversary benchmarks, scaling guidelines)
- **`homebrew-kit/`** — Official Daggerheart Homebrew Kit for content creation guidelines
- **`Pitch.md`** — Campaign concept and core mechanics overview
- **`Progression.md`** — Development changelog and campaign advancement tracking
- **`STYLE-GUIDE.md`** — Modifier terminology and formatting rules
- **`FILE-INDEX.md`** — Full repository file index

### Setup

This repo uses git submodules for SRD reference content:

```bash
git clone --recurse-submodules https://github.com/FHieser/thePath.git
```

Or, if already cloned:

```bash
git submodule update --init --recursive
```

### License

Built under the [Darrington Press Community Gaming License](https://darringtonpress.com/license).

</details>
