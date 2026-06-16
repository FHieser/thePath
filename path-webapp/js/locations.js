// All Locations Overview Page
let allLocations = {};
// Tri-state filter map: modifier name -> 'include' | 'exclude' | undefined (neutral)
let modifierFilters = {};
let knownModifiers = []; // Populated from loaded location data
let modifierDescriptions = {};

// Helper function to check if a location has a specific modifier
// Handles both object {name: "..."} and string formats
function hasModifier(location, modifierName) {
    if (!location.modifiers || !Array.isArray(location.modifiers)) return false;
    return location.modifiers.some(mod => {
        const name = typeof mod === 'object' ? mod.name : mod;
        return name.toLowerCase() === modifierName.toLowerCase();
    });
}

// Load locations data from YAML files
async function loadLocations() {
    try {
        modifierDescriptions = await loadModifierDescriptions();

        allLocations = {};
        for (const { path: folderPath, type: folderType } of LOCATION_FOLDERS) {
            const filenames = await discoverYamlFiles(folderPath);
            for (const filename of filenames) {
                if (filename.includes('template') || filename.includes('mechanics')) continue;
                const id = filename.replace('.yaml', '').replace('-card', '');
                try {
                    const response = await fetch(`${folderPath}${filename}`);
                    if (response.ok) {
                        const data = jsyaml.load(await response.text());
                        data._folderType = folderType;
                        allLocations[id] = data;
                    }
                } catch (error) {
                    console.warn(`Failed to load ${filename}:`, error);
                }
            }
        }

        collectModifiers();
        renderFilterTags();
        renderLocations();
    } catch (error) {
        console.error('Error loading locations:', error);
        document.getElementById('locations-container').innerHTML = '<p class="error">Error loading locations data.</p>';
    }
}

// Render locations based on current filter
function renderLocations() {
    const container = document.getElementById('locations-container');
    const filteredLocations = filterLocations();

    if (filteredLocations.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 2rem; opacity: 0.7;">No locations match the current filter.</p>';
        return;
    }

    // Group locations by folder type / modifier
    const starfallLocations = filteredLocations.filter(([id, loc]) => loc._folderType === 'starfall-city');
    const surfaceLocations = filteredLocations.filter(([id, loc]) => loc._folderType !== 'starfall-city' && !hasModifier(loc, 'Underground'));
    const undergroundLocations = filteredLocations.filter(([id, loc]) => loc._folderType !== 'starfall-city' && hasModifier(loc, 'Underground'));

    let html = '';

    if (surfaceLocations.length > 0) {
        html += '<div class="section-divider"><h2>Surface Locations</h2></div>';
        html += '<div class="locations-grid">';
        surfaceLocations.forEach(([id, location]) => {
            html += createLocationCard(id, location);
        });
        html += '</div>';
    }

    if (undergroundLocations.length > 0) {
        html += '<div class="section-divider"><h2>Underground Locations</h2></div>';
        html += '<div class="locations-grid">';
        undergroundLocations.forEach(([id, location]) => {
            html += createLocationCard(id, location);
        });
        html += '</div>';
    }

    if (starfallLocations.length > 0) {
        html += '<div class="section-divider"><h2>Starfall City</h2></div>';
        html += '<div class="locations-grid">';
        starfallLocations.forEach(([id, location]) => {
            html += createLocationCard(id, location);
        });
        html += '</div>';
    }

    container.innerHTML = html;
}

// Collect all unique modifier names from loaded locations
function collectModifiers() {
    const modSet = new Set();
    Object.values(allLocations).forEach(loc => {
        if (loc.modifiers && Array.isArray(loc.modifiers)) {
            loc.modifiers.forEach(mod => {
                modSet.add(getModifierName(mod));
            });
        }
    });
    knownModifiers = Array.from(modSet).sort();
}

// Filter locations based on modifier tri-state toggles
function filterLocations() {
    const entries = Object.entries(allLocations);
    const activeFilters = Object.entries(modifierFilters).filter(([, state]) => state);

    if (activeFilters.length === 0) {
        return entries;
    }

    return entries.filter(([id, location]) => {
        return activeFilters.every(([mod, state]) => {
            const has = hasModifier(location, mod);
            return state === 'include' ? has : !has;
        });
    });
}

// Create location card HTML
function createLocationCard(id, location) {
    const modifierTags = (location.modifiers || []).map(mod => {
        const modName = getModifierName(mod);
        const cssClass = modName.toLowerCase().replace(/\s+/g, '-');
        const modData = modifierDescriptions[modName.toLowerCase()];
        const tooltip = modData ? modData.description.trim() : '';
        return `<span class="modifier-tag modifier-tooltip ${cssClass}" data-tooltip="${escapeHtml(tooltip)}">${modName}</span>`;
    }).join('');

    const featureCount = location.features ? location.features.length : 0;
    const tierString = String(location.tier);
    const tierType = tierString.includes(' ') ? tierString.split(' ').slice(2).join(' ') : location.category || 'Exploration';

    return `
        <a href="location.html?id=${id}" class="location-overview-card">
            <h3>${location.name}</h3>
            <div class="location-tier">${location.tier}</div>
            <div class="location-overview-desc">${location.description}</div>
            <div class="location-modifiers">${modifierTags}</div>
            <div class="location-stats">
                <span>Difficulty ${location.difficulty}</span>
                <span>${featureCount} Features</span>
            </div>
        </a>
    `;
}

// Render the modifier filter tags into the filter bar
function renderFilterTags() {
    const container = document.getElementById('filter-tags');
    container.innerHTML = '';
    knownModifiers.forEach(mod => {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = mod;
        tag.dataset.modifier = mod;

        // Apply current state
        const state = modifierFilters[mod];
        if (state) tag.classList.add(state);

        tag.addEventListener('click', () => {
            // Cycle: neutral -> include -> exclude -> neutral
            const current = modifierFilters[mod];
            if (!current) {
                modifierFilters[mod] = 'include';
            } else if (current === 'include') {
                modifierFilters[mod] = 'exclude';
            } else {
                delete modifierFilters[mod];
            }
            renderFilterTags();
            renderLocations();
        });

        container.appendChild(tag);
    });
}

// Set up filter controls (called once on init, tags rendered after data loads)
function setupFilters() {
    // Nothing to wire up statically — tags are rendered after data loads
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLocations();
    setupFilters();
});
