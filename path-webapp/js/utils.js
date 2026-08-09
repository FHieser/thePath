// utils.js — Shared utilities for The Path webapp
// Load this before any page-specific script on every page that uses these helpers.

// ---------------------------------------------------------------------------
// Adversary folder registry — single source of truth for folder keys, display
// names, and base paths. Add a new folder here to expose it everywhere.
// ---------------------------------------------------------------------------
const ADVERSARY_FOLDERS = [
  { key: 'antagonists',    name: 'Antagonists',          path: '../the-path-campaign/adversaries/antagonists/' },
  { key: 'beasts',         name: 'Beasts',               path: '../the-path-campaign/adversaries/beasts/' },
  { key: 'mist',           name: 'Mist Creatures',       path: '../the-path-campaign/adversaries/mist/' },
  { key: 'spider-queen',   name: "Spider Queen's Brood", path: '../the-path-campaign/adversaries/spider-queen/' },
  { key: 'crystal-plague', name: 'Crystal-Plague',       path: '../the-path-campaign/adversaries/crystal-plague/' },
  { key: 'siege',          name: 'Siege',                path: '../the-path-campaign/adversaries/siege/' },
  { key: 'village-siege',  name: 'Village Siege',        path: '../the-path-campaign/mechanics/village-siege/adversaries/' },
  { key: 'the-croak',     name: 'The Croak',            path: '../the-path-campaign/adversaries/the-croak/' },
];

// Location folder registry — surface, underground, starfall city, village.
const LOCATION_FOLDERS = [
  { path: '../the-path-campaign/locations/path-locations/surface-locations/',    type: 'surface' },
  { path: '../the-path-campaign/locations/path-locations/underground-locations/', type: 'underground' },
  { path: '../the-path-campaign/locations/path-locations/starfall-city/',         type: 'starfall-city' },
  { path: '../the-path-campaign/locations/village-in-the-mist/',                  type: 'village' },
];

// Events live in a single flat folder — occurrences rather than places, so they
// carry no grid coordinate, tarot card, or Glossary entry.
const EVENTS_URL = '../the-path-campaign/lore/events/';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely escape a string for HTML insertion. */
function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert a multi-line YAML text block into readable HTML.
 * Double newlines (blank lines) become <br><br>; single newlines become <br>.
 * Handles both Unix (\n) and Windows (\r\n) line endings.
 *
 * Also renders the small subset of Markdown the campaign YAML actually uses:
 * **bold** and `- ` bullet lists. Campaign files have long been authored with
 * these, so without this they render as literal asterisks and dashes.
 */
function formatDescription(text) {
  if (!text) return '';

  const inline = s => s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  const lines = text.trim().replace(/\r\n?/g, '\n').split('\n');

  // Group consecutive bullet lines into list blocks, everything else into text
  // blocks, so a <ul> is emitted as a block rather than <br>-joined lines.
  const parts = [];
  for (const line of lines) {
    const bullet = line.match(/^\s*[-*]\s+(.*)$/);
    const last = parts[parts.length - 1];
    if (bullet) {
      if (last && last.type === 'list') last.lines.push(bullet[1]);
      else parts.push({ type: 'list', lines: [bullet[1]] });
    } else {
      if (last && last.type === 'text') last.lines.push(line);
      else parts.push({ type: 'text', lines: [line] });
    }
  }

  return parts.map(part => {
    if (part.type === 'list') {
      return `<ul class="md-list">${part.lines.map(l => `<li>${inline(l)}</li>`).join('')}</ul>`;
    }
    return part.lines
      .join('\n')
      .replace(/\n{2,}/g, '\n\n')
      .trim()
      .split('\n\n')
      .filter(Boolean)
      .map(para => inline(para.replace(/\n/g, '<br>')))
      .join('<br><br>');
  }).filter(Boolean).join('');
}

/** Return the modifier name regardless of whether it's a string or {name:…} object. */
function getModifierName(mod) {
  return typeof mod === 'object' ? mod.name : mod;
}

/**
 * Fetch a directory listing and return all immediate subdirectory names found
 * in it (e.g. ["mist", "beasts", "spider-queen"]).
 * Matches href="name/" patterns — excludes parent links (../) and absolute paths.
 */
async function discoverFolders(folderUrl) {
  try {
    const response = await fetch(folderUrl);
    if (!response.ok) return [];
    const html = await response.text();
    const matches = html.match(/href="([a-zA-Z][a-zA-Z0-9\-_]*\/)"/g) || [];
    return matches.map(m => m.match(/href="([^"]+)"/)[1].replace(/\/$/, ''));
  } catch (e) {
    return [];
  }
}

/**
 * Fetch a directory listing and return all .yaml filenames found in it.
 * Returns an empty array if the fetch fails or the directory isn't listable.
 */
async function discoverYamlFiles(folderUrl) {
  if (typeof CONTENT_INDEX !== 'undefined' && CONTENT_INDEX[folderUrl]) {
    return CONTENT_INDEX[folderUrl];
  }
  try {
    const response = await fetch(folderUrl);
    if (!response.ok) return [];
    const html = await response.text();
    const matches = html.match(/href="([^"]+\.yaml)"/g) || [];
    return matches.map(m => m.match(/href="([^"]+)"/)[1]);
  } catch (e) {
    return [];
  }
}

/**
 * Load and parse modifier descriptions from path-mechanics.yaml.
 * Returns a map of lowercase modifier name → { description, counterplay, valueRange }.
 */
async function loadModifierDescriptions() {
  const descriptions = {};
  try {
    const response = await fetch('../the-path-campaign/mechanics/path-mechanics.yaml');
    if (!response.ok) return descriptions;
    const mechanics = jsyaml.load(await response.text());
    if (mechanics.modifiers && mechanics.modifiers.list) {
      mechanics.modifiers.list.forEach(mod => {
        descriptions[mod.name.toLowerCase()] = {
          description: mod.description,
          counterplay: mod.counterplay,
          valueRange: mod.valueRange,
        };
      });
    }
  } catch (e) {
    console.warn('Could not load modifier descriptions:', e);
  }
  return descriptions;
}

// ---------------------------------------------------------------------------
// Path library loader — discovers, loads, and sorts all YAML paths.
// Used by path-library.js (index page cards), paths.js (path-creator storage),
// and paths.html (path library page).
// ---------------------------------------------------------------------------
const PATH_LIBRARY_URL = '../the-path-campaign/example-path/path-library/';

async function loadPathLibrary() {
  const filenames = await discoverYamlFiles(PATH_LIBRARY_URL);
  const examples = [];

  await Promise.all(filenames.map(async (filename) => {
    const id = filename.replace('.yaml', '');
    try {
      const r = await fetch(`${PATH_LIBRARY_URL}${filename}`);
      if (!r.ok) return;
      const data = jsyaml.load(await r.text());
      data.id = id;
      examples.push(data);
    } catch (e) {
      console.warn(`Failed to load path ${filename}:`, e);
    }
  }));

  examples.sort((a, b) => {
    const ta = a.tier ?? Infinity, tb = b.tier ?? Infinity;
    if (ta !== tb) return ta - tb;
    const ra = a.personal_ranking ?? Infinity, rb = b.personal_ranking ?? Infinity;
    return ra - rb;
  });

  return examples;
}
