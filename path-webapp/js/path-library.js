/* Path Library index cards
   - Auto-discovers YAML files from the-path-campaign/example-path/path-library/
   - Renders clickable cards in #path-library-cards, grouped by tier
   - Auto-updates when YAML files are added to the folder — no frontend changes needed
*/
(async function () {
  const container = document.getElementById('path-library-cards');
  if (!container) return;

  const examples = await loadPathLibrary();

  if (examples.length === 0) {
    container.innerHTML = '<p style="opacity:0.7">No paths available.</p>';
    return;
  }

  container.innerHTML = '';
  let currentTier = null;

  examples.forEach((ex) => {
    const surfaceCount = Object.keys(ex.gridSurface || {}).length;
    const undergroundCount = Object.keys(ex.gridUnderground || {}).length;

    if (ex.tier !== currentTier) {
      currentTier = ex.tier;
      const header = document.createElement('h4');
      header.textContent = ex.tier ? `Tier ${ex.tier}` : 'Unclassified';
      header.style.cssText = 'width:100%;margin:1.5rem 0 0.5rem;color:var(--secondary-teal);font-size:1rem;grid-column:1/-1;';
      container.appendChild(header);
    }

    const card = document.createElement('a');
    card.className = 'nav-card path-card';
    card.href = `path.html?id=${encodeURIComponent(ex.id)}`;
    card.innerHTML = `
      <h3>${ex.name}</h3>
      <p class="card-desc">${surfaceCount + undergroundCount} locations</p>
      <p class="card-detail">
        ${surfaceCount} surface${undergroundCount ? ` &middot; ${undergroundCount} underground` : ''}
        ${ex.personal_ranking ? ` &middot; Difficulty ${ex.personal_ranking}` : ''}
      </p>
    `;
    container.appendChild(card);
  });
})();
