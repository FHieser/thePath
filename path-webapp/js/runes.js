// The Runes — Elder Futhark reference, loaded from the flavor folder

const RUNES_URL = '../the-path-campaign/flavor/runes.yaml';

// Selection order is kept so carved runes appear in the order they were picked
const selected = [];
const runesByName = {};

function renderStone() {
  const stone = document.getElementById('stone');
  stone.querySelectorAll('.stone-rune, .stone-hint').forEach(el => el.remove());

  if (selected.length === 0) {
    stone.insertAdjacentHTML('beforeend', '<span class="stone-hint">Select runes below</span>');
    return;
  }

  for (const name of selected) {
    const rune = runesByName[name];
    stone.insertAdjacentHTML('beforeend', `
      <span class="stone-rune">
        <span class="rune-glyph">${escapeHtml(rune.glyph)}</span>
        <span class="stone-rune-name">${escapeHtml(rune.name)}</span>
      </span>
    `);
  }
}

function toggleRune(name, btn) {
  const i = selected.indexOf(name);
  if (i === -1) {
    selected.push(name);
    btn.classList.add('active');
  } else {
    selected.splice(i, 1);
    btn.classList.remove('active');
  }
  renderStone();
}

function renderRunes(data) {
  document.getElementById('rune-intro').textContent = data.intro || '';
  document.getElementById('rune-source').innerHTML = formatDescription(data.source || '');

  const list = document.getElementById('rune-list');
  list.innerHTML = '';

  for (const aett of data.aetts || []) {
    list.insertAdjacentHTML('beforeend', `<h3 class="aett-heading">${escapeHtml(aett.name)}</h3>`);
    const grid = document.createElement('div');
    grid.className = 'rune-grid';

    for (const rune of aett.runes || []) {
      runesByName[rune.name] = rune;
      const btn = document.createElement('button');
      btn.className = 'rune-btn';
      btn.innerHTML = `
        <span class="rune-glyph">${escapeHtml(rune.glyph)}</span>
        <span class="rune-info">
          <span class="rune-name">${escapeHtml(rune.name)}<span class="rune-sound">/${escapeHtml(rune.sound)}/</span></span>
          <span class="rune-meaning">${escapeHtml(rune.meaning)}</span>
          <span class="rune-note">${escapeHtml(rune.note || '')}</span>
        </span>
      `;
      btn.addEventListener('click', () => toggleRune(rune.name, btn));
      grid.appendChild(btn);
    }

    list.appendChild(grid);
  }
}

async function init() {
  try {
    const response = await fetch(RUNES_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderRunes(jsyaml.load(await response.text()));
  } catch (err) {
    console.error('Failed to load runes:', err);
    document.getElementById('rune-list').innerHTML = '<p style="opacity: 0.7;">Could not load runes.</p>';
  }

  document.getElementById('clear-btn').addEventListener('click', () => {
    selected.length = 0;
    document.querySelectorAll('.rune-btn').forEach(b => b.classList.remove('active'));
    renderStone();
  });
}

init();
