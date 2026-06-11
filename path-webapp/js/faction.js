// faction.js — Faction detail page with storyline flowchart
const FACTIONS_BASE = '../the-path-campaign/lore/factions/';

async function loadFaction() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) { showError('No faction ID specified.'); return; }

    const factionIndex = (typeof CONTENT_INDEX !== 'undefined' && CONTENT_INDEX['__factions__']) || {};
    const meta = factionIndex[id];

    let faction;
    try {
        const r = await fetch(`${FACTIONS_BASE}${id}/faction-details.yaml`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        faction = jsyaml.load(await r.text());
    } catch (e) {
        showError(`Could not load faction: ${id}`);
        return;
    }

    document.title = `${faction.name} - The Path`;
    renderHeader(faction);
    renderOverview(faction);
    renderWorld(faction);
    renderStorylines(faction);

    // Load NPCs async after initial render
    const npcFiles = meta ? (meta.npcs || []) : [];
    renderNpcs(id, npcFiles);

    setupTabs();
}

function renderHeader(f) {
    document.getElementById('faction-name').textContent = f.name || f.id;
    const alignClass = (f.alignment || 'neutral').toLowerCase();
    document.getElementById('faction-header-meta').innerHTML = `
        <span class="align-badge ${alignClass}">${escapeHtml(f.alignment || '—')}</span>
        <span class="tier-badge">${escapeHtml(f.tier || '—')}</span>`;
}

// ── Overview tab ──────────────────────────────────────────────────────────────
function renderOverview(f) {
    const el = document.getElementById('overview-content');
    const desc = f.identity && f.identity.description ? f.identity.description.trim() : '';
    const themes = (f.identity && f.identity.themes) || [];
    const phil = f.identity && f.identity.philosophy ? f.identity.philosophy.trim() : '';

    let html = '';

    // Description + themes
    html += `<div class="section-block">
        <h3>Identity</h3>
        ${desc ? `<p style="margin-bottom:0.75rem">${escapeHtml(desc)}</p>` : ''}
        ${themes.length ? `<div class="themes-list">${themes.map(t => `<span class="theme-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        ${phil ? `<p style="margin-top:0.75rem;font-style:italic;opacity:0.8">${escapeHtml(phil)}</p>` : ''}
    </div>`;

    // History
    if (f.history) {
        html += `<div class="section-block"><h3>History</h3>`;
        if (f.history.origin) html += `<p style="margin-bottom:0.75rem">${formatDescription(f.history.origin)}</p>`;
        if (f.history.events && f.history.events.length) {
            f.history.events.forEach(ev => {
                html += `<div style="margin-bottom:0.5rem;padding-left:0.75rem;border-left:0.15rem solid rgba(212,165,116,0.3)">
                    <div style="font-size:0.8rem;font-weight:700;color:var(--accent-amber);margin-bottom:0.2rem">${escapeHtml(ev.name || '')}</div>
                    <p>${formatDescription(ev.description || '')}</p>
                </div>`;
            });
        }
        html += `</div>`;
    }

    // Goals
    if (f.goals) {
        html += `<div class="section-block"><h3>Goals</h3><ul>`;
        if (f.goals.primary) html += `<li><strong>Primary:</strong> ${escapeHtml(f.goals.primary)}</li>`;
        (f.goals.secondary || []).forEach(g => { html += `<li>${escapeHtml(g)}</li>`; });
        if (f.goals.long_term) html += `<li style="opacity:0.7;font-style:italic">${escapeHtml(f.goals.long_term)}</li>`;
        html += `</ul></div>`;
    }

    // Item identity
    if (f.item_identity) {
        html += `<div class="section-block"><h3>Item Identity</h3>`;
        if (f.item_identity.theme) html += `<p style="margin-bottom:0.5rem">${formatDescription(f.item_identity.theme)}</p>`;
        if (f.item_identity.cost) html += `<p style="opacity:0.75;font-style:italic">${escapeHtml('Cost: ')}${formatDescription(f.item_identity.cost)}</p>`;
        html += `</div>`;
    }

    // Rumors
    if (f.rumors && f.rumors.length) {
        html += `<div class="section-block"><h3>Rumors</h3><ul class="rumor-list">`;
        f.rumors.forEach(r => { html += `<li>${escapeHtml(String(r).trim())}</li>`; });
        html += `</ul></div>`;
    }

    // Plot hooks
    if (f.plot_hooks && f.plot_hooks.length) {
        html += `<div class="section-block"><h3>Plot Hooks</h3>`;
        f.plot_hooks.forEach(h => {
            html += `<div class="hook-card">
                <div class="hook-name">${escapeHtml(h.name || h.id || '')}</div>
                <p class="hook-desc">${formatDescription(h.description || '')}</p>
            </div>`;
        });
        html += `</div>`;
    }

    el.innerHTML = html;
}

// ── World tab ─────────────────────────────────────────────────────────────────
function renderWorld(f) {
    const el = document.getElementById('world-content');
    let html = '';

    // Territory
    if (f.territory) {
        html += `<div class="section-block"><h3>Territory</h3>`;
        if (f.territory.type) html += `<p style="font-weight:700;margin-bottom:0.4rem">${escapeHtml(f.territory.type)}</p>`;
        if (f.territory.description) html += `<p style="margin-bottom:0.5rem">${formatDescription(f.territory.description)}</p>`;
        if (f.territory.locations && f.territory.locations.length) {
            html += `<div style="display:flex;flex-wrap:wrap;gap:0.3rem">` +
                f.territory.locations.map(l => `<span class="theme-tag">${escapeHtml(l)}</span>`).join('') +
                `</div>`;
        }
        html += `</div>`;
    }

    // Mist protection
    if (f.mist_protection) {
        html += `<div class="section-block"><h3>Mist Relationship</h3>`;
        if (f.mist_protection.type) html += `<p style="font-weight:700;margin-bottom:0.4rem">${escapeHtml(f.mist_protection.type)}</p>`;
        if (f.mist_protection.description) html += `<p>${formatDescription(f.mist_protection.description)}</p>`;
        html += `</div>`;
    }

    // Subgroups
    if (f.subgroups && f.subgroups.length) {
        html += `<div class="section-block"><h3>Subgroups</h3>`;
        f.subgroups.forEach(sg => {
            html += `<div class="subgroup-card">
                <div class="subgroup-name">${escapeHtml(sg.name || '')}</div>
                <div class="subgroup-role">${escapeHtml(sg.role || '')}</div>
                <p style="font-size:0.85rem;opacity:0.85;line-height:1.5">${formatDescription(sg.description || '')}</p>
            </div>`;
        });
        html += `</div>`;
    }

    // Relationships
    if (f.relationships && f.relationships.length) {
        html += `<div class="section-block"><h3>Faction Relationships</h3><div class="rel-grid">`;
        f.relationships.forEach(rel => {
            const stanceClass = (rel.stance || 'indifferent').toLowerCase().replace(/\s+/g, '-');
            const factionLabel = rel.faction
                ? rel.faction.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                : '—';
            html += `<div class="rel-card ${stanceClass}">
                <div class="rel-name">${escapeHtml(factionLabel)}</div>
                <div class="rel-stance">${escapeHtml(rel.stance || '—')}</div>
                <p class="rel-desc">${formatDescription(rel.description || '')}</p>
            </div>`;
        });
        html += `</div></div>`;
    }

    el.innerHTML = html || '<p style="opacity:0.6;padding:1rem">No world data available.</p>';
}

// ── Storylines tab ────────────────────────────────────────────────────────────
function renderStorylines(f) {
    const el = document.getElementById('storylines-content');
    const storylines = f.storylines || [];

    if (!storylines.length) {
        el.innerHTML = '<p style="opacity:0.6;padding:1rem">No storylines defined.</p>';
        return;
    }

    let html = '';
    storylines.forEach(story => {
        html += buildStorylineBlock(story);
    });
    el.innerHTML = html;
}

function buildStorylineBlock(story) {
    const phases = story.phases || [];
    const statusClass = (story.status || 'dormant').toLowerCase();

    let html = `<div style="margin-bottom:2rem">
        <div class="storyline-header">
            <h3>${escapeHtml(story.name || story.id || '')}</h3>
            <span class="status-badge ${statusClass}">${escapeHtml(story.status || 'dormant')}</span>
        </div>`;

    if (story.summary) {
        html += `<p style="margin-bottom:1rem;opacity:0.85;font-style:italic">${formatDescription(story.summary)}</p>`;
    }

    if (phases.length) {
        html += `<div class="phase-flow">`;
        phases.forEach(phase => {
            html += buildPhaseNode(phase, phases);
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function buildPhaseNode(phase, allPhases) {
    const typeClass = (phase.type || 'milestone').toLowerCase().replace(/\s+/g, '-');
    const branches = phase.branches || [];

    let html = `<div class="phase-node" id="phase-${phase.id}">
        <div class="phase-card ${typeClass}">
            <div class="phase-top">
                <span class="phase-type-label">${escapeHtml(phase.type || '')}</span>
                <span class="phase-name">${escapeHtml(phase.name || phase.id || '')}</span>
            </div>`;

    if (phase.description) {
        html += `<p class="phase-desc">${formatDescription(phase.description)}</p>`;
    }

    // Progress tracker for active phases
    if (phase.progress) {
        const p = phase.progress;
        html += `<div class="phase-progress">Progress: ${p.current || 0} / ${p.required || '?'}</div>`;
        if (p.locations && p.locations.length) {
            html += `<ul class="progress-locations">`;
            p.locations.forEach(loc => {
                const locName = typeof loc === 'object' ? loc.name : loc;
                const locStatus = typeof loc === 'object' ? loc.status : 'available';
                html += `<li class="progress-loc ${locStatus === 'pending' ? 'pending' : ''}">${escapeHtml(locName)}</li>`;
            });
            html += `</ul>`;
        }
    }

    // Triggers (entry phases)
    if (phase.triggers && phase.triggers.length) {
        html += `<div style="font-size:0.75rem;opacity:0.6;margin-bottom:0.4rem">
            Triggered by: ${phase.triggers.map(t => escapeHtml(t)).join(' · ')}
        </div>`;
    }

    // Branch links
    if (branches.length) {
        html += `<div class="phase-branches">`;
        branches.forEach(branch => {
            if (!branch.next) {
                html += `<span class="branch-link dead-end">
                    <span>${escapeHtml(branch.label || '—')}</span>
                    <span class="branch-arrow">∎</span>
                </span>`;
            } else {
                html += `<a href="#phase-${branch.next}" class="branch-link">
                    <span>${escapeHtml(branch.label || branch.next)}</span>
                    <span class="branch-arrow">↓</span>
                </a>`;
            }
        });
        html += `</div>`;
    }

    html += `</div></div>`;
    return html;
}

// ── NPCs tab ──────────────────────────────────────────────────────────────────
async function renderNpcs(factionId, npcFiles) {
    const el = document.getElementById('npcs-content');
    if (!npcFiles.length) {
        el.innerHTML = '<p style="opacity:0.6;padding:1rem">No NPCs defined for this faction.</p>';
        return;
    }

    el.innerHTML = '<p class="loading">Loading NPCs…</p>';
    const npcs = [];

    await Promise.all(npcFiles.map(async file => {
        try {
            const r = await fetch(`${FACTIONS_BASE}${factionId}/npcs/${file}`);
            if (!r.ok) return;
            const data = jsyaml.load(await r.text());
            data._file = file;
            npcs.push(data);
        } catch (e) {
            console.warn(`Failed to load NPC ${file}:`, e);
        }
    }));

    if (!npcs.length) {
        el.innerHTML = '<p style="opacity:0.6;padding:1rem">Could not load NPC data.</p>';
        return;
    }

    npcs.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    el.innerHTML = `<div class="npc-grid">${npcs.map(buildNpcCard).join('')}</div>`;
}

function buildNpcCard(npc) {
    let html = `<div class="npc-card">
        <div class="npc-name">${escapeHtml(npc.name || '—')}</div>
        <div class="npc-role">${escapeHtml(npc.role || '')}</div>`;

    if (npc.location) {
        html += `<div class="npc-location">📍 ${escapeHtml(npc.location)}</div>`;
    }

    if (npc.appearance && npc.appearance.length) {
        html += `<div class="npc-section-label">Appearance</div>
            <ul class="npc-appearance" style="padding-left:1rem">`;
        npc.appearance.forEach(line => {
            html += `<li>${escapeHtml(line)}</li>`;
        });
        html += `</ul>`;
    }

    if (npc.the_twist) {
        html += `<div class="npc-section-label">The Twist</div>
            <p class="npc-twist">${formatDescription(npc.the_twist)}</p>`;
    }

    if (npc.theme) {
        html += `<div class="npc-section-label">Theme</div>
            <p style="font-size:0.83rem;opacity:0.8;line-height:1.5">${formatDescription(npc.theme)}</p>`;
    }

    if (npc.wants && npc.wants.length) {
        html += `<div class="npc-section-label">Wants</div>
            <ul style="padding-left:1rem;list-style:disc">`;
        npc.wants.forEach(w => { html += `<li style="font-size:0.82rem;opacity:0.85;margin-bottom:0.15rem">${escapeHtml(w)}</li>`; });
        html += `</ul>`;
    }

    if (npc.gm_notes && npc.gm_notes.length) {
        html += `<div class="npc-section-label">GM Notes</div>
            <ul class="npc-gm" style="padding-left:1rem;list-style:disc">`;
        npc.gm_notes.forEach(n => { html += `<li>${escapeHtml(n)}</li>`; });
        html += `</ul>`;
    }

    if (npc.combat_stats) {
        html += `<div class="npc-section-label">Combat</div>
            <p style="font-size:0.8rem;opacity:0.7">Tier ${escapeHtml(String(npc.combat_stats.tier || '?'))} ${escapeHtml(npc.combat_stats.type || '')} — Difficulty ${escapeHtml(String(npc.combat_stats.difficulty || '?'))}</p>`;
    }

    html += `</div>`;
    return html;
}

// ── Tab wiring ────────────────────────────────────────────────────────────────
function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

function showError(msg) {
    document.getElementById('faction-name').textContent = 'Error';
    document.getElementById('overview-content').innerHTML = `<p class="error">${escapeHtml(msg)}</p>`;
}

document.addEventListener('DOMContentLoaded', loadFaction);
