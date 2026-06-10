# Path Grid System Documentation

A data-driven system for creating dynamic path grids for Daggerheart sessions.

## Overview

The Path Grid System allows you to define session paths using JSON data that is automatically rendered into interactive 2D grids or linear paths. This makes it easy to create new sessions without touching HTML/CSS.

## Quick Start

### 1. Define Your Session in JSON

Edit `data/sessions.json` to add a new session:

```json
"session3": {
  "title": "Session 3 - Your Title",
  "type": "grid",
  "description": "Description of how the grid works",
  "gridSize": {
    "rows": 2,
    "cols": 6
  },
  "grid": [
    {
      "row": "A",
      "col": 1,
      "position": "A1",
      "type": "hub",
      "locationId": "village",
      "name": "Village in the Mist"
    },
    // ... more cells
  ]
}
```

### 2. Create an HTML Page

Create `session3.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>The Path - Session 3</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>The Path - Session 3</h1>
            <nav>
                <a href="index.html">← Home</a>
                <a href="locations.html">📍 All Locations</a>
                <a href="village.html">🏘️ Village</a>
            </nav>
        </header>

        <main>
            <section id="grid-container"></section>
            <section id="encounters-container"></section>
        </main>
    </div>

    <script src="js/grid-renderer.js"></script>
    <script>
        // Load and render the session
        loadSession('session3', 'grid-container', 'encounters-container');
    </script>
</body>
</html>
```

That's it! The grid will render automatically.

## JSON Schema

### Session Types

#### Grid Session
```json
{
  "title": "Session Title",
  "type": "grid",
  "description": "Movement description",
  "gridSize": {
    "rows": 2,
    "cols": 6
  },
  "grid": [ /* grid cells */ ],
  "underground": { /* optional underground grid */ },
  "encounters": [ /* optional encounters */ ]
}
```

#### Linear Session
```json
{
  "title": "Session Title",
  "type": "linear",
  "description": "Path description",
  "outbound": {
    "description": "Outbound Journey",
    "path": [ /* locations */ ]
  },
  "return": {
    "description": "Return Journey",
    "path": [ /* locations */ ]
  },
  "encounters": [ /* optional encounters */ ]
}
```

### Grid Cell Types

#### Empty Cell
```json
{
  "row": "A",
  "col": 2,
  "position": "A2",
  "type": "empty"
}
```

#### Hub Cell (Village)
```json
{
  "row": "A",
  "col": 1,
  "position": "A1",
  "type": "hub",
  "locationId": "village",
  "name": "Village in the Mist"
}
```

#### Standard Location
```json
{
  "row": "B",
  "col": 2,
  "position": "B2",
  "type": "location",
  "locationId": "stone-works",
  "name": "Stone Works",
  "modifiers": ["Cave Mouth"]
}
```

#### Encounter Location
```json
{
  "row": "B",
  "col": 3,
  "position": "B3",
  "type": "encounter",
  "locationId": "trading-grounds",
  "name": "Trading Grounds",
  "encounter": "⚔️ Drift & the Lost",
  "modifiers": ["Cave Mouth"]
}
```

### Underground Grid

```json
"underground": {
  "enabled": true,
  "type": "grid",
  "gridSize": {
    "rows": 1,
    "cols": 5
  },
  "grid": [
    {
      "row": "U",
      "col": 2,
      "position": "U2",
      "type": "location",
      "locationId": "mining-complex",
      "name": "Mining Complex",
      "accessFrom": ["B2", "B3"]
    }
  ],
  "description": "Underground network accessible via Cave Mouth locations"
}
```

### Encounters

```json
"encounters": [
  {
    "position": "B3",
    "location": "Ancient Crossing",
    "title": "Mist-Touched",
    "adversaries": [
      "1x Mist Wraith Leader",
      "3x Mist Stalker"
    ],
    "notes": "Bridge counter at 5. Mist creatures drawn to instability."
  }
]
```

## Cell Types & Styling

| Type | Border Color | Background | Usage |
|------|--------------|------------|-------|
| `empty` | Dashed Blue | Transparent | Unoccupied grid positions |
| `hub` | Amber | Amber tint | Village/starting location |
| `location` | Green | Green tint | Standard explorable location |
| `encounter` | Red | Red tint | Location with combat/NPC encounter |
| `underground` | Purple | Purple tint | Underground network locations |

## Modifiers

Add special properties to locations:

- **`"Cave Mouth"`** - Shows ⛏️ icon, indicates underground access
- **Custom modifiers** - Add any string to display additional info

## Grid Positioning

### Surface Grid
- **Rows**: Use letters (A, B, C...)
- **Columns**: Use numbers (1, 2, 3...)
- **Positions**: Combine row+col (A1, B3, etc.)

### Underground Grid
- **Row**: Use "U" for underground
- **Columns**: Use numbers (1, 2, 3...)
- **Positions**: U1, U2, U3, etc.

## Movement Rules

Players can move:
- **Horizontally** (→) between adjacent columns
- **Vertically** (↕) between rows at the same column
- **Diagonally** (↗↘) combining both

Connection lines are automatically drawn between adjacent cells.

## Tips & Best Practices

### Grid Layout
1. **Start column** - Always place Village at column 1 (A1/B1)
2. **End columns** - Place objectives/destinations at far right
3. **Empty cells** - Use strategically to create path choices
4. **Balance rows** - Distribute interesting locations across both rows

### Underground Design
1. **Access points** - Mark surface locations with "Cave Mouth" modifier
2. **Alignment** - Align underground grid columns with surface access points
3. **Linear underground** - Use single row (U) for underground networks

### Encounters
1. **Position tracking** - Use grid positions (B3, A6) for reference
2. **Encounter types** - Use `"type": "npc"` for non-combat encounters
3. **Notes** - Include mechanical details (counters, special conditions)

## File Structure

```
path-webapp/
├── data/
│   └── sessions.json          # All session definitions
├── js/
│   └── grid-renderer.js       # Grid rendering engine
├── css/
│   └── styles.css             # Grid styling
└── sessionX.html              # Individual session pages
```

## Extending the System

### Adding New Cell Types

1. **Define in JSON**: Add new `"type"` value
2. **Style in CSS**: Add `.grid-location.your-type` styles
3. **Handle in JS**: Update `createGridCell()` if special behavior needed

### Custom Grid Sizes

Simply change `gridSize`:
```json
"gridSize": {
  "rows": 3,      // Add more rows
  "cols": 8       // Add more columns
}
```

CSS will automatically adapt (uses CSS Grid's `repeat()`).

### Multiple Underground Layers

Create multiple underground sections:
```json
"underground1": { /* first layer */ },
"underground2": { /* deeper layer */ }
```

Update HTML to render both with separate containers.

## Examples

See:
- **Session 1** (`session1.json`) - Linear path with outbound/return
- **Session 2** (`session2.json`) - 2x6 grid with underground network

## Troubleshooting

**Grid not rendering?**
- Check console for errors (F12)
- Verify JSON syntax is valid
- Ensure `loadSession()` is called with correct session ID

**Cells misaligned?**
- Verify all cells have unique row/col combinations
- Check that gridSize matches actual cell count
- Ensure cells are sorted properly (row then column)

**Underground not showing?**
- Set `"enabled": true` in underground object
- Define either `"type": "grid"` or provide `"path"` array
- Check that surface locations have "Cave Mouth" modifier

---

For more examples and the latest features, see the existing sessions in `data/sessions.json`.
