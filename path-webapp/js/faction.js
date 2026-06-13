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

    el.innerHTML = storylines.map((s, i) => buildStorylineBlock(s, i)).join('');

    // SVG edges need real layout — draw when tab is visible (see setupTabs).
    // If storylines tab is already active on load, draw immediately.
    if (document.getElementById('tab-storylines').classList.contains('active')) {
        requestAnimationFrame(drawAllFlowchartEdges);
    }
}

function drawAllFlowchartEdges() {
    document.querySelectorAll('.phase-flowchart:not([data-drawn])').forEach(fc => {
        drawFlowchartEdges(fc);
        fc.dataset.drawn = '1';
    });
}

function buildStorylineBlock(story, storyIdx) {
    const phases = story.phases || [];
    const statusClass = (story.status || 'dormant').toLowerCase();

    let html = `<div class="storyline-block">
        <div class="storyline-header">
            <h3>${escapeHtml(story.name || story.id || '')}</h3>
            <span class="status-badge ${statusClass}">${escapeHtml(story.status || 'dormant')}</span>
        </div>`;

    if (story.summary) {
        html += `<p style="margin-bottom:1.25rem;opacity:0.85;font-style:italic">${formatDescription(story.summary)}</p>`;
    }

    if (phases.length) {
        html += buildFlowchart(phases, storyIdx);
    }

    html += `</div>`;
    return html;
}

function buildFlowchart(phases, storyIdx) {
    const phaseMap = Object.fromEntries(phases.map(p => [p.id, p]));

    // Collect all declared edges (branches with a valid next target)
    const allEdges   = [];
    const childrenOf = Object.fromEntries(phases.map(p => [p.id, []]));

    phases.forEach(p => {
        (p.branches || []).forEach(b => {
            if (b.next && phaseMap[b.next]) {
                allEdges.push({ from: p.id, to: b.next, label: b.label || '' });
                childrenOf[p.id].push(b.next);
            }
        });
    });

    // DFS to identify back-edges (edges that form cycles).
    // Back-edges are excluded from inDegree so Kahn's terminates correctly.
    const dfsState     = Object.fromEntries(phases.map(p => [p.id, 0])); // 0 unvisited, 1 in-stack, 2 done
    const backEdgeKeys = new Set();

    function dfs(id) {
        dfsState[id] = 1;
        (childrenOf[id] || []).forEach(cid => {
            if (dfsState[cid] === 1) { backEdgeKeys.add(`${id}|${cid}`); }
            else if (dfsState[cid] === 0) { dfs(cid); }
        });
        dfsState[id] = 2;
    }
    phases.forEach(p => { if (dfsState[p.id] === 0) dfs(p.id); });

    // Separate forward edges (for layout) from back-edges (shown as pills in cards)
    const backEdgesByPhase = Object.fromEntries(phases.map(p => [p.id, []]));
    const fwdEdges = allEdges.filter(e => {
        if (backEdgeKeys.has(`${e.from}|${e.to}`)) {
            backEdgesByPhase[e.from].push(e);
            return false;
        }
        return true;
    });

    // Build forward-only adjacency + inDegree for Kahn's
    const fwdChildrenOf = Object.fromEntries(phases.map(p => [p.id, []]));
    const inDegree      = Object.fromEntries(phases.map(p => [p.id, 0]));
    fwdEdges.forEach(e => {
        fwdChildrenOf[e.from].push(e.to);
        inDegree[e.to]++;
    });

    // Kahn's topological sort + longest-path layer assignment
    const layer = Object.fromEntries(phases.map(p => [p.id, 0]));
    const queue = phases.filter(p => inDegree[p.id] === 0).map(p => p.id);
    const topo  = [];

    while (queue.length) {
        const id = queue.shift();
        topo.push(id);
        fwdChildrenOf[id].forEach(cid => {
            layer[cid] = Math.max(layer[cid], layer[id] + 1);
            if (--inDegree[cid] === 0) queue.push(cid);
        });
    }

    // Any phases not reached (shouldn't happen after DFS back-edge removal) go at the end
    const topoSet = new Set(topo);
    phases.forEach(p => { if (!topoSet.has(p.id)) topo.push(p.id); });

    // Group phases into rows by layer depth
    const maxLayer = Math.max(...topo.map(id => layer[id] ?? 0));
    const layers   = Array.from({ length: maxLayer + 1 }, () => []);
    topo.forEach(id => layers[layer[id] ?? 0].push(phaseMap[id]));

    const edgesJson = JSON.stringify(fwdEdges).replace(/'/g, '&#39;');

    let html = `<div class="phase-flowchart-wrap">
        <div class="phase-flowchart" data-story="${storyIdx}">
        <svg class="flowchart-svg" data-edges='${edgesJson}'></svg>`;

    layers.forEach(row => {
        html += `<div class="flow-layer">`;
        row.forEach(p => { html += buildPhaseCardHtml(p, backEdgesByPhase[p.id] || []); });
        html += `</div>`;
    });

    html += `</div></div>`;
    return html;
}

function buildPhaseCardHtml(phase, backEdges) {
    const typeClass = (phase.type || 'milestone').toLowerCase().replace(/\s+/g, '-');

    let html = `<div class="phase-card ${typeClass}" id="phase-${phase.id}">
        <div class="phase-top">
            <span class="phase-type-label">${escapeHtml(phase.type || '')}</span>
            <span class="phase-name">${escapeHtml(phase.name || phase.id || '')}</span>
        </div>`;

    if (phase.description) {
        html += `<p class="phase-desc">${formatDescription(phase.description)}</p>`;
    }

    if (phase.progress) {
        const p = phase.progress;
        html += `<div class="phase-progress">Progress: ${p.current || 0} / ${p.required || '?'}</div>`;
        if (p.locations && p.locations.length) {
            html += `<ul class="progress-locations">`;
            p.locations.forEach(loc => {
                const name   = typeof loc === 'object' ? loc.name   : loc;
                const status = typeof loc === 'object' ? loc.status : 'available';
                html += `<li class="progress-loc${status === 'pending' ? ' pending' : ''}">${escapeHtml(name)}</li>`;
            });
            html += `</ul>`;
        }
    }

    if (phase.triggers && phase.triggers.length) {
        html += `<div class="phase-triggers">Triggered by: ${phase.triggers.map(t => escapeHtml(t)).join(' · ')}</div>`;
    }

    const deadEnds = (phase.branches || []).filter(b => !b.next);
    if (deadEnds.length || backEdges.length) {
        html += `<div class="phase-dead-ends">`;
        deadEnds.forEach(b => {
            html += `<span class="dead-end-pill">∎ ${escapeHtml(b.label || '—')}</span>`;
        });
        backEdges.forEach(b => {
            html += `<span class="dead-end-pill back-ref">↩ ${escapeHtml(b.label || b.to)}</span>`;
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

function drawFlowchartEdges(flowchartEl) {
    const svgEl = flowchartEl.querySelector('.flowchart-svg');
    if (!svgEl) return;

    let edges;
    try { edges = JSON.parse(svgEl.dataset.edges || '[]'); } catch { return; }

    const w = flowchartEl.scrollWidth;
    const h = flowchartEl.scrollHeight;
    svgEl.setAttribute('width',   w);
    svgEl.setAttribute('height',  h);
    svgEl.setAttribute('viewBox', `0 0 ${w} ${h}`);

    const ns       = 'http://www.w3.org/2000/svg';
    const markerId = `arrow-${flowchartEl.dataset.story}`;

    // Arrowhead marker
    const defs   = document.createElementNS(ns, 'defs');
    const marker = document.createElementNS(ns, 'marker');
    marker.setAttribute('id',          markerId);
    marker.setAttribute('markerWidth',  '6');
    marker.setAttribute('markerHeight', '6');
    marker.setAttribute('refX',         '5');
    marker.setAttribute('refY',         '3');
    marker.setAttribute('orient',       'auto');
    const tip = document.createElementNS(ns, 'polygon');
    tip.setAttribute('points', '0 0, 6 3, 0 6');
    tip.setAttribute('fill',   'rgba(255,255,255,0.22)');
    marker.appendChild(tip);
    defs.appendChild(marker);
    svgEl.appendChild(defs);

    edges.forEach(edge => {
        const fromEl = flowchartEl.querySelector(`#phase-${CSS.escape(edge.from)}`);
        const toEl   = flowchartEl.querySelector(`#phase-${CSS.escape(edge.to)}`);
        if (!fromEl || !toEl) return;

        const fp = getRelativeOffset(fromEl, flowchartEl);
        const tp = getRelativeOffset(toEl,   flowchartEl);

        const x1 = fp.left + fromEl.offsetWidth  / 2;
        const y1 = fp.top  + fromEl.offsetHeight;
        const x2 = tp.left + toEl.offsetWidth    / 2;
        const y2 = tp.top;
        const cy = (y1 + y2) / 2;

        const path = document.createElementNS(ns, 'path');
        path.setAttribute('d',          `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`);
        path.setAttribute('stroke',     'rgba(255,255,255,0.18)');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill',       'none');
        path.setAttribute('marker-end', `url(#${markerId})`);
        svgEl.appendChild(path);

        if (!edge.label) return;

        const label = edge.label.length > 28 ? edge.label.slice(0, 25) + '…' : edge.label;
        const lx    = (x1 + x2) / 2;
        const ly    = cy;
        const approxW = label.length * 5 + 10;

        const bg = document.createElementNS(ns, 'rect');
        bg.setAttribute('x',      lx - approxW / 2);
        bg.setAttribute('y',      ly - 7);
        bg.setAttribute('width',  approxW);
        bg.setAttribute('height', 13);
        bg.setAttribute('rx',     '2');
        bg.setAttribute('fill',   'rgba(14,14,26,0.9)');
        svgEl.appendChild(bg);

        const txt = document.createElementNS(ns, 'text');
        txt.setAttribute('x',           lx);
        txt.setAttribute('y',           ly + 3.5);
        txt.setAttribute('text-anchor', 'middle');
        txt.setAttribute('font-size',   '9');
        txt.setAttribute('fill',        'rgba(255,255,255,0.42)');
        txt.textContent = label;
        svgEl.appendChild(txt);
    });
}

function getRelativeOffset(el, ancestor) {
    let top = 0, left = 0, cur = el;
    while (cur && cur !== ancestor) {
        top  += cur.offsetTop;
        left += cur.offsetLeft;
        cur   = cur.offsetParent;
    }
    return { top, left };
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

            // SVG edges need real layout — draw once when storylines tab first becomes visible
            if (btn.dataset.tab === 'storylines') {
                requestAnimationFrame(drawAllFlowchartEdges);
            }
        });
    });
}

function showError(msg) {
    document.getElementById('faction-name').textContent = 'Error';
    document.getElementById('overview-content').innerHTML = `<p class="error">${escapeHtml(msg)}</p>`;
}

document.addEventListener('DOMContentLoaded', loadFaction);
