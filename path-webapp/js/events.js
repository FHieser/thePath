// events.js — Event list page
// Events are occurrences rather than places: they attach to whatever location
// the party happens to be in, so there is no grid position or tarot mapping.

let allEvents = [];

async function loadEvents() {
    const grid = document.getElementById('events-grid');
    const filenames = await discoverYamlFiles(EVENTS_URL);

    if (filenames.length === 0) {
        grid.innerHTML = '<div class="empty-state">No events found.</div>';
        return;
    }

    await Promise.all(filenames.map(async filename => {
        try {
            const r = await fetch(`${EVENTS_URL}${filename}`);
            if (!r.ok) return;
            const data = jsyaml.load(await r.text());
            data._id = filename.replace(/\.yaml$/, '');
            allEvents.push(data);
        } catch (e) {
            console.warn(`Failed to load event ${filename}:`, e);
        }
    }));

    allEvents.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    renderEvents();
}

/** Events may be tiered (a `tiers` array) or flat (top-level difficulty/features). */
function eventTiers(ev) {
    return Array.isArray(ev.tiers) && ev.tiers.length > 0 ? ev.tiers : null;
}

function tierLabel(ev) {
    const tiers = eventTiers(ev);
    if (!tiers) return ev.tier ? `Tier ${ev.tier}` : '—';
    const nums = tiers.map(t => t.tier);
    return nums.length === 1 ? `Tier ${nums[0]}` : `Tier ${Math.min(...nums)}–${Math.max(...nums)}`;
}

function difficultyLabel(ev) {
    const tiers = eventTiers(ev);
    if (!tiers) return ev.difficulty ?? '—';
    const diffs = tiers.map(t => t.difficulty).filter(d => d != null);
    if (diffs.length === 0) return '—';
    return diffs.length === 1 ? diffs[0] : `${Math.min(...diffs)}–${Math.max(...diffs)}`;
}

function featureCount(ev) {
    const tiers = eventTiers(ev);
    if (tiers) return (tiers[0].features || []).length;
    return (ev.features || []).length;
}

function renderEvents() {
    const grid = document.getElementById('events-grid');
    grid.innerHTML = allEvents.map(ev => buildEventCard(ev)).join('');
}

function buildEventCard(ev) {
    const catClass = (ev.category || 'event').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const desc = (ev.description || '').trim();
    const shortDesc = desc.length > 180 ? desc.slice(0, 177) + '…' : desc;
    const count = featureCount(ev);

    return `
        <a href="event.html?id=${encodeURIComponent(ev._id)}" class="event-card ${catClass}">
            <h3>${escapeHtml(ev.name || ev._id)}</h3>
            <div class="event-meta">
                <span class="badge ${catClass}">${escapeHtml(ev.category || 'Event')}</span>
                <span class="badge tier">${escapeHtml(tierLabel(ev))}</span>
                <span class="badge tier">Diff ${escapeHtml(String(difficultyLabel(ev)))}</span>
            </div>
            <p class="event-desc">${escapeHtml(shortDesc)}</p>
            <div class="event-footer">
                <span>${count} Feature${count !== 1 ? 's' : ''}</span>
                ${ev.trigger ? '<span>Triggered</span>' : ''}
            </div>
        </a>`;
}

document.addEventListener('DOMContentLoaded', loadEvents);
