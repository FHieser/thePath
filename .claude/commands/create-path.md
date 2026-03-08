# Create Path Command

You are helping the user design a new path configuration for "The Path" campaign and add it to the path library.

## Initial Setup

**FIRST:** Run the `/loadBase` command to load `path-mechanics.yaml` and `Glossary.md` before beginning. Then read the following additional references:
- `the-path-campaign/example-path/path-library/definitions.md` — tier system and existing paths
- `the-path-campaign/example-path/path-library/` — all existing path files as format examples
- `the-path-campaign/locations/path-locations/surface-locations/` — available surface locations
- `the-path-campaign/locations/path-locations/underground-locations/` — available underground locations

## Process Overview

Work through path creation step-by-step, collaborating with the user on each decision. A path is a spatial arrangement of existing locations — the output is a grid configuration, not new content. Do NOT auto-generate the full path without user input at each stage.

---

## Step 1: Initial Concept

Ask the user for:
- **Theme / tone** — What's the feel of this path? (coastal journey, highland crossing, deep descent, etc.)
- **Starting and ending anchors** — Paths should begin and end at Flame-Touched locations (Village in the Mist and/or Sacred Mountain Pass). Are both anchors present?
- **Daggerheart Tier** — Which phase of campaign is this path designed for?
  - **Tier 1 (Grassroots):** Level 1. New characters, lower threat density.
  - **Tier 2 (Adventurer):** Levels 2–4. Standard campaign range.
  - **Tier 3 (Champion):** Levels 5–7. High threat, complex encounters.
  - **Tier 4 (Master):** Levels 8–10. Maximum power, brutal paths.
- **Personal Ranking (1–10)** — Based on real-play experience: how punishing was this path? (1 = casual, 10 = brutal). Assign after running it. Leave blank for new paths.
- **Surface only or mixed?** — Does this path include underground locations?

---

## Step 2: Grid Structure

Based on the tier and theme, determine the grid shape together:

**Row configuration:**
- **1 active row (A):** Linear corridor. Simple and direct.
- **2 active rows (A + B or A' + A):** One branch above or below. Adds route choice.
- **3 active rows (A' + A + B or B' + A' + A):** Full branching network. Richer exploration.

**Column span:**
- Columns 1–6 are standard for most paths.
- Negative columns (|−1, |−2) can expand westward if needed.

**Underground grid:**
- Only needed if Cave Mouth locations appear on the surface.
- Underground locations must align by column with their Cave Mouth entry point.

**Row label convention:**
- Branches *above* the main corridor: A', B' (used when main path is in the lower row)
- Branches *below* the main corridor: B (used when main path is in row A)
- Establish which row is the "main corridor" first, then label branches relative to it.

---

## Step 3: Location Selection

Help the user choose locations for the path. For each location, consider:

**Key constraint rules:**
- **Stable locations** (Village in the Mist, Sacred Mountain Pass) must go in their known grid positions if previously visited.
- **Cave Mouth locations** must appear on the surface grid at the same column as the underground location they connect to.
- **Linked pairs** must appear together (e.g., Silken Spire → Brood Throne). Placing one brings both.
- **Routes(N)** locations have fixed connection counts — a Routes(1) location is a dead-end branch, not a through-passage.

**Questions to guide selection:**
- Which locations fit the path's theme?
- Which modifiers (Wild Beasts, Inhabited, Mist-Touched, Crystal-Plague) do you want present?
- Do you want underground access? If so, which Cave Mouth locations open the descent?
- Are there Linked pairs you want to use?

**Placement method note:** This library stores Deliberate Placement configurations. The GM chooses where each location sits — no random draw for the library.

---

## Step 4: Grid Population

Place locations cell by cell, working left to right through each row. For each location, confirm:

1. **Which cell?** (e.g., A3, B'5)
2. **Does it need a Cave Mouth neighbor?** If it's Underground, there must be a surface location at the same column with Cave Mouth.
3. **Does it satisfy any Routes(N) constraints?** Check how many neighbors it's connecting to.
4. **Is it Stable?** Note this in the Planning Notes.

Build the surface grid first, then the underground grid. Cross-reference column alignment as you go.

---

## Step 5: Connection Review

After placing all locations, verify the path makes narrative and mechanical sense:

- **Can players reach the destination?** Is there a traversable route from start to end?
- **Are there meaningful choices?** Do branch rows offer real decisions (not just one obvious path)?
- **Cave Mouth alignment:** Every Underground location has a surface Cave Mouth at the same column?
- **Linked pairs complete?** If Silken Spire is on the surface, is Brood Throne in the underground at column 3?
- **Dead ends intentional?** Routes(1) locations should be clear optional detours, not accidental traps.

If something doesn't connect cleanly, adjust grid positions — not location choices.

---

## Step 6: Name & Classify

**Naming the path:**
- Choose a thematic name that evokes the journey's character (the terrain, the hazards, the destination feel).
- Avoid session numbers or campaign names — the library is campaign-agnostic.
- Good examples: *Highland Run*, *Lake Crossing*, *Needle Descent*, *Reef Approach*, *Fungal Passage*

**Counting total locations:**
- Count every filled cell in both grids (surface + underground).
- Assign the **Daggerheart Tier** (1–4) based on what level players the path is designed for.
- Assign the **Personal Ranking** (1–10) based on actual play experience — leave as `?` if the path hasn't been run.
- File name format: `[dh-tier].[personal-ranking]-[thematic-name].md` (e.g., `2.4-hollow-cross.md`)
- If personal ranking is unknown: `[dh-tier].?-[thematic-name].md`

---

## Step 7: Compile Path YAML

Create the path file using this structure:

```yaml
name: [Thematic Name]
tier: [1–4]
personal_ranking: [1–10, or omit if unplayed]

rowLabels:
  "0": [label — depends on which rows are used]
  "1": [label]
  "2": [label]   # only if 3 rows

gridSurface:
  "col,row": location-id   # col = column index (col 1 = 0, col 2 = 1, ..., col 6 = 5)
  # ... one entry per surface location

gridUnderground:
  "col,row": location-id
  # ... one entry per underground location (omit section entirely if no underground)
```

**Coordinate mapping rule:**
- Rows are 0-indexed from top to bottom. The topmost row used in the path = 0, next = 1, etc.
- Columns: markdown col 1 = index 0, col 2 = index 1, ..., col 6 = index 5
- rowLabels maps each integer row index to its named label (A', A, B, B', etc.)

**YAML formatting rules:**
- Keys containing commas (like `"1,0"`) must be double-quoted
- rowLabel values with apostrophes (like `A'`) must be double-quoted
- Plain location IDs (kebab-case, no special chars) do not need quoting

**File location:** `path-webapp/data/path-library/[thematic-name].yaml`

---

## Step 8: Auto-Discovery (No Manual Index Needed)

The webapp auto-discovers YAML files from the `data/path-library/` folder by scanning directory listings. No manual index update is required — the file appearing in the folder is sufficient for it to show up in the Path Library, the index page cards, and the Path Creator's example dropdown.

Optionally update `the-path-campaign/example-path/path-library/definitions.md` as a human-readable planning reference:

```markdown
| [thematic-name.yaml](thematic-name.yaml) | [Tier] — [Tier Name] | [Count] | [One-line summary of terrain/feel and notable structure] |
```

The summary should mention:
- The dominant terrain/theme
- Any notable structural feature (heavy underground, branching rows, dead-end branch, etc.)

---

## Important Guidelines

**DO:**
- Work step-by-step with user input at each stage
- Reference the existing path files as format examples
- Enforce constraint rules (Cave Mouth alignment, Linked pairs, Routes counts)
- Count locations carefully before assigning a tier
- Use thematic naming that works across campaigns

**DON'T:**
- Auto-generate the full grid without user confirmation of each section
- Include encounter data, NPC details, or session-specific notes in the file
- Use campaign names or session numbers as path names
- Forget to update `definitions.md` after creating the file
- Leave a Cave Mouth surface location without an aligned underground location (or vice versa)

---

## Key Constraint Reference

| Modifier | Rule |
|----------|------|
| **Stable** | Fixed grid position between sessions. Flame-Touched is always Stable. |
| **Cave Mouth** | Surface location that opens underground access. Must share a column with its Underground neighbor. |
| **Underground** | Exists only on the underground grid. Requires Cave Mouth at same column above. |
| **Linked(X)** | Always appears with location X. Place both or neither. |
| **Routes(1)** | Dead-end. Connects to exactly 1 neighbor. |
| **Routes(2)** | Through-passage. Connects to exactly 2 neighbors. |
| **Routes(3/4)** | Junction/crossroads. Connects to 3 or 4 neighbors. |

---

## Session Checklist

**Step 1: Initial Concept**
- [ ] Theme / tone established
- [ ] Starting and ending Flame-Touched anchors confirmed
- [ ] Daggerheart Tier chosen (1–4)
- [ ] Personal Ranking noted (1–10, or ? if unplayed)
- [ ] Surface only or mixed (surface + underground)?

**Step 2: Grid Structure**
- [ ] Number of active surface rows decided (1, 2, or 3)
- [ ] Column span decided
- [ ] Row labels set (A'/A/B or B'/A'/A based on main corridor position)
- [ ] Underground grid needed?

**Step 3: Location Selection**
- [ ] Locations fit the theme
- [ ] Cave Mouth locations identified (if underground needed)
- [ ] Linked pairs checked
- [ ] Routes(N) constraints noted

**Step 4: Grid Population**
- [ ] Every location placed with confirmed cell coordinate
- [ ] Cave Mouth / Underground column alignment verified
- [ ] Routes(N) neighbor counts satisfied

**Step 5: Connection Review**
- [ ] Route from start to end exists
- [ ] Branch rows offer real choices
- [ ] Linked pairs complete
- [ ] Dead ends are intentional

**Step 6: Name & Classify**
- [ ] Total location count verified
- [ ] Daggerheart Tier confirmed (1–4)
- [ ] Personal Ranking assigned or marked as `?`
- [ ] Thematic name chosen (campaign-agnostic)
- [ ] File name formatted as `[thematic-name].yaml`

**Step 7: Compile Path YAML**
- [ ] File created in `path-webapp/data/path-library/`
- [ ] YAML format with rowLabels and gridSurface/gridUnderground
- [ ] Keys with commas and apostrophes are double-quoted
- [ ] No encounter data in the file
- [ ] Only occupied rows included in rowLabels

**Step 8: Auto-Discovery**
- [ ] Auto-discovery handles indexing — no manual update required
- [ ] definitions.md update is optional (human-readable planning reference only)

---

Start by asking the user what kind of path they want to build, then guide them through the process step-by-step!
