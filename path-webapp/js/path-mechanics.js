// Path Mechanics page - Load and display YAML mechanics reference
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the YAML file
        // Use absolute path from server root (starting with /)
        const response = await fetch('../the-path-campaign/mechanics/path-mechanics.yaml');
        const yamlText = await response.text();

        // Parse YAML
        const data = jsyaml.load(yamlText);

        // Update subtitle with version
        const versionSubtitle = document.getElementById('version-subtitle');
        if (versionSubtitle) {
            versionSubtitle.textContent = `Version ${data.version}`;
        }

        // Render the mechanics content
        displayMechanics(data);
    } catch (error) {
        displayError(`Failed to load path mechanics: ${error.message}`);
    }
});

function displayMechanics(data) {
    const container = document.getElementById('mechanics-content');

    let html = '';

    // Introduction
    if (data.introduction) {
        html += `
            <section class="mechanics-section" id="introduction">
                <h2>Introduction</h2>
                <div class="mechanics-description">${escapeHtml(data.introduction)}</div>
            </section>
        `;
    }

    // Path Locations
    if (data.pathLocations) {
        html += `
            <section class="mechanics-section" id="path-locations">
                <h2>Path Locations</h2>
                <div class="mechanics-description">${escapeHtml(data.pathLocations.description)}</div>
                ${data.pathLocations.cardMappingExamples ? `
                    <h3>Card Mapping Examples</h3>
                    <div class="mechanics-description">${escapeHtml(data.pathLocations.cardMappingExamples)}</div>
                ` : ''}
            </section>
        `;
    }

    // Grid System
    if (data.gridSystem) {
        html += `
            <section class="mechanics-section" id="grid-system">
                <h2>Grid System</h2>
                <div class="mechanics-description">${escapeHtml(data.gridSystem.description)}</div>

                ${data.gridSystem.stableLocations ? `
                    <h3>Stable Locations</h3>
                    <div class="mechanics-description">${escapeHtml(data.gridSystem.stableLocations)}</div>
                ` : ''}

                ${data.gridSystem.undergroundLocations ? `
                    <h3>Underground Locations</h3>
                    <div class="mechanics-description">${escapeHtml(data.gridSystem.undergroundLocations)}</div>
                ` : ''}
            </section>
        `;
    }

    // Placement Method
    if (data.placementMethod) {
        html += `
            <section class="mechanics-section" id="placement-method">
                <h2>Placement Method</h2>
                <div class="mechanics-description">${escapeHtml(data.placementMethod.description)}</div>
        `;

        if (data.placementMethod.methods && Array.isArray(data.placementMethod.methods)) {
            data.placementMethod.methods.forEach(method => {
                html += `
                    <h3>${escapeHtml(method.name)}</h3>
                    <div class="mechanics-description">${escapeHtml(method.description)}</div>
                `;
            });
        }

        if (data.placementMethod.placementRules) {
            html += `<div class="mechanics-description">${escapeHtml(data.placementMethod.placementRules)}</div>`;
        }

        if (data.placementMethod.recommendation) {
            html += `
                <h3>Recommendation for New Campaigns</h3>
                <div class="mechanics-description">${escapeHtml(data.placementMethod.recommendation)}</div>
            `;
        }

        html += `</section>`;
    }

    // Example Path Creation
    if (data.examplePathCreation) {
        html += `
            <section class="mechanics-section" id="example-path-creation">
                <h2>Example Path Creation</h2>
        `;

        if (data.examplePathCreation.steps && Array.isArray(data.examplePathCreation.steps)) {
            html += `<ul class="step-list">`;
            data.examplePathCreation.steps.forEach(step => {
                html += `
                    <li>
                        <span class="step-number">Step ${step.step}:</span>
                        <strong>${escapeHtml(step.name)}</strong>
                        <div>${escapeHtml(step.description)}</div>
                    </li>
                `;
            });
            html += `</ul>`;
        }

        if (data.examplePathCreation.session1Example) {
            html += `
                <h3>Session 1 Example - Starting Simple</h3>
                <div class="example-grid">${escapeHtml(data.examplePathCreation.session1Example.description)}</div>
            `;
        }

        if (data.examplePathCreation.session2Example) {
            html += `
                <h3>Session 2 Example - Adding Complexity</h3>
                <div class="example-grid">${escapeHtml(data.examplePathCreation.session2Example.description)}</div>
            `;
        }

        html += `</section>`;
    }

    // Modifiers
    if (data.modifiers) {
        html += `
            <section class="mechanics-section" id="modifiers">
                <h2>Modifiers</h2>
                ${data.modifiers.description ? `<div class="mechanics-description">${escapeHtml(data.modifiers.description)}</div>` : ''}
        `;

        // Group modifiers by type
        const modifiersByType = {};
        if (data.modifiers.list && Array.isArray(data.modifiers.list)) {
            data.modifiers.list.forEach(mod => {
                if (!modifiersByType[mod.type]) {
                    modifiersByType[mod.type] = [];
                }
                modifiersByType[mod.type].push(mod);
            });
        }

        // Render each modifier type with its modifiers
        if (data.modifiers.types) {
            // Define the order of types
            const typeOrder = ['locationPersistence', 'verticalNavigation', 'corruptionAndProtection', 'environmentalAndEncounter', 'specialPlacement', 'other'];

            typeOrder.forEach(typeName => {
                const type = data.modifiers.types[typeName];
                if (type) {
                    const typeId = 'modifiers-' + typeName.replace(/([A-Z])/g, '-$1').toLowerCase();
                    html += `
                        <h3 id="${typeId}">${formatTypeName(typeName)}</h3>
                        <div class="mechanics-description">${escapeHtml(type.description)}</div>
                    `;

                    // Render modifiers of this type
                    if (modifiersByType[typeName]) {
                        html += `<div class="modifier-list" style="margin-top: 1rem;">`;

                        modifiersByType[typeName].forEach(mod => {
                            html += `
                                <div class="modifier-item">
                                    <h4>
                                        ${escapeHtml(mod.name)}
                                        ${mod.valueRange ? `<span class="modifier-value-range">(${escapeHtml(mod.valueRange)})</span>` : ''}
                                        ${mod.requiresValue ? `<span class="modifier-value-range">(requires value)</span>` : ''}
                                    </h4>
                                    <div class="mechanics-description">${escapeHtml(mod.description)}</div>
                                    ${mod.counterplay ? `
                                        <div class="mechanics-description" style="margin-top: 0.5rem; font-style: italic; opacity: 0.9;">
                                            <strong>Counterplay:</strong> ${escapeHtml(mod.counterplay)}
                                        </div>
                                    ` : ''}
                                </div>
                            `;
                        });

                        html += `</div>`;
                    }
                }
            });
        }

        html += `</section>`;
    }

    // Session Tracking
    if (data.sessionTracking) {
        html += `
            <section class="mechanics-section" id="session-tracking">
                <h2>Session Tracking</h2>
                <div class="mechanics-description">${escapeHtml(data.sessionTracking.description)}</div>
        `;

        if (data.sessionTracking.trackingCategories) {
            data.sessionTracking.trackingCategories.forEach(category => {
                html += `
                    <h3>${escapeHtml(category.name)}</h3>
                    <div class="mechanics-description">${escapeHtml(category.description)}</div>
                `;

                if (category.examples && Array.isArray(category.examples)) {
                    category.examples.forEach(example => {
                        html += `
                            <h4>Session ${example.session} Example${example.note ? '' : ''}</h4>
                            ${example.surfaceGrid ? `
                                <div class="example-grid">
                                    <strong>Surface Grid:</strong>
                                    ${escapeHtml(example.surfaceGrid)}
                                </div>
                            ` : ''}
                            ${example.undergroundGrid ? `
                                <div class="example-grid">
                                    <strong>Underground Grid:</strong>
                                    ${escapeHtml(example.undergroundGrid)}
                                </div>
                            ` : ''}
                            ${example.note ? `
                                <div class="mechanics-description">${escapeHtml(example.note)}</div>
                            ` : ''}
                        `;
                    });
                }
            });
        }

        html += `</section>`;
    }

    // Mist Mechanics
    if (data.mistMechanics) {
        html += `
            <section class="mechanics-section" id="mist-mechanics">
                <h2>Mist Mechanics</h2>
                <div class="mechanics-description">${escapeHtml(data.mistMechanics.description)}</div>
        `;

        // Mist-Touched Locations
        if (data.mistMechanics.mistTouchedLocations) {
            html += `
                <h3>Mist-Touched Locations</h3>
                <div class="mechanics-description">${escapeHtml(data.mistMechanics.mistTouchedLocations.description)}</div>
            `;

            if (data.mistMechanics.mistTouchedLocations.quickReference) {
                const ref = data.mistMechanics.mistTouchedLocations.quickReference;
                html += `
                    <div class="quick-reference">
                        <h4>Quick Reference</h4>
                        ${ref.howLocationsBecomeMe ? `
                            <strong>How locations become Mist-Touched:</strong>
                            <ul>
                                ${ref.howLocationsBecomeMe.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
                            </ul>
                        ` : ''}
                        ${ref.effects ? `
                            <strong>Effects:</strong>
                            <ul>
                                ${ref.effects.visibility ? `<li><strong>Visibility:</strong> ${escapeHtml(ref.effects.visibility)}</li>` : ''}
                                ${ref.effects.encounters ? `<li><strong>Encounters:</strong> ${escapeHtml(ref.effects.encounters)}</li>` : ''}
                                ${ref.effects.restPenalties ? `
                                    <li><strong>Rest Penalties:</strong>
                                        <ul>
                                            ${ref.effects.restPenalties.shortRest ? `<li>Short Rest: ${escapeHtml(ref.effects.restPenalties.shortRest.effect)}</li>` : ''}
                                            ${ref.effects.restPenalties.longRest ? `<li>Long Rest: ${escapeHtml(ref.effects.restPenalties.longRest.effect)}</li>` : ''}
                                        </ul>
                                    </li>
                                ` : ''}
                                ${ref.effects.gmDiscretion ? `<li><strong>GM Discretion:</strong> ${escapeHtml(ref.effects.gmDiscretion)}</li>` : ''}
                            </ul>
                        ` : ''}
                    </div>
                `;
            }
        }

        // Off-Path Travel
        if (data.mistMechanics.offPathTravel) {
            html += `
                <h3>Off-Path Travel</h3>
                <div class="mechanics-description">${escapeHtml(data.mistMechanics.offPathTravel.description)}</div>
            `;

            if (data.mistMechanics.offPathTravel.procedure) {
                html += `
                    <div class="quick-reference">
                        <h4>Off-Path Travel Procedure</h4>
                        <ol>
                            ${data.mistMechanics.offPathTravel.procedure.map(step =>
                                `<li><strong>Step ${step.step}:</strong> ${escapeHtml(step.description)}</li>`
                            ).join('')}
                        </ol>
                        ${data.mistMechanics.offPathTravel.remember ? `
                            <p style="margin-top: 1rem;"><strong>Remember:</strong> ${escapeHtml(data.mistMechanics.offPathTravel.remember)}</p>
                        ` : ''}
                    </div>
                `;
            }
        }

        // Mist Corruption
        if (data.mistMechanics.mistCorruption) {
            html += `
                <h3>Mist Corruption</h3>
                <div class="mechanics-description">${escapeHtml(data.mistMechanics.mistCorruption.description)}</div>
            `;

            if (data.mistMechanics.mistCorruption.gainingMistTokens) {
                html += `
                    <div class="quick-reference">
                        <h4>Gaining Mist Tokens</h4>
                        <ul>
                            ${data.mistMechanics.mistCorruption.gainingMistTokens.map(source => {
                                let text = `<strong>${escapeHtml(source.source)}:</strong> `;
                                if (source.tokens) {
                                    if (typeof source.tokens === 'object') {
                                        text += `Short Rest: ${source.tokens.shortRest} tokens, Long Rest: ${source.tokens.longRest} tokens`;
                                    } else {
                                        text += `${source.tokens} token${source.tokens > 1 ? 's' : ''}`;
                                    }
                                }
                                if (source.description) {
                                    text += escapeHtml(source.description);
                                }
                                if (source.fearCost) {
                                    text += `${source.fearCost} Fear → ${source.tokens} token (${source.note})`;
                                    if (source.offPathCost) {
                                        text += ` (${source.offPathCost} Fear when off-Path)`;
                                    }
                                }
                                return `<li>${text}</li>`;
                            }).join('')}
                        </ul>
                    </div>
                `;
            }

            if (data.mistMechanics.mistCorruption.corruptionEffects) {
                const effects = data.mistMechanics.mistCorruption.corruptionEffects;
                html += `
                    <h4>Corruption Effects</h4>
                    <div class="mechanics-description">${escapeHtml(effects.description)}</div>
                `;

                if (effects.tiers) {
                    effects.tiers.forEach(tier => {
                        html += `
                            <div class="corruption-tier">
                                <span class="corruption-tier-range">${escapeHtml(tier.tokenRange)} Tokens:</span>
                                ${escapeHtml(tier.effect)}
                            </div>
                        `;
                    });
                }
            }
        }

        html += `</section>`;
    }

    // Fear Spending Options
    if (data.fearSpendingOptions) {
        html += `
            <section class="mechanics-section" id="fear-spending">
                <h2>Fear Spending Options</h2>
        `;

        if (data.fearSpendingOptions.mist) {
            html += `
                <h3>Mist</h3>
                <div class="fear-cost-table">
            `;

            data.fearSpendingOptions.mist.forEach(option => {
                html += `
                    <div class="fear-cost-item">
                        <div class="fear-cost">${option.cost} Fear</div>
                        <div>
                            <div class="fear-effect">${escapeHtml(option.effect)}</div>
                            ${option.timing ? `<div class="fear-condition">Timing: ${escapeHtml(option.timing)}</div>` : ''}
                            ${option.condition ? `<div class="fear-condition">Condition: ${escapeHtml(option.condition)}</div>` : ''}
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        if (data.fearSpendingOptions.stress) {
            html += `
                <h3>Stress</h3>
                <div class="fear-cost-table">
            `;

            data.fearSpendingOptions.stress.forEach(option => {
                html += `
                    <div class="fear-cost-item">
                        <div class="fear-cost">${option.cost} Fear</div>
                        <div>
                            <div class="fear-effect">${escapeHtml(option.effect)}</div>
                            ${option.condition ? `<div class="fear-condition">Condition: ${escapeHtml(option.condition)}</div>` : ''}
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        if (data.fearSpendingOptions.location) {
            html += `
                <h3>Location</h3>
                <div class="fear-cost-table">
            `;

            data.fearSpendingOptions.location.forEach(option => {
                html += `
                    <div class="fear-cost-item">
                        <div class="fear-cost">${option.cost} Fear</div>
                        <div>
                            <div class="fear-effect">${escapeHtml(option.effect)}</div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
        }

        html += `</section>`;
    }

    // Flame Mechanics
    if (data.flameMechanics) {
        html += `
            <section class="mechanics-section" id="flame-mechanics">
                <h2>Flame Mechanics</h2>
        `;

        if (data.flameMechanics.extractionAndTravel) {
            const ext = data.flameMechanics.extractionAndTravel;

            if (ext.flameCanisters) {
                html += `
                    <h3>Flame Canisters</h3>
                    <div class="mechanics-description">${escapeHtml(ext.flameCanisters.description)}</div>
                `;
            }

            if (ext.flameEssenceExtraction) {
                html += `
                    <h3>Flame Essence Extraction</h3>
                    <div class="mechanics-description">${escapeHtml(ext.flameEssenceExtraction.description)}</div>
                `;

                if (ext.flameEssenceExtraction.extractionCost) {
                    html += `
                        <div class="flame-gain">
                            <strong>Extraction Cost:</strong> GM gains ${ext.flameEssenceExtraction.extractionCost.fearGained} Fear
                            ${ext.flameEssenceExtraction.extractionCost.reason ? ` (${escapeHtml(ext.flameEssenceExtraction.extractionCost.reason)})` : ''}
                        </div>
                    `;
                }

                if (ext.flameEssenceExtraction.uses) {
                    html += `
                        <strong>Uses:</strong>
                        <ul>
                            ${ext.flameEssenceExtraction.uses.map(use => `<li>${escapeHtml(use)}</li>`).join('')}
                        </ul>
                    `;
                }
            }
        }

        if (data.flameMechanics.cleansingMistCorruption) {
            const cleanse = data.flameMechanics.cleansingMistCorruption;
            html += `
                <h3>Cleansing Mist Corruption</h3>
                <div class="mechanics-description"><strong>Location:</strong> ${escapeHtml(cleanse.location)}</div>
            `;

            if (cleanse.methods) {
                html += `
                    <ul>
                        ${cleanse.methods.shortRest ? `<li><strong>Short Rest:</strong> Remove ${escapeHtml(cleanse.methods.shortRest.tokensRemoved)} Mist tokens</li>` : ''}
                        ${cleanse.methods.longRest ? `<li><strong>Long Rest:</strong> Remove ${escapeHtml(cleanse.methods.longRest.tokensRemoved)} Mist tokens</li>` : ''}
                    </ul>
                `;
            }

            if (cleanse.note) {
                html += `<div class="mechanics-description" style="font-style: italic; opacity: 0.9;">${escapeHtml(cleanse.note)}</div>`;
            }
        }

        if (data.flameMechanics.fearGains) {
            html += `
                <h3>Fear Gains</h3>
            `;

            data.flameMechanics.fearGains.forEach(gain => {
                html += `
                    <div class="flame-gain">
                        <strong>Trigger:</strong> ${escapeHtml(gain.trigger)}<br>
                        <strong>GM Gains:</strong> ${gain.fearGained} Fear
                    </div>
                `;
            });
        }

        html += `</section>`;
    }

    // Notes
    if (data.notes && Array.isArray(data.notes)) {
        html += `
            <section class="mechanics-section">
                <h2>Notes</h2>
                <ul>
                    ${data.notes.map(note => `<li>${escapeHtml(note)}</li>`).join('')}
                </ul>
            </section>
        `;
    }

    container.innerHTML = html;
}

function displayError(message) {
    const container = document.getElementById('mechanics-content');
    container.innerHTML = `
        <div style="background: rgba(196, 69, 54, 0.2); border: 0.15rem solid var(--danger-red); border-radius: 0.2rem; padding: 1.5rem; text-align: center;">
            <h2 style="color: var(--danger-red); margin-top: 0;">Error</h2>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

function formatTypeName(camelCase) {
    // Convert camelCase to Title Case
    // locationPersistence → Location Persistence
    return camelCase
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
        .trim();
}
