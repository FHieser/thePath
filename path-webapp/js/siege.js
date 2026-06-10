// Siege Mechanics page - Load and display siege YAML data, NPC defenders, and adversaries
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load all data sources in parallel
        const [mechanicsResponse, npcResponse] = await Promise.all([
            fetch('../the-path-campaign/village-siege/siege-mechanics.yaml'),
            fetch('../the-path-campaign/village-siege/npc-defenders.yaml')
        ]);

        const mechanicsYaml = await mechanicsResponse.text();
        const npcYaml = await npcResponse.text();

        const mechanics = jsyaml.load(mechanicsYaml);
        const npcData = jsyaml.load(npcYaml);

        // Load adversaries from siege folder
        const adversaries = await loadSiegeAdversaries();

        // Update subtitle
        const versionSubtitle = document.getElementById('version-subtitle');
        if (versionSubtitle) {
            versionSubtitle.textContent = `Version ${mechanics.version}`;
        }

        // Render all content
        displaySiege(mechanics, npcData, adversaries);
    } catch (error) {
        displayError(`Failed to load siege mechanics: ${error.message}`);
    }
});

async function loadSiegeAdversaries() {
    const adversaries = [];

    // Try to discover files from the siege adversaries folder
    const siegeAdversaryPath = '../the-path-campaign/village-siege/adversaries/';

    const filenames = await discoverYamlFiles(siegeAdversaryPath);
    const loadPromises = filenames.map(async filename => {
        try {
            const advResponse = await fetch(`${siegeAdversaryPath}${filename}`);
            if (advResponse.ok) {
                const firstDoc = (await advResponse.text()).split(/\n---/)[0];
                const data = jsyaml.load(firstDoc);
                return { filename, data };
            }
        } catch (e) {
            console.warn(`Failed to load ${filename}:`, e);
        }
        return null;
    });
    (await Promise.all(loadPromises)).filter(Boolean).forEach(r => adversaries.push(r));

    // Explicitly load siege adversaries from the main adversaries/siege folder
    const siegeAdversaryFiles = [
        'mist-anchor.yaml',
        'pale-shell-drifter-leviathan.yaml',
        'giant-cloud-drifter.yaml'
    ];

    for (const filename of siegeAdversaryFiles) {
        try {
            const response = await fetch(`../the-path-campaign/adversaries/siege/${filename}`);
            if (response.ok) {
                const yamlText = await response.text();
                const firstDoc = yamlText.split(/\n---/)[0];
                const data = jsyaml.load(firstDoc);
                adversaries.push({ filename, data });
            }
        } catch (error) {
            console.warn(`Could not load ${filename}:`, error);
        }
    }

    return adversaries;
}

function displaySiege(mechanics, npcData, adversaries) {
    const container = document.getElementById('siege-content');
    let html = '';

    // Siege Trigger
    html += renderSiegeTrigger(mechanics.siegeTrigger);

    // Victory & Loss Conditions (top-level)
    html += renderConditions(mechanics.victoryConditions, mechanics.lossConditions);

    // Siege Phases (each phase renders its own sub-content)
    html += renderSiegePhases(mechanics.siegePhases);

    // NPC Defenders
    html += renderNPCDefenders(npcData);

    // Siege Adversaries
    html += renderSiegeAdversaries(adversaries);

    container.innerHTML = html;
}

function renderSiegeTrigger(trigger) {
    if (!trigger) return '';
    return `
        <section class="mechanics-section" id="siege-trigger">
            <h2>Siege Trigger</h2>
            <div class="mechanics-description">${escapeHtml(trigger.description)}</div>
        </section>
    `;
}

function renderZoneLayout(layout) {
    if (!layout) return '';
    let html = `
        <div class="phase-subsection">
            <h3>Zone Layout</h3>
            <div class="mechanics-description">${escapeHtml(layout.description)}</div>
    `;

    if (layout.zones) {
        layout.zones.forEach(zone => {
            const isMistTouched = zone.mistStatus && zone.mistStatus.toLowerCase().includes('always');
            const statusClass = isMistTouched ? 'mist-touched' : 'protected';

            html += `
                <div class="zone-card">
                    <h4>${escapeHtml(zone.name)} <span style="font-size: 0.85rem; color: var(--text-light); opacity: 0.7;">(${escapeHtml(zone.position)})</span></h4>
                    ${zone.count ? `<div style="font-size: 0.85rem; margin-bottom: 0.5rem;">${zone.count} zones${zone.directions ? ': ' + escapeHtml(zone.directions) : ''}</div>` : ''}
                    <div style="margin-bottom: 0.5rem;">${escapeHtml(zone.description)}</div>
                    ${zone.mistStatus ? `<span class="zone-status ${statusClass}">${escapeHtml(zone.mistStatus)}</span>` : ''}
                    ${zone.onEnemyReach ? renderOnEnemyReach(zone.onEnemyReach) : ''}
                </div>
            `;
        });
    }

    if (layout.connections) {
        html += `
            <h4>Zone Connections</h4>
            <ul>
                ${layout.connections.map(c => `<li>${escapeHtml(c)}</li>`).join('')}
            </ul>
        `;
    }

    html += `</div>`;
    return html;
}

function renderOnEnemyReach(onEnemyReach) {
    if (typeof onEnemyReach === 'string') {
        return `<div style="margin-top: 0.5rem; color: var(--danger-red); font-weight: 600;">${escapeHtml(onEnemyReach)}</div>`;
    }
    let html = `<div style="margin-top: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem;">`;
    if (onEnemyReach.nonLeviathan) {
        html += `<div style="color: var(--danger-red); font-weight: 600;"><strong>Non-Leviathan:</strong> ${escapeHtml(onEnemyReach.nonLeviathan)}</div>`;
    }
    if (onEnemyReach.leviathan) {
        html += `<div style="color: var(--accent-amber); font-weight: 600;"><strong>Leviathan:</strong> ${escapeHtml(onEnemyReach.leviathan)}</div>`;
    }
    html += `</div>`;
    return html;
}

function renderTurnStructure(turn) {
    if (!turn) return '';
    let html = `
        <div class="phase-subsection">
            <h3>Turn Structure</h3>
            <div class="mechanics-description">${escapeHtml(turn.description)}</div>
    `;

    if (turn.phases) {
        turn.phases.forEach(phase => {
            html += `
                <div class="phase-card">
                    <h4>${phase.order}. ${escapeHtml(phase.name)}</h4>
                    <div>${escapeHtml(phase.description)}</div>
                </div>
            `;
        });
    }

    if (turn.combatEngagement) {
        html += `
            <div style="background: rgba(196, 69, 54, 0.15); border: 0.15rem solid var(--danger-red); border-radius: 0.2rem; padding: 1rem; margin-top: 1rem;">
                <h4 style="color: var(--danger-red); margin-top: 0;">Combat Engagement Rule</h4>
                <div>${escapeHtml(turn.combatEngagement)}</div>
            </div>
        `;
    }

    html += `</div>`;
    return html;
}

function renderHopeFromVictory(hope) {
    if (!hope) return '';
    return `
        <div class="phase-subsection">
            <h3>Hope Economy</h3>
            <div style="background: rgba(74, 107, 82, 0.15); border-left: 0.3rem solid var(--success-green); padding: 1rem; border-radius: 0.2rem;">
                <div style="margin-bottom: 0.5rem;"><strong>Trigger:</strong> ${escapeHtml(hope.trigger)}</div>
                <div style="color: var(--success-green); font-weight: 700; font-size: 1.1rem;">${escapeHtml(hope.effect)}</div>
            </div>
        </div>
    `;
}

function renderStartingForces(forces) {
    if (!forces) return '';
    let html = `
        <div class="phase-subsection">
            <h3>Starting Forces</h3>
            <div class="mechanics-description">${escapeHtml(forces.description)}</div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-amber); margin: 1rem 0;">
                Total Battle Points = ${escapeHtml(forces.formula)}
            </div>
    `;

    if (forces.examples) {
        html += `
            <table class="bp-table">
                <thead>
                    <tr>
                        <th>Party Size</th>
                        <th>Total BP</th>
                    </tr>
                </thead>
                <tbody>
                    ${forces.examples.map(ex => `
                        <tr>
                            <td>${ex.partySize} PCs</td>
                            <td><span class="bp-value">${ex.totalBP} BP</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    html += `
        <div style="margin-top: 1rem;">
            <strong style="color: var(--danger-red);">Siege Engine Cost:</strong> ${forces.siegeEngineCost} BP
        </div>
        <div style="margin-top: 0.5rem; font-size: 0.9rem; opacity: 0.9;">${escapeHtml(forces.siegeEngineNote)}</div>
    `;

    if (forces.placementConstraint) {
        html += `
            <h4>Enemy Placement Constraint</h4>
            <div class="mechanics-description">${escapeHtml(forces.placementConstraint)}</div>
        `;
    }

    html += `</div>`;
    return html;
}

function renderFearEconomy(fear) {
    if (!fear) return '';
    let html = `
        <div class="phase-subsection">
            <h3>Fear Economy</h3>
    `;

    // Generation
    if (fear.generation) {
        html += `
            <h4>Fear Generation</h4>
            <div class="mechanics-description">${escapeHtml(fear.generation.description)}</div>
            <div class="fear-cost-table">
                ${fear.generation.sources.map(source => `
                    <div class="fear-cost-item">
                        <div class="fear-cost">+${source.fear} Fear</div>
                        <div>${escapeHtml(source.name)}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Spending
    if (fear.spending) {
        html += `
            <h4>Fear Spending: Summon Reinforcements</h4>
            <div class="mechanics-description">${escapeHtml(fear.spending.description)}</div>
            <div class="fear-cost-table">
                <div class="fear-cost-item" style="font-weight: 700; border-bottom: 0.15rem solid rgba(196, 69, 54, 0.4);">
                    <div>Fear Spent</div>
                    <div>BP Gained</div>
                </div>
                ${fear.spending.table.map(row => `
                    <div class="fear-cost-item">
                        <div class="fear-cost">${row.fearSpent} Fear</div>
                        <div><span class="bp-value">${row.bpGained} BP</span></div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (fear.endCondition) {
        html += `
            <h3>Siege End Condition</h3>
            <div style="background: rgba(74, 107, 82, 0.2); border-left: 0.3rem solid var(--success-green); padding: 1rem; border-radius: 0.2rem;">
                ${escapeHtml(fear.endCondition)}
            </div>
        `;
    }

    html += `</div>`;
    return html;
}

function renderSiegePhases(phases) {
    if (!phases) return '';
    let html = '';

    phases.forEach((phase, index) => {
        const phaseId = `phase-${index + 1}`;
        html += `
            <section class="mechanics-section" id="${phaseId}">
                <h2>${escapeHtml(phase.name)}</h2>
                <div class="phase-trigger" style="margin-bottom: 0.75rem;">
                    <strong>Trigger:</strong> ${escapeHtml(phase.trigger)} | <strong>Ends:</strong> ${escapeHtml(phase.ends)}
                </div>
                <div class="mechanics-description">${escapeHtml(phase.description)}</div>
                ${phase.zoneLayout ? renderZoneLayout(phase.zoneLayout) : ''}
                ${phase.startingForces ? renderStartingForces(phase.startingForces) : ''}
                ${phase.turnStructure ? renderTurnStructure(phase.turnStructure) : ''}
                ${phase.hopeEconomy ? renderHopeFromVictory(phase.hopeEconomy) : ''}
                ${phase.fearEconomy ? renderFearEconomy(phase.fearEconomy) : ''}
            </section>
        `;
    });

    return html;
}

function renderConditions(victory, loss) {
    let html = `
        <section class="mechanics-section" id="victory-loss">
            <h2>Victory &amp; Loss Conditions</h2>
    `;

    if (victory) {
        html += `<h3>Victory Conditions</h3>`;
        victory.forEach(cond => {
            html += `
                <div class="condition-card victory">
                    <h4 style="color: var(--success-green); margin-top: 0;">${escapeHtml(cond.name)}</h4>
                    <ul>
                        ${cond.requirements.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
    }

    if (loss) {
        html += `<h3>Loss Conditions</h3>`;
        loss.forEach(cond => {
            html += `
                <div class="condition-card loss">
                    <h4 style="color: var(--danger-red); margin-top: 0;">${escapeHtml(cond.name)}</h4>
                    <div style="margin-bottom: 0.5rem;"><strong>Trigger:</strong> ${escapeHtml(cond.trigger)}</div>
                    <ul>
                        ${cond.effects.map(e => `<li>${escapeHtml(e)}</li>`).join('')}
                    </ul>
                </div>
            `;
        });
    }

    html += `</section>`;
    return html;
}

function renderNPCDefenders(npcData) {
    if (!npcData) return '';
    let html = `
        <section class="mechanics-section" id="npc-defenders">
            <h2>NPC Defenders</h2>
            <div class="mechanics-description">${escapeHtml(npcData.description)}</div>
    `;

    // Deployment rules
    if (npcData.deployment) {
        html += `<h3>Deployment</h3>`;
        if (npcData.deployment.howToDeploy) {
            html += `
                <ol>
                    ${npcData.deployment.howToDeploy.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
                </ol>
            `;
        }
        if (npcData.deployment.timing) {
            html += `<div class="npc-stat-line"><strong>Timing:</strong> ${escapeHtml(npcData.deployment.timing)}</div>`;
        }
        if (npcData.deployment.resolution) {
            html += `<div class="mechanics-description">${escapeHtml(npcData.deployment.resolution)}</div>`;
        }
    }

    // NPC roster
    if (npcData.npcs) {
        html += `<h3>Defender Roster</h3>`;
        html += `<div style="margin-bottom: 0.5rem; font-size: 0.9rem;"><strong>Total Defender BP:</strong> ${npcData.totalDefenderBP || 'N/A'}</div>`;

        npcData.npcs.forEach(npc => {
            const zones = npc.zonePlacement ? npc.zonePlacement.join(', ') : 'N/A';
            const specials = npc.specialRules && npc.specialRules.length > 0
                ? npc.specialRules.map(r => `<div style="margin-top: 0.5rem; color: var(--accent-amber);"><strong>${escapeHtml(r.name)}:</strong> ${escapeHtml(r.description)}</div>`).join('')
                : '';

            html += `
                <div class="npc-card">
                    <h4>${escapeHtml(npc.name)}</h4>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin: 0.5rem 0;">
                        <div class="npc-stat-line"><strong>Battle Power</strong><br>${npc.battlePower}</div>
                        <div class="npc-stat-line"><strong>Starting Hope</strong><br>${npc.startingHopeCost}</div>
                        <div class="npc-stat-line"><strong>Hope Increase</strong><br>+${npc.hopeIncrease}</div>
                        <div class="npc-stat-line"><strong>Zones</strong><br>${escapeHtml(zones)}</div>
                    </div>
                    ${npc.description ? `<div style="font-size: 0.9rem; font-style: italic; opacity: 0.85; margin-top: 0.5rem;">${escapeHtml(npc.description)}</div>` : ''}
                    ${specials}
                </div>
            `;
        });
    }

    html += `</section>`;
    return html;
}

function renderSiegeAdversaries(adversaries) {
    if (!adversaries || adversaries.length === 0) return '';

    let html = `
        <section class="mechanics-section" id="siege-adversaries">
            <h2>Siege Adversaries</h2>
            <div class="nav-cards">
    `;

    adversaries.forEach(({ filename, data }) => {
        if (!data) return;

        const id = filename.replace('.yaml', '');
        const tierCategory = `Tier ${data.tier} ${data.category}`;

        // Extract first sentence or truncate description
        let shortDesc = data.description || '';
        const firstSentence = shortDesc.match(/^[^.!?]+[.!?]/);
        if (firstSentence) {
            shortDesc = firstSentence[0];
        } else if (shortDesc.length > 120) {
            shortDesc = shortDesc.substring(0, 117) + '...';
        }

        // Route Colossus types to colossus.html, others to adversary.html
        const page = (data.category === 'Colossus' || data.segments) ? 'colossus' : 'adversary';
        html += `
            <a href="${page}.html?id=${escapeHtml(id)}" class="nav-card adversary">
                <h3>${escapeHtml(data.name)}</h3>
                <p class="card-desc">${escapeHtml(tierCategory)}</p>
                <p class="card-detail">${escapeHtml(shortDesc.trim())}</p>
            </a>
        `;
    });

    html += `
            </div>
        </section>
    `;
    return html;
}

function displayError(message) {
    const container = document.getElementById('siege-content');
    container.innerHTML = `
        <div style="background: rgba(196, 69, 54, 0.2); border: 0.15rem solid var(--danger-red); border-radius: 0.2rem; padding: 1.5rem; text-align: center;">
            <h2 style="color: var(--danger-red); margin-top: 0;">Error</h2>
            <p>${escapeHtml(message)}</p>
        </div>
    `;
}

