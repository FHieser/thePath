# The Starfall City — Mechanics

*The capital of the Starfall Kingdom is unlike any other location on The Path. The rules that keep players alive elsewhere will kill them here. The mist that corrupts everywhere else is the only thing holding the city together.*

---

## The City Grid

The city is a 3x3 grid of nine districts. Players enter from the city gates at the bottom and push inward toward the Lord's Castle — sealed at the top, beyond the grid.

```
                   [Lord's Castle] ← sealed, beyond the grid
                         ↑
INNER ──────────────────────────────────────────────────────
  1,1 [Council Hall]        1,2 [Scaffold Square]     1,3 [University/Burning Fields]

CIVIC ──────────────────────────────────────────────────────
  2,1 [Craftsmen's Ward]    2,2 [Riot Market]         2,3 [Sanctuary Keep + Hospital]

OUTER ──────────────────────────────────────────────────────
  3,1 [Mechanic's Workshop] 3,2 [Old Gate]            3,3 [Sealed District]

                         ↑
                    [City Gates]
```

**Row 1 — Inner:** Power, judgment, knowledge. Where decisions were made that destroyed everything.
**Row 2 — Civic:** Labor, trade, faith. Where ordinary people lived and died.
**Row 3 — Outer:** Entry, transition, containment. Where the city met the world — and sealed itself off from it.

---

## The Wake System

Each district tracks its own **Wake level** — how disturbed the crystallized dead are. Wake is per district, not city-wide.

| Wake | State | Description |
|---|---|---|
| **Wake 0** | Dormant | Crystallized dead sleep. Mist holds. Safe to move through. |
| **Wake 1** | Stirring | A few wake nearby. Avoidable — but combat escalates. |
| **Wake 2** | District Active | All dead in the district animate. The whole district is hostile. |
| **Wake 3** | The Warden | A massive accumulated crystal entity has arrived. |

### Escalation

**Wake 0 → Wake 1** is triggered by:
- **Sacred Flame brought into the district** — immediately Wake 1, then subsequent disturbances escalate at double speed
- **Harvesting crystals from a corpse** — +3 to counter
- **Physical disturbance** (moving bodies, violent interaction) — +1 to counter *(GM discretion)*
- **GM spends 1 Fear** — +1 to counter (wall collapse, loud noise, ground tremor)

**Wake 1 → Wake 2:** Combat at Wake 1. All dead in the district activate simultaneously.

**Wake 2 → Wake 3:** Combat at Wake 2. The Warden arrives.

### Reversibility

```
Wake 0 ←→ Wake 1 → Wake 2 → Wake 3
                              ↓ Warden leaves
                             Wake 2 (stays here)
```

- **Wake 1 → Wake 0:** Possible. Mist application, special items, or GM-approved pacification.
- **Wake 2:** Permanent for this Path configuration. Cannot go lower.
- **Wake 3:** The Warden is present. When it leaves or is driven off, the district returns to Wake 2.
- **Path reset:** When the Path changes between sessions, all districts reset to Wake 0.

### Special Pacification

Certain tools, rituals, or player actions may reduce Wake levels at GM discretion. Examples:
- Spending Mist tokens as a ritual offering to reinforce dormancy
- Special items found within the city
- Completing a character story thread (GM's call — narrative resolution suppressing a district)

---

## The Warden

*A mass of crystallized dead, fused together into something that should not move. Dozens of bodies compressed into one terrible entity, still glowing, still cracking, still coming.*

- **Arrives** when a district reaches Wake 3
- **Crosses district lines** in pursuit of players — it is not contained by boundaries
- **Lingers** — if players flee and the Warden loses them, it remains in the last district it occupied, permanently raising that district's Wake floor
- A district the Warden has claimed never returns below Wake 2 while the Warden is present
- **Path reset** sends the Warden back to dormancy with everything else
- **Origin:** The Security Chief — transformed when he fell from the Council Hall tower (1,1). The Warden first emerges at the base of that tower.

The Warden is not a boss to be defeated in a single encounter. It is a consequence that follows. Players who complete the Security Chief's thread understand what they are truly fighting.

---

## The Mechanic's Robots

When players enter a district, roll a **d10**. On an **8, 9, or 10** — a robot is present. Roll a **d6** to determine which type.

| D6 | Robot | Description | Mechanic |
|---|---|---|---|
| **1** | **Broken** | Slumped against a wall or dragging a malfunctioning limb. Still trying. | Can be carried to the Workshop (3,1) and repaired. Returns as a random functional type — reroll d6, reroll 1s. |
| **2** | **The Tracker** | Moves with quiet purpose, always facing one direction. | Walks toward the Warden's current district. If the Warden is in this district — stops and rotates slowly in place. Follow it to find the Warden. Watch it to avoid one. |
| **3** | **The Carrier** | Wide flat chassis, built to haul. Moves slowly but never stops. | Players can load it with items. Carries them safely back to the Workshop. Can be redirected to any district instead. Cannot carry living creatures. |
| **4** | **The Medic** | Gentle movements. Reaches toward the injured out of old habit. | Once per encounter: remove 1 Stress OR restore 1 HP from one player. Not both. |
| **5** | **The Cleaner** | Moves bodies with careful, practiced hands. Has been doing this for decades. | Cosmetic only. Follow it — it leads to the Sanctuary Keep (2,3) and the pile of dead it has been building since the city fell. |
| **6** | **The Builder** | Carries tools. Assesses structures with slow mechanical attention. | Players can direct it once: seal a doorway, reinforce a barricade, or collapse a passage. The change persists for this Path configuration. |

*All robots are neutral. They do not attack. They do not engage in combat. They do not trigger the Wake counter.*

*Robots avoid Wake 2+ districts when possible. A robot changing course mid-route is an early warning.*

---

## Crystal Wind Chimes

The plague crystal absorbs everything — flesh, air, memory. Significant moments leave impressions that condense over decades into crystal wind chimes, growing naturally in doorways and passages.

- **GM triggers** a chime when players should learn something — a tone drifts through the district
- Players find the source and **touch it** to play the memory
- Chimes are not fragile. Can be returned to and replayed.
- Not tied to specific characters — any emotionally significant moment can leave one

*The primary way players learn the stories of the city.*

---

## TODO

- [ ] The inverted flame/mist rules — how Sacred Flame awakens vs. mist protects, player implications
- [ ] The Brass Bird — investigation thread, how players follow it through the city
- [ ] The Merchant's Trail — treasure hunt chain across districts
- [ ] City-wide tone and emotional notes
- [ ] Character story assignments to specific districts *(see starfall-city-characters.md)*
- [ ] Individual district mechanics — developed per location
