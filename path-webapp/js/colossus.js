// Colossus detail page - Dedicated renderer for multi-segment adversaries
// Splits multi-document YAML by top-level keys instead of --- separators
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const colossusId = urlParams.get('id');

    if (!colossusId) {
        displayError('No colossus specified');
        return;
    }

    // Known colossus locations
    const colossusPaths = [
        `../the-path-campaign/adversaries/siege/${colossusId}.yaml`
    ];

    try {
        let yamlText = null;

        for (const path of colossusPaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    yamlText = await response.text();
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (!yamlText) {
            displayError(`Colossus "${colossusId}" not found`);
            return;
        }

        // Strip --- separators, then split by top-level "name:" or "lore:" keys
        const cleaned = yamlText.replace(/^---\s*$/gm, '');
        const docTexts = cleaned.split(/\n(?=name:|lore:)/).filter(s => s.trim());
        const docs = docTexts.map(text => jsyaml.load(text));

        displayColossus(docs);
    } catch (error) {
        console.error('Full error:', error);
        displayError(`Failed to load colossus: ${error.message}`);
    }
});

function displayColossus(docs) {
    const container = document.getElementById('adversary-content');
    const framework = docs[0];

    // Separate segments and lore document
    const segments = [];
    let loreDoc = null;
    for (let i = 1; i < docs.length; i++) {
        const doc = docs[i];
        if (doc && doc.segment_of) {
            segments.push(doc);
        } else if (doc && doc.lore && !doc.name) {
            loreDoc = doc;
        }
    }

    const tierCategory = `Tier ${framework.tier} ${framework.category}`;

    // Format thresholds
    let thresholdsText = 'None';
    if (framework.thresholds) {
        thresholdsText = typeof framework.thresholds === 'object'
            ? `${framework.thresholds.major}/${framework.thresholds.severe}`
            : framework.thresholds;
    }

    // Format experience
    let experienceText = '';
    if (Array.isArray(framework.experience)) {
        experienceText = framework.experience.map(exp =>
            typeof exp === 'object' ? `${exp.name} +${exp.value}` : exp
        ).join(', ');
    }

    // Calculate total HP
    const totalHP = segments.reduce((sum, seg) => sum + (seg.hp || 0), 0);

    let html = `
        <div class="adversary-detail colossus-detail">
            <div class="adversary-header">
                <h1>${escapeHtml(framework.name)}</h1>
                <div class="location-type">${tierCategory}</div>
            </div>

            <!-- Framework Stat Block -->
            <div class="stat-block" style="border-color: var(--danger-red);">
                <div class="description-block">${escapeHtml(framework.description)}</div>

                ${framework.motives ? `<p class="stat-line"><strong>Motives:</strong> ${escapeHtml(framework.motives)}</p>` : ''}
                ${framework.size ? `<p class="stat-line"><strong>Size:</strong> ${escapeHtml(framework.size)}</p>` : ''}

                <div class="stat-grid">
                    <div class="stat-item">
                        <strong>Thresholds</strong>
                        <span>${thresholdsText}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Stress</strong>
                        <span>${framework.stress}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Total HP</strong>
                        <span>${totalHP}</span>
                    </div>
                    <div class="stat-item">
                        <strong>Segments</strong>
                        <span>${segments.length}</span>
                    </div>
                </div>

                <p class="stat-line"><strong>Experience:</strong> ${escapeHtml(experienceText)}</p>

                <!-- Framework Features -->
                <h3 style="margin-top: 1rem; margin-bottom: 0.5rem; border-top: 0.1rem solid var(--danger-red); padding-top: 0.5rem;">Framework Features</h3>
                ${framework.features ? framework.features.map(f => renderFeature(f)).join('') : ''}
            </div>

            <!-- Adjacency Map -->
            ${framework.adjacency ? renderAdjacency(framework.adjacency) : ''}

            <!-- Segments -->
            <h2 style="color: var(--accent-amber); margin-top: 2rem; border-bottom: 0.15rem solid var(--danger-red);">Segments</h2>
            ${segments.map(seg => renderSegment(seg)).join('')}

            <!-- Lore -->
            ${(loreDoc ? loreDoc.lore : framework.lore) ? `
                <div class="lore-block" style="margin-top: 1.5rem;">
                    ${escapeHtml(loreDoc ? loreDoc.lore : framework.lore)}
                </div>
            ` : ''}
        </div>
    `;

    container.innerHTML = html;
}

function renderAdjacency(adjacency) {
    let html = `
        <div style="background: rgba(17, 68, 102, 0.15); border: 0.15rem solid var(--primary-blue); border-radius: 0.2rem; padding: 1rem; margin: 1rem 0;">
            <h3 style="margin-top: 0; color: var(--primary-blue);">Segment Adjacency</h3>
    `;

    for (const [segment, neighbors] of Object.entries(adjacency)) {
        const neighborText = neighbors.map(n => escapeHtml(n)).join(', ');
        html += `
            <div style="font-size: 0.9rem; margin: 0.4rem 0; display: flex; gap: 0.5rem;">
                <strong style="color: var(--accent-amber); min-width: 120px;">${escapeHtml(segment)}</strong>
                <span style="color: var(--primary-blue);">&rarr;</span>
                <span>${neighborText}</span>
            </div>
        `;
    }

    html += `</div>`;
    return html;
}

function renderSegment(seg) {
    let adjacentText = '';
    if (seg.adjacent_segments) {
        adjacentText = seg.adjacent_segments.map(s => escapeHtml(s)).join(', ');
    }

    // Check for Fatal feature
    const isFatal = seg.features && seg.features.some(f => f.name === 'Fatal');

    const borderColor = isFatal ? 'var(--danger-red)' : 'rgba(196, 69, 54, 0.4)';
    const bgColor = isFatal ? 'rgba(196, 69, 54, 0.12)' : 'rgba(196, 69, 54, 0.05)';

    let html = `
        <div style="background: ${bgColor}; border: 0.15rem solid ${borderColor}; border-radius: 0.2rem; padding: 1rem; margin: 0.75rem 0;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
                <h3 style="margin: 0; color: var(--accent-amber); font-size: 1.1rem;">${escapeHtml(seg.name)}</h3>
                ${isFatal ? '<span style="background: var(--danger-red); color: white; padding: 0.15rem 0.5rem; border-radius: 0.15rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Fatal</span>' : ''}
            </div>

            <div class="stat-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="stat-item">
                    <strong>Difficulty</strong>
                    <span>${seg.difficulty}</span>
                </div>
                <div class="stat-item">
                    <strong>HP</strong>
                    <span>${seg.hp}</span>
                </div>
                <div class="stat-item">
                    <strong>Adjacent</strong>
                    <span style="font-size: 0.8rem;">${adjacentText || 'None'}</span>
                </div>
            </div>
    `;

    // Segment attack
    if (seg.attack) {
        html += `
            <div class="attack-box">
                <strong>ATK ${escapeHtml(seg.attack.bonus)} ${escapeHtml(seg.attack.name)}:</strong>
                ${escapeHtml(seg.attack.range)} &mdash; ${escapeHtml(seg.attack.damage)}
            </div>
        `;
    }

    // Segment features
    if (seg.features) {
        html += `<div style="margin-top: 0.5rem;">`;
        seg.features.forEach(f => {
            html += renderFeature(f);
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
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
            <p><a href="siege.html">&larr; Return to Siege</a></p>
        </div>
    `;
}
