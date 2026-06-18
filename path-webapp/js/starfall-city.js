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
    const parts = [];
    if (data.path_anchor)    parts.push(renderPathAnchor(data.path_anchor));
    if (data.wake_system)    parts.push(renderWakeSystem(data.wake_system));
    if (data.warden)         parts.push(renderWarden(data.warden));
    if (data.castle_access)  parts.push(renderCastleAccess(data.castle_access));
    if (data.story_threads)  parts.push(renderStoryThreads(data.story_threads));
    if (data.robots)         parts.push(renderRobots(data.robots));
    if (data.chimes)         parts.push(renderChimes(data.chimes));
    return parts.join('');
}

// ── Section renderers ─────────────────────────────────────────────────────────

function renderPathAnchor(pa) {
    const effects = (pa.the_urgency?.effects || []).map(e => `<li>${escapeHtml(e)}</li>`).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">The City's Grip on the Path</h3>
            <p class="mechanics-intro">${escapeHtml(pa.intro)}</p>

            ${pa.the_urgency ? `
                <h4 class="mechanics-subtitle">The Urgency</h4>
                <p style="font-size:0.88rem; margin-bottom:0.5rem;">${escapeHtml(pa.the_urgency.description)}</p>
                <ul class="mechanics-rules">${effects}</ul>
            ` : ''}

            ${pa.the_cause ? `
                <h4 class="mechanics-subtitle">The Cause</h4>
                <p style="font-size:0.88rem; margin-bottom:0.35rem;">${escapeHtml(pa.the_cause.description)}</p>
                <p class="mechanics-note">${escapeHtml(pa.the_cause.discovery)}</p>
            ` : ''}

            ${pa.resolution ? `<div class="principle-block">${escapeHtml(pa.resolution)}</div>` : ''}
        </div>`;
}

function renderWakeSystem(ws) {
    const levelRows = (ws.levels || []).map(l => `
        <tr>
            <td class="wake-level wake-${l.level}">${l.level}</td>
            <td class="wake-state">${escapeHtml(l.state)}</td>
            <td>${escapeHtml(l.description)}</td>
        </tr>`).join('');

    const transitionSections = (ws.transitions || []).map(t => {
        const triggerRows = (t.triggers || []).map(tr => `
            <tr>
                <td class="trigger-name">${escapeHtml(tr.trigger)}</td>
                <td class="trigger-effect">${escapeHtml(tr.effect)}</td>
            </tr>`).join('');
        return `
            <h4 class="mechanics-subtitle">${escapeHtml(t.step)} — ${escapeHtml(t.name)} (0–${t.counter})</h4>
            ${t.note ? `<p style="font-size:0.82rem; opacity:0.7; margin-bottom:0.4rem; font-style:italic;">${escapeHtml(t.note)}</p>` : ''}
            <table class="mechanics-table">
                <thead><tr><th>Trigger</th><th>Effect</th></tr></thead>
                <tbody>${triggerRows}</tbody>
            </table>`;
    }).join('');

    let overseerHtml = '';
    if (ws.overseer) {
        const ov = ws.overseer;
        overseerHtml = `
            <div class="overseer-block">
                <h4 class="overseer-title">The Overseer</h4>
                <p style="font-size:0.85rem; margin-bottom:0.5rem;">${escapeHtml(ov.description)}</p>
                ${ov.action ? `<p style="font-size:0.85rem; margin-bottom:0.35rem;"><strong>${escapeHtml(ov.action.name)}:</strong> ${escapeHtml(ov.action.effect)}</p>` : ''}
                ${ov.when_destroyed ? `<p style="font-size:0.82rem; opacity:0.75; font-style:italic;">${escapeHtml(ov.when_destroyed)}</p>` : ''}
                ${ov.stat_block ? `<p class="mechanics-note">Stat block: ${escapeHtml(ov.stat_block)}</p>` : ''}
            </div>`;
    }

    const loweringItems = (ws.lowering_wake || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">The Wake System</h3>
            <p class="mechanics-intro">${escapeHtml(ws.intro)}</p>

            <table class="mechanics-table">
                <thead><tr><th>Wake</th><th>State</th><th>Description</th></tr></thead>
                <tbody>${levelRows}</tbody>
            </table>

            ${transitionSections}
            ${overseerHtml}

            <h4 class="mechanics-subtitle">Lowering Wake</h4>
            <ul class="mechanics-rules">${loweringItems}</ul>
        </div>`;
}

function renderWarden(warden) {
    const rules = (warden.rules || []).map(r => `<li>${escapeHtml(r)}</li>`).join('');
    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">The Warden</h3>
            <p class="mechanics-intro">${escapeHtml(warden.description)}</p>
            <ul class="mechanics-rules">${rules}</ul>
            ${warden.origin ? `<p style="font-size:0.85rem; margin-top:0.6rem;"><strong>Origin:</strong> ${escapeHtml(warden.origin)}</p>` : ''}
            ${warden.note ? `<p class="mechanics-note">${escapeHtml(warden.note)}</p>` : ''}
        </div>`;
}

function renderCastleAccess(ca) {
    const compRows = (ca.the_drill?.components || []).map(c => `
        <tr>
            <td style="font-weight:600; color:var(--accent-amber);">${escapeHtml(c.name)}</td>
            <td style="opacity:0.7; font-size:0.82rem; width:5rem;">${escapeHtml(c.role)}</td>
            <td style="font-size:0.82rem;">${escapeHtml(c.source)}</td>
            <td style="font-size:0.82rem;">${escapeHtml(c.description)}</td>
        </tr>`).join('');

    const stateRows = (ca.the_soldier_door?.states || []).map(s => `
        <tr>
            <td style="font-weight:600; width:35%;">${escapeHtml(s.condition)}</td>
            <td style="font-size:0.85rem;">${escapeHtml(s.outcome)}</td>
        </tr>`).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">Getting Into the Castle</h3>
            <p class="mechanics-intro">${escapeHtml(ca.intro)}</p>

            ${ca.the_drill ? `
                <h4 class="mechanics-subtitle">The Drill — Three Components</h4>
                <p style="font-size:0.85rem; margin-bottom:0.5rem;">${escapeHtml(ca.the_drill.description)}</p>
                <table class="mechanics-table">
                    <thead><tr><th>Component</th><th>Role</th><th>Found At</th><th>Description</th></tr></thead>
                    <tbody>${compRows}</tbody>
                </table>
            ` : ''}

            ${ca.the_soldier_door ? `
                <h4 class="mechanics-subtitle">The Soldier at the Door</h4>
                <p style="font-size:0.85rem; margin-bottom:0.5rem;">${escapeHtml(ca.the_soldier_door.description)}</p>
                <table class="mechanics-table">
                    <thead><tr><th>Condition</th><th>Outcome</th></tr></thead>
                    <tbody>${stateRows}</tbody>
                </table>
            ` : ''}

            ${ca.principle ? `
                <div class="principle-block">
                    <strong>${escapeHtml(ca.principle.title)}</strong><br>
                    ${escapeHtml(ca.principle.description)}
                </div>
            ` : ''}
        </div>`;
}

function renderStoryThreads(st) {
    const threadRows = (st.threads || []).map(t => {
        const baselineName = t.baseline?.name || '';
        const baselineReward = t.baseline?.reward || '';
        const hasBaseline = baselineName && baselineName !== '—';
        return `
            <tr>
                <td>
                    <strong>${escapeHtml(t.character)}</strong><br>
                    <span style="font-size:0.78rem; opacity:0.6;">${escapeHtml(t.end_location)}</span>
                </td>
                <td style="font-size:0.82rem;">
                    ${hasBaseline
                        ? `<strong>${escapeHtml(baselineName)}</strong><br><span style="opacity:0.75;">${escapeHtml(baselineReward)}</span>`
                        : `<em style="opacity:0.5;">—</em>`}
                </td>
                <td style="font-size:0.82rem;">
                    <strong style="color:var(--accent-amber);">${escapeHtml(t.full_reward?.name || '')}</strong><br>
                    <span style="opacity:0.85;">${escapeHtml(t.full_reward?.reward || '')}</span>
                </td>
            </tr>`;
    }).join('');

    return `
        <div class="mechanics-block">
            <h3 class="mechanics-title">Story Threads</h3>
            <p class="mechanics-intro">${escapeHtml(st.description)}</p>
            <div class="principle-block" style="margin-bottom:0.75rem;">${escapeHtml(st.principle)}</div>
            <table class="mechanics-table">
                <thead>
                    <tr>
                        <th style="width:20%;">Thread</th>
                        <th style="width:35%;">Baseline — Floor</th>
                        <th style="width:45%;">Go the Distance — Ceiling</th>
                    </tr>
                </thead>
                <tbody>${threadRows}</tbody>
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
