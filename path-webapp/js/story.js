// story.js — Story detail page
// Renders a story file in its authored reading order: summary, background,
// characters, goals, locations, steps, ending.
//
// Story YAML uses Markdown tables (roll tables, encounter budgets) which the
// shared formatDescription() does not handle, so tables are split out here and
// everything else is delegated to it.

/** Render a Markdown pipe table to HTML. */
function renderTable(rows) {
    const cells = row => row.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    const isSeparator = row => /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(row) && row.includes('-');

    let header = null;
    let body = rows;
    if (rows.length > 1 && isSeparator(rows[1])) {
        header = cells(rows[0]);
        body = rows.slice(2);
    }

    const inline = s => escapeHtml(s)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>');

    const head = header
        ? `<thead><tr>${header.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead>`
        : '';
    const tbody = `<tbody>${body
        .map(r => `<tr>${cells(r).map(c => `<td>${inline(c)}</td>`).join('')}</tr>`)
        .join('')}</tbody>`;

    return `<div class="table-scroll"><table class="story-table">${head}${tbody}</table></div>`;
}

/** formatDescription() plus Markdown table support. */
function formatStoryText(text) {
    if (!text) return '';
    const lines = text.trim().replace(/\r\n?/g, '\n').split('\n');

    const blocks = [];
    for (const line of lines) {
        const isRow = /^\s*\|/.test(line);
        const last = blocks[blocks.length - 1];
        if (isRow) {
            if (last && last.type === 'table') last.rows.push(line);
            else blocks.push({ type: 'table', rows: [line] });
        } else {
            if (last && last.type === 'text') last.lines.push(line);
            else blocks.push({ type: 'text', lines: [line] });
        }
    }

    return blocks.map(b =>
        b.type === 'table' ? renderTable(b.rows) : formatDescription(b.lines.join('\n'))
    ).filter(Boolean).join('');
}

async function loadStory() {
    const container = document.getElementById('story-content');
    const id = new URLSearchParams(window.location.search).get('id');

    if (!id) {
        container.innerHTML = '<div class="empty-state">No story specified.</div>';
        return;
    }

    try {
        const r = await fetch(`${STORIES_URL}${id}.yaml`);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        renderStory(jsyaml.load(await r.text()), container);
    } catch (e) {
        console.warn(`Failed to load story ${id}:`, e);
        container.innerHTML = '<div class="empty-state">Story not found.</div>';
    }
}

function section(title, body) {
    if (!body) return '';
    return `<section class="story-section"><h2>${escapeHtml(title)}</h2>${body}</section>`;
}

function renderStory(st, container) {
    document.title = `${st.name || 'Story'} - The Path`;

    const locations = (st.locations || []).map(loc => `
        <div class="location-point">
            <h3>${escapeHtml(loc.name || '')}</h3>
            <p>${formatDescription(loc.description || '')}</p>
        </div>`).join('');

    const steps = (st.steps || []).map(s => `
        <div class="story-step">
            <div class="step-head">
                <span class="step-num">${escapeHtml(String(s.step ?? ''))}</span>
                <h3>${escapeHtml(s.name || '')}</h3>
            </div>
            <div class="step-body">${formatStoryText(s.description || '')}</div>
            ${s.questions ? `<p class="step-questions">${escapeHtml(s.questions)}</p>` : ''}
        </div>`).join('');

    container.innerHTML = `
        <header class="story-header">
            <h1>${escapeHtml(st.name || 'Story')}</h1>
            <div class="story-meta">
                <span class="badge story">Story</span>
                ${st.difficulty != null ? `<span class="badge tier">Difficulty ${escapeHtml(String(st.difficulty))}</span>` : ''}
            </div>
        </header>

        ${section('Summary', st.summary ? `<div class="story-summary">${formatStoryText(st.summary)}</div>` : '')}
        ${section('Background', st.background ? `<div class="story-background">${formatStoryText(st.background)}</div>` : '')}
        ${section('Characters', st.characters ? formatStoryText(st.characters) : '')}
        ${section('Goals', st.goals ? formatStoryText(st.goals) : '')}
        ${section('Locations', locations ? `<div class="location-points">${locations}</div>` : '')}
        ${section('Steps', steps)}
        ${section('Ending', st.ending ? `<div class="story-ending">${formatStoryText(st.ending)}</div>` : '')}
    `;
}

document.addEventListener('DOMContentLoaded', loadStory);
