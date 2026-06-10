// Off-Path Travel JavaScript
// Handles random location drawing, pool management, and success conditions

let allLocations = {};
let availableLocations = [];
let visitedLocations = [];
let currentLocation = null;
let searchFilter = "";

// Load location data from YAML files in the-path-campaign (source of truth)
async function loadLocations() {
  try {
    const loaded = {};
    for (const { path: folderPath } of LOCATION_FOLDERS) {
      const filenames = await discoverYamlFiles(folderPath);
      for (const filename of filenames) {
        if (filename.includes('template') || filename.includes('mechanics')) continue;
        const id = filename.replace('.yaml', '').replace('-card', '');
        try {
          const response = await fetch(`${folderPath}${filename}`);
          if (response.ok) {
            loaded[id] = jsyaml.load(await response.text());
          }
        } catch (e) {
          console.warn(`Failed to load ${filename}:`, e);
        }
      }
    }

    availableLocations = Object.entries(loaded).map(([id, data]) => ({
      id,
      name: data.name,
      data: {
        ...data,
        // Normalise modifiers to plain strings for CSS class generation
        modifiers: (data.modifiers || []).map(getModifierName),
      },
      isPath: false,
      isStable: (data.modifiers || []).some(m => getModifierName(m) === 'Stable'),
    }));

    // Add Vanishing Mist — a special gameplay card, not a campaign location
    availableLocations.push({
      id: 'vanishing-mist',
      name: 'Vanishing Mist',
      data: {
        tier: 'Special',
        description: 'The mist claims another soul. A character is lost to the void.',
        modifiers: ['Mist-Touched', 'Unstable'],
      },
      isPath: false,
      isStable: false,
    });

    renderAvailableLocations();
    updateCounts();
  } catch (error) {
    console.error('Error loading locations:', error);
    document.getElementById('available-list').innerHTML =
      '<p style="color: var(--danger-red);">Error loading locations. Please refresh the page.</p>';
  }
}

// Render available locations list
function renderAvailableLocations() {
  const list = document.getElementById("available-list");

  if (availableLocations.length === 0) {
    list.innerHTML =
      '<p style="opacity: 0.6; font-style: italic;">No locations remaining</p>';
    document.getElementById("draw-button").disabled = true;
    return;
  }

  // Apply search filter
  const filtered = searchFilter
    ? availableLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchFilter.toLowerCase())
      )
    : availableLocations;

  // Sort: path locations first, stable second, then alphabetically
  const sorted = [...filtered].sort((a, b) => {
    if (a.isPath && !b.isPath) return -1;
    if (!a.isPath && b.isPath) return 1;
    if (a.isStable && !b.isStable) return -1;
    if (!a.isStable && b.isStable) return 1;
    return a.name.localeCompare(b.name);
  });

  if (sorted.length === 0) {
    list.innerHTML =
      '<p style="opacity: 0.6; font-style: italic;">No matching locations</p>';
    return;
  }

  list.innerHTML = sorted
    .map((location) => {
      const pathBadgeClass = location.isPath
        ? "path-badge active"
        : "path-badge";
      const stableBadgeClass = location.isStable
        ? "stable-badge active"
        : "stable-badge";

      let itemClass = "location-item";
      if (location.isPath) itemClass += " path-marked";
      if (location.isStable) itemClass += " stable-marked";

      return `
            <div class="${itemClass}" data-id="${location.id}">
                <div class="name">${location.name}</div>
                <div class="actions">
                    <span class="action-badge visited-badge" onclick="markAsVisited('${location.id}')" title="Mark as Visited">v</span>
                    <span class="action-badge ${pathBadgeClass}" onclick="togglePathMark('${location.id}')" title="Mark as Path Location">p</span>
                    <span class="action-badge ${stableBadgeClass}" onclick="toggleStableMark('${location.id}')" title="Mark as Stable">s</span>
                </div>
            </div>
        `;
    })
    .join("");
}

// Render visited locations list
function renderVisitedLocations() {
  const list = document.getElementById("visited-list");
  const section = document.getElementById("visited-section");

  if (visitedLocations.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  list.innerHTML = visitedLocations
    .map(
      (location) => `
        <div class="location-item" data-id="${location.id}">
            <div class="name" style="color: rgba(255, 255, 255, 0.7);">${location.name}</div>
            <div class="actions">
                <span class="action-badge" style="background: rgba(196, 69, 54, 0.3); border-color: rgba(196, 69, 54, 0.5); color: var(--danger-red);" onclick="moveBackToAvailable('${location.id}', 'visited')" title="Move back to Available">↩</span>
            </div>
        </div>
    `
    )
    .join("");
}

// Update location counts
function updateCounts() {
  const pathCount = availableLocations.filter((loc) => loc.isPath).length;
  const stableCount = availableLocations.filter((loc) => loc.isStable).length;
  document.getElementById("available-count").textContent =
    availableLocations.length;
  document.getElementById("visited-count").textContent =
    visitedLocations.length;
  document.getElementById("path-count").textContent = pathCount;
  document.getElementById("stable-count").textContent = stableCount;
}

// Draw random location
function drawLocation() {
  if (availableLocations.length === 0) {
    return;
  }

  // Random selection
  const randomIndex = Math.floor(Math.random() * availableLocations.length);
  const drawnLocation = availableLocations[randomIndex];

  // Remove from available
  availableLocations.splice(randomIndex, 1);

  // Add to visited
  visitedLocations.push(drawnLocation);

  // Set as current
  currentLocation = drawnLocation;

  // Display location
  displayCurrentLocation(drawnLocation);

  // Update lists
  renderAvailableLocations();
  renderVisitedLocations();
  updateCounts();

  // Show reset button
  document.getElementById("reset-button").style.display = "inline-block";

  if (drawnLocation.id === 'vanishing-mist') {
    setTimeout(() => {
      activateVanishingMist();
    }, 500);
    return; // Exit after showing vanishing mist effect
  }

  // Check if drawn location is marked as path
  if (drawnLocation.isPath) {
    setTimeout(() => {
      activatePathSuccess();
    }, 500);
  }

  // Check for stable modifier (visual feedback)
  if (drawnLocation.isStable) {
    setTimeout(() => {
      activateStableSuccess();
    }, 500);
  }
}

// Display current location details (simplified)
function displayCurrentLocation(location) {
  const container = document.getElementById("current-location");
  container.classList.remove("empty");

  const modifiers = location.data.modifiers || [];
  const modifierTags = modifiers
    .map((mod) => {
      const className = mod.toLowerCase().replace(/\s+/g, "-");
      return `<span class="modifier-tag ${className}">${mod}</span>`;
    })
    .join("");

  container.innerHTML = `
        <a href="location.html?id=${location.id}" target="_blank" class="location-display" style="text-decoration: none; display: block; color: inherit;">
            <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">${location.name}</h2>
            <div class="tier" style="font-size: 0.9rem; margin-bottom: 0.5rem;">${location.data.tier}</div>
            <div class="modifiers" style="margin-bottom: 0.5rem;">${modifierTags}</div>
            <div class="description" style="font-size: 0.95rem; line-height: 1.4;">${location.data.description}</div>
        </a>
    `;
}

// Mark location as visited manually
function markAsVisited(locationId) {
  const index = availableLocations.findIndex((loc) => loc.id === locationId);
  if (index === -1) return;

  const location = availableLocations[index];
  availableLocations.splice(index, 1);
  visitedLocations.push(location);

  renderAvailableLocations();
  renderVisitedLocations();
  updateCounts();
}

// Move location back to available pool from visited
function moveBackToAvailable(locationId, fromList) {
  if (fromList === "visited") {
    const index = visitedLocations.findIndex((loc) => loc.id === locationId);
    if (index === -1) return;
    const location = visitedLocations[index];
    visitedLocations.splice(index, 1);
    availableLocations.push(location);
    renderAvailableLocations();
    renderVisitedLocations();
    updateCounts();
  }
}

// Toggle path mark on location (stays in available pool)
function togglePathMark(locationId) {
  const location = availableLocations.find((loc) => loc.id === locationId);
  if (!location) return;

  // Toggle the path flag
  location.isPath = !location.isPath;

  // Update display
  renderAvailableLocations();
  updateCounts();
}

// Toggle stable mark on location (stays in available pool)
function toggleStableMark(locationId) {
  const location = availableLocations.find((loc) => loc.id === locationId);
  if (!location) return;

  // Toggle the stable flag
  location.isStable = !location.isStable;

  // Update display
  renderAvailableLocations();
  updateCounts();
}

// Activate stable location success state (visual changes, no popup)
function activateStableSuccess() {
  // Change entire page background to blue-green tint
  document.body.classList.add("stable-success");

  // Change button text and style
  const drawButton = document.getElementById("draw-button");
  drawButton.textContent = "Found Stable Location!";
  drawButton.classList.add("stable-success");

  // Change container style
  document
    .querySelector(".draw-button-container")
    .classList.add("stable-success");
  document.querySelector(".draw-column").classList.add("stable-success");

  // Disable further draws
  drawButton.disabled = true;
}

// Activate path found success state (visual changes, no popup)
function activatePathSuccess() {
  // Change entire page background
  document.body.classList.add("path-success");

  // Change button text and style
  const drawButton = document.getElementById("draw-button");
  drawButton.textContent = "Path Found!";
  drawButton.classList.add("path-success");

  // Change container style
  document
    .querySelector(".draw-button-container")
    .classList.add("path-success");
  document.querySelector(".draw-column").classList.add("path-success");

  // Disable further draws
  drawButton.disabled = true;
}

// Activate Vanishing Mist effect (character loss)
function activateVanishingMist() {
  // Dramatic red/dark background shift
  document.body.classList.add("vanishing-mist");

  // Change button to show danger
  const drawButton = document.getElementById("draw-button");
  drawButton.textContent = "Lost in the Mist";
  drawButton.classList.add("vanishing-mist");

  // Change container style
  document
    .querySelector(".draw-button-container")
    .classList.add("vanishing-mist");
  document.querySelector(".draw-column").classList.add("vanishing-mist");

  // Disable further draws
  drawButton.disabled = true;

  // Show warning overlay after a brief delay
  setTimeout(() => {
    document.getElementById("vanishing-mist-overlay").classList.add("active");
  }, 800);
}

// Clear success states
function clearPathSuccess() {
  document.getElementById("path-success").classList.remove("active");

  // Remove page background effect
  document.body.classList.remove("path-success");

  const drawButton = document.getElementById("draw-button");
  drawButton.textContent = "Draw Location";
  drawButton.classList.remove("path-success");
  drawButton.disabled = false;

  document
    .querySelector(".draw-button-container")
    .classList.remove("path-success");
  document.querySelector(".draw-column").classList.remove("path-success");
}

function clearVanishingMist() {
  document.getElementById("vanishing-mist-overlay").classList.remove("active");
  // Note: We don't clear the visual state - player must reset journey after character loss
}

// Reset journey
function resetJourney() {
  availableLocations = [];
  visitedLocations = [];
  currentLocation = null;

  const container = document.getElementById("current-location");
  container.classList.add("empty");
  container.innerHTML =
    "<p>No location drawn yet. Press the button above to begin your journey through the mist.</p>";

  document.getElementById("reset-button").style.display = "none";

  // Clear all success states
  document.body.classList.remove(
    "path-success",
    "stable-success",
    "vanishing-mist"
  );
  const drawButton = document.getElementById("draw-button");
  drawButton.textContent = "Draw Location";
  drawButton.classList.remove(
    "path-success",
    "stable-success",
    "vanishing-mist"
  );
  drawButton.disabled = false;

  document
    .querySelector(".draw-button-container")
    .classList.remove("path-success", "stable-success", "vanishing-mist");
  document
    .querySelector(".draw-column")
    .classList.remove("path-success", "stable-success", "vanishing-mist");

  // Reload locations
  loadLocations();
}

// Toggle visited section
function toggleVisitedSection() {
  const section = document.getElementById("visited-section");
  section.classList.toggle("collapsed");
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadLocations();

  document
    .getElementById("draw-button")
    .addEventListener("click", drawLocation);
  document
    .getElementById("reset-button")
    .addEventListener("click", resetJourney);

  // Search filter
  document
    .getElementById("location-search")
    .addEventListener("input", function (e) {
      searchFilter = e.target.value;
      renderAvailableLocations();
    });

  // Make section headers clickable for collapsing
  document
    .querySelector("#available-section h3")
    .addEventListener("click", function () {
      document
        .getElementById("available-section")
        .classList.toggle("collapsed");
    });

  document
    .querySelector("#visited-section h3")
    .addEventListener("click", toggleVisitedSection);
});
