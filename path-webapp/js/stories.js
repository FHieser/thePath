// stories.js — Story list page
// Stories are the tales told at the Cloudburst Inn: self-contained one-shots the
// players take the parts in. They are not places, so they carry no grid position
// or tarot mapping.

let allStories = [];

async function loadStories() {
    const grid = document.getElementById('stories-grid');
    const filenames = await discoverYamlFiles(STORIES_URL);

    if (filenames.length === 0) {
        grid.innerHTML = '<div class="empty-state">No stories found.</div>';
        return;
    }

    await Promise.all(filenames.map(async filename => {
        try {
            const r = await fetch(`${STORIES_URL}${filename}`);
            if (!r.ok) return;
            const data = jsyaml.load(await r.text());
            data._id = filename.replace(/\.yaml$/, '');
            allStories.push(data);
        } catch (e) {
            console.warn(`Failed to load story ${filename}:`, e);
        }
    }));

    allStories.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    renderStories();
}

function renderStories() {
    const grid = document.getElementById('stories-grid');
    grid.innerHTML = allStories.map(buildStoryCard).join('');
}

/** First paragraph of the summary, trimmed for the card. */
function storyBlurb(st) {
    const text = (st.summary || '').trim().replace(/\r\n?/g, '\n');
    const first = text.split('\n\n')[0].replace(/\n/g, ' ').trim();
    return first.length > 200 ? first.slice(0, 197) + '…' : first;
}

function buildStoryCard(st) {
    const steps = (st.steps || []).length;
    const places = (st.locations || []).length;

    return `
        <a href="story.html?id=${encodeURIComponent(st._id)}" class="story-card">
            <h3>${escapeHtml(st.name || st._id)}</h3>
            <div class="story-meta">
                <span class="badge story">Story</span>
                ${st.difficulty != null ? `<span class="badge tier">Diff ${escapeHtml(String(st.difficulty))}</span>` : ''}
            </div>
            <p class="story-desc">${escapeHtml(storyBlurb(st))}</p>
            <div class="story-footer">
                <span>${steps} Step${steps !== 1 ? 's' : ''}</span>
                <span>${places} Location${places !== 1 ? 's' : ''}</span>
            </div>
        </a>`;
}

document.addEventListener('DOMContentLoaded', loadStories);
