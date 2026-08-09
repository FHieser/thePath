// factions.js — Faction list page
const FACTIONS_BASE = '../the-path-campaign/lore/factions/';

let allFactions = {};
// Tri-state filter map: alignment name -> 'include' | 'exclude' | undefined (neutral)
let alignmentFilters = {};
let knownAlignments = [];
const ALIGNMENT_ORDER = ['Flame', 'Mist', 'Neutral', 'Underground'];

async function loadFactions() {
    const grid = document.getElementById('factions-grid');
    const factionIndex = (typeof CONTENT_INDEX !== 'undefined' && CONTENT_INDEX['__factions__']) || {};
    const ids = Object.keys(factionIndex);

    if (ids.length === 0) {
        grid.innerHTML = '<div class="empty-state">No factions found.</div>';
        return;
    }

    await Promise.all(ids.map(async id => {
        try {
            const r = await fetch(`${FACTIONS_BASE}${id}/faction-details.yaml`);
            if (!r.ok) return;
            const data = jsyaml.load(await r.text());
            data._id = id;
            data._npcCount = (factionIndex[id].npcs || []).length;
            allFactions[id] = data;
        } catch (e) {
            console.warn(`Failed to load faction ${id}:`, e);
        }
    }));

    collectAlignments();
    renderFilterTags();
    renderFactions();
}

// Collect all unique alignment values from loaded factions, in preferred order
function collectAlignments() {
    const seen = new Set(Object.values(allFactions).map(f => f.alignment).filter(Boolean));
    const ordered = ALIGNMENT_ORDER.filter(a => seen.has(a));
    const extra = Array.from(seen).filter(a => !ALIGNMENT_ORDER.includes(a)).sort();
    knownAlignments = [...ordered, ...extra];
}

// Filter factions based on alignment tri-state toggles.
// Alignment is a single scalar per faction (not an array like location modifiers),
// so "include" tags match on ANY selected alignment (OR) while "exclude" tags
// drop factions with that alignment (AND-NOT) — an include-set together with
// an AND filter would always yield zero results for a single-valued field.
function filterFactions() {
    const entries = Object.values(allFactions);
    const includes = Object.entries(alignmentFilters).filter(([, s]) => s === 'include').map(([a]) => a);
    const excludes = Object.entries(alignmentFilters).filter(([, s]) => s === 'exclude').map(([a]) => a);

    return entries.filter(f => {
        if (excludes.includes(f.alignment)) return false;
        if (includes.length > 0 && !includes.includes(f.alignment)) return false;
        return true;
    });
}

function renderFactions() {
    const grid = document.getElementById('factions-grid');
    const visible = filterFactions();

    if (visible.length === 0) {
        grid.innerHTML = '<div class="empty-state">No factions match the current filter.</div>';
        return;
    }

    // Sort: Flame → Mist → Neutral → Underground, then alphabetical
    const order = ['Flame', 'Mist', 'Neutral', 'Underground'];
    visible.sort((a, b) => {
        const ai = order.indexOf(a.alignment), bi = order.indexOf(b.alignment);
        if (ai !== bi) return ai - bi;
        return (a.name || '').localeCompare(b.name || '');
    });

    grid.innerHTML = visible.map(f => buildFactionCard(f)).join('');
}

function buildFactionCard(f) {
    const alignClass = (f.alignment || 'neutral').toLowerCase();
    const themes = (f.identity && f.identity.themes || []).slice(0, 3);
    const themeHTML = themes.map(t => `<span class="theme-tag">${escapeHtml(t)}</span>`).join('');
    const storylineCount = (f.storylines || []).length;
    const desc = f.identity && f.identity.description ? f.identity.description.trim() : '';
    const shortDesc = desc.length > 160 ? desc.slice(0, 157) + '…' : desc;

    return `
        <a href="faction.html?id=${encodeURIComponent(f._id)}" class="faction-card ${alignClass}">
            <h3>${escapeHtml(f.name || f._id)}</h3>
            <div class="faction-meta">
                <span class="badge ${alignClass}">${escapeHtml(f.alignment || '—')}</span>
                <span class="badge tier">${escapeHtml(f.tier || '—')}</span>
            </div>
            <p class="faction-desc">${escapeHtml(shortDesc)}</p>
            ${themeHTML ? `<div class="faction-themes">${themeHTML}</div>` : ''}
            <div class="faction-footer">
                <span>${f._npcCount} NPC${f._npcCount !== 1 ? 's' : ''}</span>
                <span>${storylineCount} Storyline${storylineCount !== 1 ? 's' : ''}</span>
            </div>
        </a>`;
}

// Render the alignment filter tags into the filter bar
function renderFilterTags() {
    const container = document.getElementById('filter-tags');
    container.innerHTML = '';
    knownAlignments.forEach(align => {
        const tag = document.createElement('span');
        tag.className = `filter-tag ${align.toLowerCase()}`;
        tag.textContent = align;
        tag.dataset.align = align;

        const state = alignmentFilters[align];
        if (state) tag.classList.add(state);

        tag.addEventListener('click', () => {
            // Cycle: neutral -> include -> exclude -> neutral
            const current = alignmentFilters[align];
            if (!current) {
                alignmentFilters[align] = 'include';
            } else if (current === 'include') {
                alignmentFilters[align] = 'exclude';
            } else {
                delete alignmentFilters[align];
            }
            renderFilterTags();
            renderFactions();
        });

        container.appendChild(tag);
    });
}

document.addEventListener('DOMContentLoaded', loadFactions);
