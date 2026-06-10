// Adversaries page — renders a searchable list from ADVERSARY_FOLDERS (utils.js).

(async function () {
  const section = findAdversarySection();
  if (!section) return;

  const container = section.querySelector('.nav-cards') || section;

  // Inject search box before the card container
  const searchWrapper = document.createElement('div');
  searchWrapper.id = 'adversary-search-wrapper';
  searchWrapper.innerHTML = `<input id="adversary-search" type="search" placeholder="Search adversaries…" autocomplete="off">`;
  section.insertBefore(searchWrapper, container);

  container.innerHTML = '<div class="loading">Loading adversaries…</div>';

  const allFolders = ADVERSARY_FOLDERS;

  // ── Loading ────────────────────────────────────────────────────────────────
  const folderResults = await Promise.all(
    allFolders.map(async ({ key, path: folderPath }) => {
      const filenames = await discoverYamlFiles(folderPath);
      const adversaries = await Promise.all(
        filenames.map(async (filename) => {
          const id = filename.replace('.yaml', '');
          try {
            const response = await fetch(`${folderPath}${filename}`);
            if (!response.ok) return null;
            const firstDoc = (await response.text()).split(/\n---/)[0];
            const data = jsyaml.load(firstDoc);
            return { id, data };
          } catch (e) {
            console.warn(`Failed to load ${id}:`, e);
            return null;
          }
        })
      );
      const valid = adversaries.filter(Boolean);
      const getTier = (d) => d.tier ?? d.tiers?.[0]?.tier ?? 0;
      valid.sort((a, b) => {
        if (getTier(a.data) !== getTier(b.data)) return getTier(a.data) - getTier(b.data);
        return (a.data.name || '').localeCompare(b.data.name || '');
      });
      return { key, adversaries: valid };
    })
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  container.innerHTML = '';

  let totalRendered = 0;
  for (const { key, adversaries } of folderResults) {
    if (adversaries.length === 0) continue;
    totalRendered += adversaries.length;

    const group = document.createElement('div');
    group.className = 'adversary-group';
    group.dataset.folder = key;

    const header = document.createElement('h3');
    header.className = 'group-header';
    header.textContent = toDisplayName(key);
    group.appendChild(header);

    const list = document.createElement('div');
    list.className = 'adversary-list';

    for (const { id, data } of adversaries) {
      list.appendChild(makeRow(id, data));
    }

    group.appendChild(list);
    container.appendChild(group);
  }

  if (totalRendered === 0) {
    container.innerHTML = '<div class="error">No adversaries found.</div>';
    return;
  }

  // ── Search ─────────────────────────────────────────────────────────────────
  document.getElementById('adversary-search').addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    for (const group of container.querySelectorAll('.adversary-group')) {
      let anyVisible = false;
      for (const row of group.querySelectorAll('.adversary-row')) {
        const match = !query || row.dataset.name.includes(query);
        row.hidden = !match;
        if (match) anyVisible = true;
      }
      group.hidden = !anyVisible;
    }
  });
})();

// ── Helpers ──────────────────────────────────────────────────────────────────

function findAdversarySection() {
  for (const section of document.querySelectorAll('.nav-section')) {
    const h2 = section.querySelector('h2');
    if (h2 && h2.textContent.trim() === 'Adversaries') return section;
  }
  console.error('Could not find Adversaries nav-section');
  return null;
}

function toDisplayName(key) {
  return key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function makeRow(id, data) {
  const page = (data.category === 'Colossus' || data.segments) ? 'colossus' : 'adversary';

  let tierLabel, hrefSuffix;
  if (data.tiers && Array.isArray(data.tiers) && data.tiers.length > 0) {
    const first = data.tiers[0].tier;
    const last = data.tiers[data.tiers.length - 1].tier;
    tierLabel = first === last ? `Tier ${first}` : `Tier ${first}–${last}`;
    hrefSuffix = `&tier=${first}`;
  } else {
    tierLabel = data.tier ? `Tier ${data.tier}` : null;
    hrefSuffix = '';
  }

  const tierMeta = [tierLabel, data.category].filter(Boolean).join(' · ');

  let desc = data.description || '';
  const sentence = desc.match(/^[^.!?]+[.!?]/);
  if (sentence) desc = sentence[0];
  else if (desc.length > 100) desc = desc.slice(0, 97) + '…';

  const row = document.createElement('a');
  row.className = 'adversary-row';
  row.href = `${page}.html?id=${id}${hrefSuffix}`;
  row.dataset.name = (data.name || '').toLowerCase();
  row.innerHTML = `
    <span class="adv-name">${escapeHtml(data.name)}</span>
    <span class="adv-meta">${escapeHtml(tierMeta)}</span>
    <span class="adv-desc">${escapeHtml(desc)}</span>
  `;
  return row;
}
