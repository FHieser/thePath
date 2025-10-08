# Path Network Mechanics

## Core Path System

The Path network forms the backbone of campaign exploration, providing structured yet dynamic connections between locations in the mist-shrouded world. @todo rework this to fit to the developed path locations

---

## **Path Structure**

### **Location Types**
- **Hub Locations**: Safe havens with Sacred Flames (Villages, Temples, Fortresses)
- **Traversal Segments**: Path connections between major locations (Bridges, Trails, Tunnels)
- **Destination Locations**: Points of interest at Path endpoints (Ruins, Resources, Mysteries)
- **Junction Points**: Crossroads where multiple Paths intersect

### **Connection Stability**
Locations exist in one of two states:
- **Stable**: Location maintains its relative grid position and connections
- **Unstable**: Location disappears into the Mist between sessions

The Path network uses a **Grid System** where stable locations maintain consistent relative positioning to each other, while unstable locations disappear into the Mist between sessions and may reappear randomly.

### **Location Modifiers**
All locations use a modifier system to define their mechanical properties:

**Universal Modifiers** (every location has one):
- **Stable**: Cannot disappear, maintains grid position (Sacred Flame locations, player-stabilized sites)
- **Unstable**: May disappear between sessions, repositions randomly (most locations by default)

**Optional Modifiers** (add specific functionality):
- **Underground**: Connects only to other Underground locations or Cave Mouth surface locations
- **Cave Mouth**: Provides access between surface and Underground networks
- **Inhabited**: Always contains NPCs - travelers, refugees, or residents
- **Wild Beasts**: Always contains dangerous creature encounters
- **Mist-Touched**: Corrupted by mist exposure (adds distortions, Mist Walkers). **GM can spend 3 Fear to make a location Mist-Touched.**
- **Water Feature**: Includes flowing water elements (streams, pools, springs)

---

## **Path Generation System**

### **Creating New Path Configurations**

#### **Step 1: Choose Starting Hub**
- Village in the Mist (default starting point)
- Other established sanctuaries
- Player-discovered safe havens

#### **Step 2: Determine Path Length**
- **Short Path**: Quick exploration for single session goals
- **Medium Path**: Multi-session journey with multiple objectives
- **Long Path**: Extended campaign arc exploration
- **TODO**: Determine optimal location counts for each length through playtest sessions

#### **Step 3: Select Location Types**
Roll or choose locations based on campaign needs:
- 1 Hub Location (destination or midpoint)
- 1-2 Traversal Segments per connection
- 2-4 Destination Locations
- 0-1 Junction Points (for complex paths)

#### **Step 4: Determine Initial Stability**
- **New Locations**: Start as Unstable unless stabilized by players
- **Village in the Mist**: Always Stable (maintained by Sacred Flame)
- **Player-Stabilized**: Locations can be made Stable through Flame Essence rituals
- **Ancient Sites**: Some locations may have inherent stability

---

## **Path Configuration System**

### **Tarot Card Path Generation**
The Path network uses a tarot-based system for location placement:

#### **Deck Preparation**
- **GM-Curated Deck**: GM selects cards representing prepared locations
- **Location Cards**: Each card represents a specific location the GM has designed
- **Deck Size**: Based on number of locations GM has prepared and reviewed

#### **Path Configuration Process**
1. **Grid Setup**: GM creates path template with empty grid spaces
2. **Start Position**: Always the location where players currently are
3. **Destination**: Set by GM based on story needs or player goals
4. **Card Drawing**: Players draw cards to fill intermediate grid spaces
5. **Player Placement**: Players decide how to arrange drawn location cards in available spaces

#### **Path Reader Role**
- **In-Game Position**: Designated player or NPC role for managing path generation
- **Card Drawing**: Path Reader draws cards from the deck
- **Placement Decisions**: Path Reader (with group input) arranges locations on grid
- **Narrative Integration**: Path Reader describes how locations connect

#### **Future Expansion**
- **TODO**: Design mechanics for players to influence path generation beyond card placement
- **TODO**: Consider ways paths might change mid-journey
- **TODO**: Develop advanced Path Reader abilities or progression

### **Location Stabilization**
Players can stabilize locations using **Sacred Flame Resources**:
- **Flame Essence**: Rare resource tied to ancient fires
- **Stabilization Ritual**: Process to anchor a location in the grid
- **Maintenance Cost**: Stabilized locations require ongoing Flame Essence
- **Strategic Choices**: Players must decide which locations to stabilize

### **Village Sanctuary Maintenance**
**Village in the Mist requires regular maintenance to remain safe:**

#### **Sacred Flame Upkeep**
- Village flame consumes Flame Essence over time
- **TODO**: Determine consumption rate and consequences of failure
- Players must venture into Mist to gather Flame Essence
- Failure results in village becoming unstable or dangerous

#### **Venture Motivations**
Players have multiple reasons to explore the Mist:
- **Resource Gathering**: Flame Essence and other necessities
- **Information**: News of other survivors and locations
- **Rescue Missions**: Helping stranded travelers
- **Mysteries**: Uncovering the source of the Mist
- **Trade**: Connecting with other stable communities

---

## **Path Navigation**

### **Walkway System**
Locations connect via physical walkways:
- **Direct Routes**: Clear paths between connected locations
- **No Navigation Rolls**: If locations are connected, travel is straightforward
- **Location-Based Challenges**: Navigation difficulties stem from individual location mechanics

### **Location-Specific Navigation**
Each location may have its own movement mechanics:
- **Environmental Hazards**: Weather, terrain, or magical effects
- **Puzzle Elements**: Riddles or challenges within locations
- **Resource Requirements**: Some locations require specific items or preparation
- **Social Navigation**: Negotiating with inhabitants or guardians

---

## **Location Memory System**

### **Visit Tracking**
Each location maintains:
- **Visit Count**: How many times the party has been there
- **Time Since Last Visit**: Affects how much locations change
- **Significant Events**: Major player actions and their outcomes
- **Relationship Status**: How NPCs and factions view the party

### **Evolution Mechanics**

#### **First Visit**
- Location appears as initially designed
- NPCs react based on reputation or first impressions
- Standard encounters and challenges
- Baseline relationships established

#### **Return Visits**
Locations change based on:
- **Previous Outcomes**: Success/failure affects NPC attitudes
- **Time Passage**: Natural evolution and world events
- **Player Actions**: Direct consequences of past choices
- **External Events**: Faction movements, natural disasters, etc.

#### **Long-term Evolution**
Over multiple visits:
- **Relationship Building**: NPCs become allies, rivals, or neutrals
- **Infrastructure Changes**: Player actions may improve or damage locations
- **Environmental Changes**: Locations show signs of previous visits
- **Narrative Integration**: Locations become part of ongoing story

---

## **Mist Interaction Rules**

### **Mist Tokens**

The otherworldly mist that shrouds The Path corrupts and consumes those exposed to its influence. Characters accumulate **Mist tokens** through various means during their travels, and the corruption worsens with each token gained.

#### **Gaining Mist Tokens**

Characters may gain Mist tokens from:
- **Mist-Touched locations**: Spending extended time in corrupted areas
- **Adversary abilities**: Certain mist creatures can inflict Mist tokens

#### **Mist Token Corruption Effects**

**Mist tokens (Condition):** When you gain a Mist token, immediately suffer consequences based on your total number of tokens:

- **1-3 Tokens**: Choose one: Lose 1 Hope OR mark a Stress
- **4-5 Tokens**: Choose one: GM gains 1 Fear OR lose 1 HP
- **6-7 Tokens**: Suffer both effects from the previous tier (choose one from each: Hope/Stress AND Fear/HP)
- **8+ Tokens**: Your character is consumed by the mist and lost. Create a new character.

**Clearing Mist Tokens:**
- **Resting at Sacred Flame**: PCs that rest at a location with a Sacred Flame lose all Mist tokens 

#### **Mist-Touched Locations**

Locations can become corrupted by prolonged mist exposure, marked with the **Mist-Touched** modifier:

**Creating Mist-Touched Areas:**
- **GM spends 3 Fear** to make a location or area Mist-Touched for the rest of the path
- **GM spends 2 Fear at the start of the path** to make a location or area Mist-Touched for the rest of the path
- Certain adversary abilities can create temporary Mist-Touched zones
- Locations may start as Mist-Touched due to story circumstances
- All locations that are not on the path are mist-touched @todo increase detail

**Effects of Mist-Touched Areas:**
- Thick supernatural fog reduces visibility
- @todo will encounter mist touched if on the path

---

## **Advanced Path Features**

### **Junction Points**
Crossroads where multiple paths meet:
- **Path Selection**: Choose from 3+ different destinations
- **Information Hub**: NPCs share news from connected locations
- **Supply Station**: Limited resources and services available
- **Encounter Variety**: Higher chance of meeting other travelers

### **Conditional Paths**
Connections that require specific conditions:
- **Seasonal Paths**: Only open during certain times of year
- **Faction Gates**: Require good standing with controlling group
- **Puzzle Locks**: Need specific knowledge or items to access
- **Heroic Paths**: Open only after completing certain achievements

### **Path Networks**
Large-scale connections between regions:
- **Regional Hubs**: Major sanctuaries connecting multiple path systems
- **Trade Routes**: Paths maintained by merchant organizations
- **Pilgrimage Paths**: Religious routes between sacred sites
- **Emergency Networks**: Hidden paths for evacuation or escape

---

## **GM Tools for Path Management**

### **Deck Preparation Worksheet**
For each campaign phase:
- **Location Inventory**: List of all prepared locations ready for play
- **Card Assignment**: Which tarot/location cards represent each prepared location
- **Stability Status**: Track which locations are Stable vs Unstable
- **Flame Essence Costs**: Stabilization requirements for each location
- **Narrative Hooks**: Key story elements each location provides

### **Session Setup Checklist**
Before each session:
- [ ] Determine starting location (where players ended last session)
- [ ] Choose destination based on story needs or player goals
- [ ] Create grid template with appropriate number of intermediate spaces
- [ ] Prepare location deck (remove cards for unavailable locations)
- [ ] Update location states based on previous session outcomes
- [ ] Check Village Flame Essence levels and maintenance needs

### **Path Reader Support Tools**
- **Grid Templates**: Pre-made path layouts for different journey lengths
- **Card Interpretation Guide**: How to narratively connect drawn locations
- **Placement Suggestions**: Guidelines for optimal location arrangement
- **Backup Plans**: Alternative connections if player placement creates challenges

### **Location Management**
- **Stability Tracking**: Record which locations players have stabilized
- **Flame Essence Economy**: Track resource gathering and consumption
- **Location Evolution**: How each location changes based on player visits
- **Narrative Continuity**: Maintaining story threads across random configurations

---

## **Location Design Guidelines**

### **Creating New Path Locations**

#### **Step 1: Core Concept**
Define your location's central theme and purpose:
- **Environmental Theme**: What does this place look like and feel like?
- **Narrative Purpose**: What role does it serve in the campaign?
- **Mechanical Challenge**: What obstacles or opportunities does it present?
- **Tier Level**: Tier 1 (level 1) for current Path system

#### **Step 2: Choose Modifiers**
Every location needs modifiers that define its mechanical properties:

**Required - Stability State:**
- Choose **Stable** only for Sacred Flame sites or special anchored locations
- Choose **Unstable** for most locations (default state)

**Optional - Functional Modifiers:**
- **Underground**: If it's a cave, tunnel system, or subterranean space
- **Cave Mouth**: If it provides access to underground areas
- **Inhabited**: If NPCs are always present
- **Wild Beasts**: If dangerous creatures always inhabit the area
- **Mist-Touched**: If corrupted by prolonged mist exposure
- **Water Feature**: If water elements are central to the location

#### **Step 3: Design 3-4 Features**
Each location needs 3-4 distinct features following Daggerheart standards:

**Feature Types:**
- **Passive**: Always-available benefits or information gathering
- **Action**: GM spends Fear to trigger during scenes
- **Reaction**: Triggered by specific player actions or circumstances
- **Counter System**: Progressive mechanics that track ongoing challenges

**Feature Design Principles:**
- Each feature should support the location's theme
- Include both mechanical effects and narrative prompts
- Provide clear success/failure outcomes
- Include GM questions to spark improvisation

#### **Step 4: Integration Requirements**

**Modifier Integration:**
- Reference modifiers using standardized language (see STYLE-GUIDE.md)
- Ensure features support the chosen modifiers mechanically
- Underground locations should mention connection rules
- Cave Mouth locations need clear underground access features

**Campaign Theme Integration:**
- Maintain mist-world atmosphere and themes
- Consider how Sacred Flames or anti-mist defenses might factor in
- Include elements that support Path network storytelling
- Ensure content supports level 1 characters (Tier 1)

### **Location Template Structure**

```markdown
# [LOCATION NAME]

***Tier 1 [Type]***
*[One-sentence evocative description]*
**Impulses:** [3 thematic impulses that guide GM decisions]

> **Difficulty:** 11
> **Modifiers:** [Universal], [Optional], [Optional]
> **Potential Adversaries:** [3 appropriate threats for the location]

## FEATURES

***[Feature Name] - [Type]:*** [Mechanical description with clear triggers and outcomes]

  *[2-3 GM questions that prompt improvisation and discovery]*

[Repeat for 3-4 features total]

## FEATURE QUESTIONS

- [4 broad questions about the location's history and mysteries]
- [Questions should inspire long-term campaign development]
```

### **Design Best Practices**

**Mechanical Balance:**
- Counter systems should have clear endpoints (3-4 steps typical)
- Damage should follow Daggerheart scaling (1d6+1 to 1d8+3 for Tier 1)
- Include both Hope and Fear outcomes where appropriate
- Provide meaningful player choice in feature interactions

**Narrative Integration:**
- Features should tell a story about the location
- Include elements that change based on player actions
- Provide hooks that connect to broader campaign themes
- Leave room for GM interpretation and expansion

**Modifier Synergy:**
- **Underground** + **Wild Beasts**: Deep predators, cave-dwelling threats
- **Cave Mouth** + **Inhabited**: Underground refugees, tunnel guides
- **Stable** + **Inhabited**: Permanent communities, established NPCs
- **Unstable** + **Mist-Touched**: Locations consumed by supernatural forces

### **Testing Your Location**
Before adding to the campaign:
- [ ] Verify all modifiers are properly integrated
- [ ] Ensure 3-4 complete features with clear mechanics
- [ ] Check that Tier 1 scaling is appropriate (level 1)
- [ ] Confirm location supports campaign themes
- [ ] Review formatting against STYLE-GUIDE.md standards

---

*The Path network provides structure for exploration while allowing dynamic storytelling through its memory and reconfiguration systems.*