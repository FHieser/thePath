// factions.js — Faction list page
const FACTIONS_BASE = '../the-path-campaign/lore/factions/';

let allFactions = {};
let activeAlignments = new Set(['Flame', 'Mist', 'Neutral', 'Underground']);

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

    renderFactions();
    setupFilters();
}

function renderFactions() {
    const grid = document.getElementById('factions-grid');
    const visible = Object.values(allFactions).filter(f => activeAlignments.has(f.alignment));

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

function setupFilters() {
    document.querySelectorAll('.align-filter').forEach(btn => {
        btn.addEventListener('click', () => {
            const align = btn.dataset.align;
            if (activeAlignments.has(align)) {
                activeAlignments.delete(align);
                btn.classList.remove('active');
            } else {
                activeAlignments.add(align);
                btn.classList.add('active');
            }
            renderFactions();
        });
    });
}

document.addEventListener('DOMContentLoaded', loadFactions);
