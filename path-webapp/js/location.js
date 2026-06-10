// Location detail page - Ultra compact display with journey encounters
let modifierDescriptions = {};

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('id');

    if (!locationId) {
        displayError('No location specified');
        return;
    }

    try {
        modifierDescriptions = await loadModifierDescriptions();

        let location = null;

        for (const { path: folderPath } of LOCATION_FOLDERS) {
            const yamlPath = `${folderPath}${locationId}.yaml`;
            try {
                const response = await fetch(yamlPath);
                if (response.ok) {
                    location = jsyaml.load(await response.text());
                    break;
                }
            } catch (error) {
                continue;
            }
        }

        if (!location) {
            displayError(`Location "${locationId}" not found in any folder`);
            return;
        }

        document.title = `${location.name} - The Path`;
        await displayLocation(location);
    } catch (error) {
        console.error('Full error:', error);
        displayError(`Failed to load location: ${error.message}`);
    }
});

async function displayLocation(loc) {
    const container = document.getElementById('location-content');

    // Load adversary data if there's a journey encounter
    let adversariesHTML = '';
    if (loc.journeyEncounter && loc.journeyEncounter.adversaries) {
        try {
            const adversaries = {};

            for (const advId of loc.journeyEncounter.adversaries) {
                for (const { path: folderPath } of ADVERSARY_FOLDERS) {
                    const yamlPath = `${folderPath}${advId}.yaml`;
                    try {
                        const response = await fetch(yamlPath);
                        if (response.ok) {
                            adversaries[advId] = jsyaml.load(await response.text());
                            break;
                        }
                    } catch (error) {
                        continue;
                    }
                }
            }

            adversariesHTML = `
                <h2 style="margin-top: 1.5rem;">Journey Encounter: ${loc.journeyEncounter.title}</h2>
                <p class="stat-line" style="font-style: italic; opacity: 0.9; margin-bottom: 1rem;">
                    ${loc.journeyEncounter.session ? `<strong>${loc.journeyEncounter.session}:</strong> ` : ''}
                    ${loc.journeyEncounter.direction ? `<strong>Direction:</strong> ${loc.journeyEncounter.direction} — ` : ''}
                    ${loc.journeyEncounter.note || ''}
                </p>

                <div class="adversary-grid">
                ${loc.journeyEncounter.adversaries.map(advId => {
                    const adv = adversaries[advId];
                    if (!adv) return '';
                    const tierCategory = `Tier ${adv.tier} ${adv.category}`;
                    return `
                        <div class="stat-block" style="border-color: var(--danger-red);">
                            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                                <h1 style="color: var(--danger-red); font-size: 1.5rem; font-weight: 700; text-transform: uppercase; margin: 0;">${adv.name}</h1>
                                <div class="location-type" style="margin: 0;">${tierCategory}</div>
                            </div>

                            <div class="description-block">
                                ${formatDescription(adv.description)}
                            </div>

                            <p class="stat-line"><strong>Motives & Tactics:</strong> ${adv.motives}</p>

                            <div class="stat-grid">
                                <div class="stat-item">
                                    <strong>Difficulty</strong>
                                    <span>${adv.difficulty}</span>
                                </div>
                                <div class="stat-item">
                                    <strong>Thresholds</strong>
                                    <span>${adv.thresholds}</span>
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
                            </div>` : ''}

                            <p class="stat-line"><strong>Experience:</strong> ${adv.experience.join(', ')}</p>

                            <h3 style="margin-top: 1rem; margin-bottom: 0.5rem; border-top: 0.1rem solid var(--danger-red); padding-top: 0.5rem;">Features</h3>
                            ${adv.features.map(f => `
                                <div style="margin: 0.75rem 0;">
                                    <div class="feature-header">
                                        <strong style="color: var(--accent-amber); text-transform: uppercase; font-size: 0.9rem;">${f.name}</strong>
                                        <span class="feature-type ${f.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${f.type}</span>
                                    </div>
                                    <p style="margin: 0.25rem 0; font-size: 0.9rem;">${f.description}</p>
                                </div>
                            `).join('')}

                            ${adv.lore ? `
                                <div class="lore-block">
                                    ${adv.lore}
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Failed to load adversaries:', error);
        }
    } else if (loc.journeyEncounter) {
        adversariesHTML = `
            <h2 style="margin-top: 1.5rem;">Journey Encounter: ${loc.journeyEncounter.title}</h2>
            <div class="stat-block" style="border-color: var(--danger-red);">
                ${loc.journeyEncounter.session ? `<p class="stat-line"><strong>${loc.journeyEncounter.session}</strong></p>` : ''}
                ${loc.journeyEncounter.direction ? `<p class="stat-line" style="font-style: italic; opacity: 0.9;"><strong>Direction:</strong> ${loc.journeyEncounter.direction}</p>` : ''}
                <div style="font-size: 0.9rem; margin: 0.5rem 0;">${formatDescription(loc.journeyEncounter.note)}</div>
            </div>
        `;
    }

    const html = `
        <div class="location-detail">
            <div class="location-header">
                <h1>${loc.name}</h1>
                <div class="location-type">${loc.tier}</div>
            </div>

            <div class="stat-block">
                <div class="description-block">
                    ${formatDescription(loc.description)}
                </div>

                <div style="margin: 0.5rem 0;">
                    <div class="meta-inline"><strong>Difficulty:</strong> ${loc.difficulty}</div>
                    <div class="meta-inline"><strong>Modifiers:</strong> ${loc.modifiers.map(m => {
                        const modName = typeof m === 'object' ? m.name : m;
                        const modData = modifierDescriptions[modName.toLowerCase()];
                        const tooltip = modData ? modData.description.trim() : '';
                        return `<span class="tag modifier-tooltip" data-tooltip="${escapeHtml(tooltip)}">${modName}</span>`;
                    }).join('')}</div>
                </div>

                <p class="stat-line"><strong>Impulses:</strong> <em>${loc.impulses}</em></p>
                <p class="stat-line"><strong>Potential Adversaries:</strong> ${loc.potentialAdversaries}</p>

                <h3 style="margin-top: 1rem; margin-bottom: 0.5rem; border-top: 0.1rem solid var(--border-color); padding-top: 0.5rem;">Features</h3>
                ${loc.features.map(f => `
                    <div class="location-feature">
                        <div class="feature-header">
                            <strong style="color: var(--accent-amber); text-transform: uppercase; font-size: 0.9rem;">${f.name}</strong>
                            <span class="feature-type ${f.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${f.type}</span>
                        </div>
                        <div style="margin: 0.25rem 0; font-size: 0.9rem;">${formatDescription(f.description)}</div>
                        ${f.questions ? `<div class="feature-questions">${formatDescription(f.questions)}</div>` : ''}
                    </div>
                `).join('')}

                ${loc.featureQuestions && loc.featureQuestions.length > 0 ? `
                    <div style="margin-top: 1rem; padding-top: 0.5rem; border-top: 0.1rem solid var(--border-color);">
                        <strong style="color: var(--accent-amber); text-transform: uppercase; font-size: 0.9rem;">Feature Questions</strong>
                        <ul style="margin-top: 0.25rem;">
                            ${loc.featureQuestions.map(q => `<li>${q}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>

            ${adversariesHTML}
        </div>
    `;

    container.innerHTML = html;
}

function displayError(message) {
    const container = document.getElementById('location-content');
    container.innerHTML = `
        <div class="loading">
            <h2>Error</h2>
            <p>${message}</p>
            <p><a href="index.html">← Return to Path</a></p>
        </div>
    `;
}

