// Starfall City — district grid + mechanics reference

const STARFALL_FOLDER = '../the-path-campaign/locations/path-locations/starfall-city/';
const MECHANICS_URL = '../the-path-campaign/mechanics/starfall-city-mechanics.yaml';

const ROW_LABELS = { 1: 'Inner', 2: 'Civic', 3: 'Outer' };

async function init() {
    await Promise.all([loadGrid(), loadMechanics()]);
}

// ── Grid ─────────────────────────────────────────────────────────────────────

async function loadGrid() {
    const container = document.getElementById('city-grid');
    try {
        const filenames = await discoverYamlFiles(STARFALL_FOLDER);
        const locations = {};

        await Promise.all(filenames.map(async filename => {
            const id = filename.replace('.yaml', '');
            const response = await fetch(`${STARFALL_FOLDER}${filename}`);
            if (response.ok) {
                const data = jsyaml.load(await response.text());
                if (data.district) {
                    locations[String(data.district)] = { id, ...data };
                }
            }
        }));

        container.innerHTML = renderGrid(locations);
    } catch (e) {
        container.innerHTML = '<p class="error">Failed to load city districts.</p>';
    }
}

function renderGrid(locations) {
    let html = '<div class="city-map">';

    html += '<div class="map-row-label"></div>';
    html += '<div class="map-anchor sealed">↑ Lord\'s Castle — sealed beyond the grid</div>';

    for (let row = 1; row <= 3; row++) {
        html += `<div class="map-row-label">${ROW_LABELS[row]}</div>`;
        for (let col = 1; col <= 3; col++) {
            const key = `${row},${col}`;
            const loc = locations[key];
            html += loc
                ? renderDistrictCell(loc, key)
                : `<div class="district-cell empty">${key}</div>`;
        }
    }

    html += '<div class="map-row-label"></div>';
    html += '<div class="map-anchor gates">↓ City Gates — entry from outside</div>';

    html += '</div>';
    return html;
}

function renderDistrictCell(loc, key) {
    const modifierTags = (loc.modifiers || []).map(mod => {
        const name = typeof mod === 'object' ? mod.name : mod;
        const cssClass = name.toLowerCase().replace(/\s+/g, '-');
        return `<span class="modifier-tag ${cssClass}">${name}</span>`;
    }).join('');

    const featureCount = loc.features ? loc.features.length : 0;
    const rawDesc = loc.description ? loc.description.trim() : '';
    const firstLine = rawDesc.split('\n').find(l => l.trim()) || '';
    const hasTodo = loc.todo && loc.todo.length > 0;

    return `
        <a href="location.html?id=${loc.id}" class="district-cell${hasTodo ? ' has-todo' : ''}">
            <div class="district-coord">${key}</div>
            <h3 class="district-name">${loc.name}</h3>
            <p class="district-desc">${escapeHtml(firstLine)}</p>
            <div class="district-modifiers">${modifierTags}</div>
            <div class="district-footer">
                <span>${featureCount} Features</span>
                ${hasTodo ? '<span class="wip-badge">WIP</span>' : ''}
            </div>
        </a>`;
}

// ── Mechanics ─────────────────────────────────────────────────────────────────

async function loadMechanics() {
    const container = document.getElementById('mechanics-container');
    try {
        const response = await fetch(MECHANICS_URL);
        if (!response.ok) throw new Error('Not found');
        const data = jsyaml.load(await response.text());
        container.innerHTML = renderMechanics(data);
    } catch (e) {
        container.innerHTML = '<p class="error">Failed to load mechanics.</p>';
    }
}

function renderMechanics(data) {
    return `
        ${renderWakeSystem(data.wake_system)}
        ${renderRobots(data.robots)}
        ${renderChimes(data.chimes)}
    `;
}

function renderWakeSystem(ws) {
    const levelRows = ws.levels.map(l => `
        <tr>
            <td class="wake-level wake-${l.level}">${l.level}</td>
            <td class="wake-state">${l.state}</td>
            <td>${escapeHtml(l.description)}</td>
        </tr>`).join('');

    const triggerRows = ws.escalation.wake_0_to_1.triggers.map(t => `
        <tr>
            <td class="trigger-name">${escapeHtml(t.name)}${t.note ? `<span class="trigger-note"> (${escapeHtml(t.note)})</span>` : ''}</td>
            <td class="trigger-effect">${escapeHtml(t.effect)}</td>
        </tr>`).join('');

    const reversibilityRows = ws.reversibility.map(r => `
        <tr>
            <td class="rev-state">${escapeHtml(r.state)}</td>
            <td class="rev-possible ${r.possible ? 'yes' : 'no'}">${r.possible ? 'Yes' : 'No'}</td>
            <td>${escapeHtml(r.note)}</td>
        </tr>`).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">The Wake System</h3>
            <p class="mechanics-intro">${escapeHtml(ws.intro)}</p>

            <table class="mechanics-table">
                <thead>
                    <tr><th>Wake</th><th>State</th><th>Description</th></tr>
                </thead>
                <tbody>${levelRows}</tbody>
            </table>

            <h4 class="mechanics-subtitle">${escapeHtml(ws.escalation.wake_0_to_1.label)}</h4>
            <table class="mechanics-table">
                <thead>
                    <tr><th>Trigger</th><th>Effect</th></tr>
                </thead>
                <tbody>${triggerRows}</tbody>
            </table>

            <h4 class="mechanics-subtitle">Reversibility</h4>
            <table class="mechanics-table">
                <thead>
                    <tr><th>State</th><th>Reversible</th><th>Notes</th></tr>
                </thead>
                <tbody>${reversibilityRows}</tbody>
            </table>
        </div>`;
}

function renderRobots(robots) {
    const robotRows = robots.types.map(r => `
        <tr>
            <td class="robot-roll">${r.roll}</td>
            <td class="robot-name">${escapeHtml(r.name)}</td>
            <td class="robot-desc">${escapeHtml(r.description)}</td>
            <td class="robot-mechanic">${escapeHtml(r.mechanic)}</td>
        </tr>`).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">The Mechanic's Robots</h3>
            <p class="mechanics-intro">${escapeHtml(robots.intro)}</p>

            <table class="mechanics-table robots-table">
                <thead>
                    <tr><th>D6</th><th>Robot</th><th>Description</th><th>Mechanic</th></tr>
                </thead>
                <tbody>${robotRows}</tbody>
            </table>

            <p class="mechanics-note">${escapeHtml(robots.note)}</p>
        </div>`;
}

function renderChimes(chimes) {
    const rules = chimes.rules.map(r => `<li>${escapeHtml(r)}</li>`).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">Crystal Wind Chimes</h3>
            <p class="mechanics-intro">${escapeHtml(chimes.description)}</p>
            <ul class="mechanics-rules">${rules}</ul>
            <p class="mechanics-note">${escapeHtml(chimes.note)}</p>
        </div>`;
}

document.addEventListener('DOMContentLoaded', init);
