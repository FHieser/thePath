// Event detail page — renders a single event stat block.
// Events may be tiered (a `tiers` array carrying its own difficulty + features,
// mirroring the adversary pattern) or flat (top-level difficulty + features).
// Tiered events get a toggle; flat ones render straight through.

let currentEvent = null;
let selectedTierIndex = 0;

document.addEventListener('DOMContentLoaded', async () => {
    const eventId = new URLSearchParams(window.location.search).get('id');

    if (!eventId) {
        displayError('No event specified');
        return;
    }

    try {
        const response = await fetch(`${EVENTS_URL}${eventId}.yaml`);
        if (!response.ok) {
            displayError(`Event "${eventId}" not found`);
            return;
        }

        currentEvent = jsyaml.load(await response.text());
        document.title = `${currentEvent.name} - The Path`;
        displayEvent();
    } catch (error) {
        console.error('Full error:', error);
        displayError(`Failed to load event: ${error.message}`);
    }
});

/** Returns the tiers array if this event is tiered, otherwise null. */
function getTiers(ev) {
    return Array.isArray(ev.tiers) && ev.tiers.length > 0 ? ev.tiers : null;
}

/** The difficulty + features currently in view, whichever shape the event uses. */
function activeBlock(ev) {
    const tiers = getTiers(ev);
    if (!tiers) return { difficulty: ev.difficulty, features: ev.features || [], tier: ev.tier };
    const t = tiers[selectedTierIndex] || tiers[0];
    return { difficulty: t.difficulty, features: t.features || [], tier: t.tier };
}

function displayEvent() {
    const ev = currentEvent;
    const container = document.getElementById('event-content');
    const tiers = getTiers(ev);
    const block = activeBlock(ev);

    const tierToggle = tiers && tiers.length > 1 ? `
        <div class="tier-toggle">
            ${tiers.map((t, i) => `
                <button class="tier-btn ${i === selectedTierIndex ? 'active' : ''}" data-tier-index="${i}">
                    Tier ${escapeHtml(String(t.tier))}
                </button>
            `).join('')}
        </div>` : '';

    const html = `
        <div class="location-detail">
            <div class="location-header">
                <h1>${escapeHtml(ev.name)}</h1>
                <div class="location-type">${escapeHtml(`Tier ${block.tier} ${ev.category || 'Event'}`)}</div>
            </div>

            <div class="stat-block">
                <div class="description-block">
                    ${formatDescription(ev.description)}
                </div>

                ${ev.trigger ? `
                    <div class="trigger-block">
                        <strong class="block-label">Trigger</strong>
                        <div>${formatDescription(ev.trigger)}</div>
                    </div>
                ` : ''}

                ${tierToggle}

                <div style="margin: 0.5rem 0;">
                    <div class="meta-inline"><strong>Difficulty:</strong> ${escapeHtml(String(block.difficulty ?? '—'))}</div>
                </div>

                ${ev.impulses ? `<p class="stat-line"><strong>Impulses:</strong> <em>${escapeHtml(ev.impulses)}</em></p>` : ''}
                ${ev.potentialAdversaries ? `<p class="stat-line"><strong>Potential Adversaries:</strong> ${escapeHtml(ev.potentialAdversaries)}</p>` : ''}

                <h3 style="margin-top: 1rem; margin-bottom: 0.5rem; border-top: 0.1rem solid var(--border-color); padding-top: 0.5rem;">Features</h3>
                ${block.features.map(f => `
                    <div class="location-feature">
                        <div class="feature-header">
                            <strong style="color: var(--accent-amber); text-transform: uppercase; font-size: 0.9rem;">${escapeHtml(f.name)}</strong>
                            <span class="feature-type ${(f.type || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}">${escapeHtml(f.type || '')}</span>
                        </div>
                        <div style="margin: 0.25rem 0; font-size: 0.9rem;">${formatDescription(f.description)}</div>
                        ${f.questions ? `<div class="feature-questions">${formatDescription(f.questions)}</div>` : ''}
                    </div>
                `).join('')}

                ${ev.featureQuestions && ev.featureQuestions.length > 0 ? `
                    <div style="margin-top: 1rem; padding-top: 0.5rem; border-top: 0.1rem solid var(--border-color);">
                        <strong style="color: var(--accent-amber); text-transform: uppercase; font-size: 0.9rem;">Feature Questions</strong>
                        <ul style="margin-top: 0.25rem;">
                            ${ev.featureQuestions.map(q => `<li>${escapeHtml(q)}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    container.innerHTML = html;

    container.querySelectorAll('.tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedTierIndex = Number(btn.dataset.tierIndex);
            displayEvent();
        });
    });
}

function displayError(message) {
    document.getElementById('event-content').innerHTML = `
        <div class="loading">
            <h2>Error</h2>
            <p>${escapeHtml(message)}</p>
            <p><a href="events.html">← Return to Events</a></p>
        </div>
    `;
}
