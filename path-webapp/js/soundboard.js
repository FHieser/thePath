// Soundboard page — general mood music grouped by category, from soundboard.yaml.
// Location, event and NPC tracks are shown on their own pages instead.
const SOUNDBOARD_URL = '../the-path-campaign/soundboard.yaml';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('soundboard-content');

    try {
        const response = await fetch(SOUNDBOARD_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { categories = [] } = jsyaml.load(await response.text());

        container.innerHTML = categories.map(category => `
            <section class="nav-section">
                <h2>${escapeHtml(category.name)}</h2>
                <div class="nav-cards">
                    ${(category.tracks || []).map(track => `
                        <div class="nav-card track-card">
                            <a href="${escapeAttr(track.url)}" class="track-card-link" target="_blank" rel="noopener">
                                <h3>♪ ${escapeHtml(track.name)}</h3>
                            </a>
                            ${copyLinkButton(track.url, track.name)}
                        </div>
                    `).join('')}
                </div>
            </section>
        `).join('');
    } catch (error) {
        console.error('Failed to load soundboard:', error);
        container.innerHTML = '<p class="error">Error loading soundboard.</p>';
    }
});
