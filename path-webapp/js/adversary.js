// Adversary detail page - Ultra compact stat block
let rawAdversaryData = null;

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const adversaryId = urlParams.get('id');

    if (!adversaryId) {
        displayError('No adversary specified');
        return;
    }

    try {
        let yamlText = null;

        for (const { path: folderPath } of ADVERSARY_FOLDERS) {
            const yamlPath = `${folderPath}${adversaryId}.yaml`;
            try {
                const response = await fetch(yamlPath);
                if (response.ok) {
                    yamlText = await response.text();
                    break;
                }
            } catch (error) {
                continue;
            }
        }

        if (!yamlText) {
            displayError(`Adversary "${adversaryId}" not found in any folder`);
            return;
        }

        // Parse first YAML document only (handles multi-doc files safely)
        const firstDoc = yamlText.split(/\n---/)[0];
        rawAdversaryData = jsyaml.load(firstDoc);

        const selectedTier = parseInt(urlParams.get('tier')) || null;
        renderAdversary(rawAdversaryData, selectedTier);
    } catch (error) {
        console.error('Full error:', error);
        displayError(`Failed to load adversary: ${error.message}`);
    }
});

function renderAdversary(raw, selectedTier) {
    if (!raw.tiers) {
        // Legacy single-tier format
        displayAdversary(raw, null);
        return;
    }

    const tierIndex = selectedTier
        ? raw.tiers.findIndex(t => t.tier === selectedTier)
        : 0;
    const tierData = raw.tiers[Math.max(0, tierIndex)];

    // Merge root identity fields with the selected tier's stats
    const adv = Object.assign({
        name: raw.name,
        category: raw.category,
        description: raw.description,
        motives: raw.motives,
        lore: raw.lore,
    }, tierData);

    // Sync URL to selected tier without a page reload
    const url = new URL(window.location);
    url.searchParams.set('tier', tierData.tier);
    history.replaceState(null, '', url);

    displayAdversary(adv, raw.tiers);
}

function selectTier(tierNum) {
    renderAdversary(rawAdversaryData, tierNum);
}

function displayAdversary(adv, allTiers) {
    const container = document.getElementById('adversary-content');

    const tierCategory = `Tier ${adv.tier} ${adv.category}`;

    // Format thresholds - handle both object {major, severe} and string formats
    let thresholdsText = 'None';
    if (adv.thresholds) {
        if (typeof adv.thresholds === 'object') {
            thresholdsText = `${adv.thresholds.major}/${adv.thresholds.severe}`;
        } else {
            thresholdsText = adv.thresholds;
        }
    }

    // Format experience - handle both array of objects and array of strings
    let experienceText = '';
    if (Array.isArray(adv.experience)) {
        if (adv.experience.length > 0 && typeof adv.experience[0] === 'object') {
            experienceText = adv.experience.map(exp => `${exp.name} (${exp.value})`).join(', ');
        } else {
            experienceText = adv.experience.join(', ');
        }
    }

    const tierSelector = allTiers ? `
        <div class="tier-selector">
            ${allTiers.map(t => `
                <button class="tier-btn ${t.tier === adv.tier ? 'active' : ''}"
                        onclick="selectTier(${t.tier})">T${t.tier}</button>
            `).join('')}
        </div>
    ` : '';

    const html = `
        <div class="adversary-detail">
            <div class="adversary-header">
                <h1>${adv.name}</h1>
                <div class="location-type">${tierCategory}</div>
                ${tierSelector}
            </div>

            <div class="stat-block">
                <div class="description-block">
                    ${adv.description}
                </div>

                <p class="stat-line"><strong>Motives & Tactics:</strong> ${adv.motives}</p>

                <div class="stat-grid">
                    <div class="stat-item">
                        <strong>Difficulty</strong>
                        <span>${adv.difficulty}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Thresholds</strong>
                        <span>${thresholdsText}</span>
                    </div>
                    <div class="stat-item">
                        <strong>HP</strong>
                        <span>${adv.hp}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Stress</strong>
                        <span>${adv.stress}</span>
                    </div>
                </div>

                ${adv.attack ? `
                <div class="attack-box">
                    <strong>ATK ${adv.attack.bonus} ${adv.attack.name}:</strong>
                    ${adv.attack.range} — ${adv.attack.damage}
                </div>
                ` : ''}

                <p class="stat-line"><strong>Experience:</strong> ${experienceText}</p>

                <h3 style="margin-top: 1rem; margin-bottom: 0.5rem; border-top: 0.1rem solid var(--danger-red); padding-top: 0.5rem;">Features</h3>
                ${adv.features.map(f => renderFeature(f)).join('')}

                ${adv.lore ? `
                    <div class="lore-block">
                        ${adv.lore}
                    </div>
                ` : ''}
            </div>
        </div>
    `;

    container.innerHTML = html;
}

function renderFeature(f) {
    let costText = '';
    if (f.cost) costText = ` (${escapeHtml(f.cost)})`;
    if (f.uses) costText += ` [Uses: ${f.uses}]`;

    return `
        <div style="margin: 0.75rem 0;">
            <div class="feature-header">
                <strong style="color: var(--accent-amber); text-transform: uppercase; font-size: 0.9rem;">${escapeHtml(f.name)}${costText}</strong>
                <span class="feature-type ${escapeHtml(f.type.toLowerCase().replace(/\s+/g, '-'))}">${escapeHtml(f.type)}</span>
            </div>
            <p style="margin: 0.25rem 0; font-size: 0.9rem;">${escapeHtml(f.description)}</p>
        </div>
    `;
}

function displayError(message) {
    const container = document.getElementById('adversary-content');
    container.innerHTML = `
        <div class="loading">
            <h2>Error</h2>
            <p>${message}</p>
            <p><a href="index.html">← Return to Path</a></p>
        </div>
    `;
}
