/* Path Creator JS
   - loads locations dynamically from YAML files
   - renders palette with surface/underground separation
   - drag/drop placement onto 8x4 grid (dual-layer)
   - localStorage autosave via PathStorage.saveAutosave
   - export/import JSON
*/
(async function () {
  const GRID_COLS = 8;
  const GRID_ROWS = 4;
  const paletteListSurface = document.getElementById("palette-list-surface");
  const paletteListUnderground = document.getElementById("palette-list-underground");
  const searchInputSurface = document.getElementById("palette-search-surface");
  const searchInputUnderground = document.getElementById("palette-search-underground");

  let locations = {};
  // model holds both layers
  let model = { surface: {}, underground: {} }; // "col,row" -> id
  // global lock flag (default unlocked)
  window.__pathCreatorLocked = false;

  // removal helper exposed globally for inline onclick handlers
  window.pathCreatorRemoveAt = function (layer, col, row) {
    const key = `${col},${row}`;
    if (model[layer] && model[layer][key]) {
      delete model[layer][key];
      renderGrid();
    }
  };

  function makeCell(col, row, layer) {
    const div = document.createElement("div");
    div.className = "pc-cell";
    div.setAttribute("data-col", col);
    div.setAttribute("data-row", row);
    div.setAttribute("role", "gridcell");
    div.tabIndex = 0;
    div.addEventListener("dragover", (e) => e.preventDefault());
    div.addEventListener("drop", (e) => {
      e.preventDefault();
      if (window.__pathCreatorLocked) {
        alert("Positions are locked. Toggle 'Unlock positions' to edit.");
        return;
      }
      const id = e.dataTransfer.getData("text/plain");
      placeAt(col, row, id, layer);
    });
    div.addEventListener("click", () => {
      const key = `${col},${row}`;
      const id = model[layer][key];
      if (id) {
        if (window.__pathCreatorLocked) {
          const url = `location.html?id=${id}`;
          window.open(url, "_blank", "noopener");
          return;
        }
        if (confirm("Remove location from this cell?")) {
          delete model[layer][key];
          renderGrid();
        }
      }
    });
    return div;
  }

  function renderGrid() {
    // surface grid
    const surfaceGrid = document.getElementById("pc-grid-surface");
    const undergroundGrid = document.getElementById("pc-grid-underground");
    surfaceGrid.innerHTML = "";
    undergroundGrid.innerHTML = "";
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const key = `${c},${r}`;
        // surface cell
        const cellS = makeCell(c, r, "surface");
        const idS = model.surface[key];
        if (idS) {
          cellS.classList.add("filled");
          const loc = locations[idS];
          const name = loc ? loc.name : idS;
          let actions = `<div class="cell-actions"><a href="location.html?id=${idS}" target="_blank" rel="noopener">Open</a>`;
          if (!window.__pathCreatorLocked) {
            actions += ` <button class="remove-btn" onclick="window.pathCreatorRemoveAt('surface',${c},${r})">Remove</button>`;
          }
          actions += "</div>";
          cellS.innerHTML = `<div class="cell-name">${name}</div>${actions}`;
        }
        surfaceGrid.appendChild(cellS);

        // underground cell
        const cellU = makeCell(c, r, "underground");
        const idU = model.underground[key];
        // highlight if surface has Cave Mouth
        let surfaceHasCave = false;
        if (idS && locations[idS] && Array.isArray(locations[idS].modifiers)) {
          surfaceHasCave = locations[idS].modifiers.map(m=>getModifierName(m).toLowerCase()).includes("cave mouth");
        }
        if (surfaceHasCave) {
          cellU.classList.add("cave-mouth");
        }
        if (idU) {
          cellU.classList.add("filled");
          const loc = locations[idU];
          const name = loc ? loc.name : idU;
          let actions = `<div class="cell-actions"><a href="location.html?id=${idU}" target="_blank" rel="noopener">Open</a>`;
          if (!window.__pathCreatorLocked) {
            actions += ` <button class="remove-btn" onclick="window.pathCreatorRemoveAt('underground',${c},${r})">Remove</button>`;
          }
          actions += "</div>";
          cellU.innerHTML = `<div class="cell-name">${name}</div>${actions}`;
        }
        undergroundGrid.appendChild(cellU);
      }
    }
  }

  function placeAt(col, row, id, layer) {
    const key = `${col},${row}`;
    if (!layer) layer = window.__pathCreatorActiveLayer || "surface";
    // Determine if location is underground by modifier
    const loc = locations[id] || {};
    const mods = Array.isArray(loc.modifiers) ? loc.modifiers.map((m) => getModifierName(m).toLowerCase()) : [];
    const isUnderground = mods.includes("underground");

    // Enforce: underground-only items cannot be placed on surface; surface-only cannot be placed underground
    if (layer === "surface" && isUnderground) {
      alert("This location is underground-only and cannot be placed on the surface layer.");
      return;
    }
    if (layer === "underground" && !isUnderground) {
      alert("This location is surface-only and cannot be placed on the underground layer.");
      return;
    }

    model[layer][key] = id;
    renderGrid();
  }

  async function loadLocations() {
    try {
      console.log('Loading locations from YAML files...');

      // Define location folders to scan
      const locationFolders = [
        { path: 'path-locations/surface-locations', type: 'surface' },
        { path: 'path-locations/underground-locations', type: 'underground' },
        { path: 'village-in-the-mist', type: 'village' }
      ];

      locations = {};

      // Auto-discover and load all YAML files from each folder
      for (const {path: folder, type} of locationFolders) {
        const folderPath = `../the-path-campaign/locations/${folder}/`;

        try {
          const filenames = await discoverYamlFiles(folderPath);
          for (const filename of filenames) {
            if (filename.includes('template') || filename.includes('mechanics')) continue;
            const id = filename.replace('.yaml', '').replace('-card', '');
            try {
              const locResponse = await fetch(`${folderPath}${filename}`);
              if (locResponse.ok) {
                locations[id] = jsyaml.load(await locResponse.text());
              }
            } catch (error) {
              console.warn(`Failed to load ${filename}:`, error);
            }
          }
        } catch (error) {
          console.warn(`Could not scan folder ${folder}:`, error);
        }
      }

      console.log(`Loaded ${Object.keys(locations).length} total locations`);
    } catch (e) {
      console.error('Error loading locations:', e);
      locations = {};
    }
  }

  function renderPalette(filterSurface = "", filterUnderground = "") {
    filterSurface = (filterSurface || "").toLowerCase();
    filterUnderground = (filterUnderground || "").toLowerCase();
    const surfaceList = paletteListSurface;
    const undergroundList = paletteListUnderground;
    surfaceList.innerHTML = "";
    undergroundList.innerHTML = "";
    const items = Object.keys(locations).sort((a, b) => locations[a].name.localeCompare(locations[b].name));
    items.forEach((id) => {
      const loc = locations[id];
      const nameLower = (loc.name || "").toLowerCase();
      const isUnderground = Array.isArray(loc.modifiers) && loc.modifiers.map((m) => getModifierName(m).toLowerCase()).includes("underground");

      // create base node
      const node = document.createElement("div");
      node.className = "location-card";
      node.draggable = true;
      node.setAttribute("data-id", id);
      node.innerHTML = `<span>${loc.name}</span><small class="meta-inline">${loc.tier || ""}</small>`;
      node.addEventListener("dragstart", (e) => {
        if (window.__pathCreatorLocked) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData("text/plain", id);
      });

      // surface placement node (only if matches surface filter and not underground-only)
      if (!isUnderground && nameLower.includes(filterSurface)) {
        const nodeS = node.cloneNode(true);
        nodeS.addEventListener("dragstart", (e) => {
          if (window.__pathCreatorLocked) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.setData("text/plain", id);
        });
        nodeS.addEventListener("click", () => {
          if (window.__pathCreatorLocked) {
            alert("Positions are locked. Toggle 'Unlock positions' to edit.");
            return;
          }
          const layer = "surface";
          for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
              const key = `${c},${r}`;
              if (!model[layer][key]) {
                placeAt(c, r, id, layer);
                return;
              }
            }
          }
          alert("No empty cells available. Remove a cell or clear the grid.");
        });
        surfaceList.appendChild(nodeS);
      }

      // underground placement node (only if matches underground filter and is underground)
      if (isUnderground && nameLower.includes(filterUnderground)) {
        const nodeU = node.cloneNode(true);
        nodeU.addEventListener("dragstart", (e) => {
          if (window.__pathCreatorLocked) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.setData("text/plain", id);
        });
        nodeU.addEventListener("click", () => {
          if (window.__pathCreatorLocked) {
            alert("Positions are locked.");
            return;
          }
          const layer = "underground";
          for (let r = 0; r < GRID_ROWS; r++) {
            for (let c = 0; c < GRID_COLS; c++) {
              const key = `${c},${r}`;
              if (!model[layer][key]) {
                placeAt(c, r, id, layer);
                return;
              }
            }
          }
          alert("No empty underground cells available.");
        });
        undergroundList.appendChild(nodeU);
      }
    });
  }

  // toolbar actions
  document.getElementById("save-btn").addEventListener("click", () => {
    const snapshot = {
      id: "autosave-" + new Date().toISOString(),
      timestamp: new Date().toISOString(),
      rows: GRID_ROWS,
      cols: GRID_COLS,
      grid: { ...model },
    };
    PathStorage.saveAutosave(snapshot);
    alert("Saved to local autosaves.");
  });

  document.getElementById("export-btn").addEventListener("click", () => {
    const out = {
      rows: GRID_ROWS,
      cols: GRID_COLS,
      gridSurface: { ...model.surface },
      gridUnderground: { ...model.underground },
    };
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "path-export.json";
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("import-file").addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.gridSurface && !data.grid) throw new Error("Invalid format");
        if (data.gridSurface) {
          model.surface = data.gridSurface || {};
          model.underground = data.gridUnderground || {};
        } else if (data.grid) {
          model.surface = data.grid;
          model.underground = {};
        }
        renderGrid();
      } catch (err) {
        alert("Invalid JSON import.");
      }
    };
    reader.readAsText(f);
  });

  document.getElementById("clear-btn").addEventListener("click", () => {
    if (confirm("Clear entire grid?")) {
      model = { surface: {}, underground: {} };
      renderGrid();
    }
  });

  if (searchInputSurface) searchInputSurface.addEventListener("input", (e) => renderPalette(e.target.value, searchInputUnderground ? searchInputUnderground.value : ""));
  if (searchInputUnderground) searchInputUnderground.addEventListener("input", (e) => renderPalette(searchInputSurface ? searchInputSurface.value : "", e.target.value));

  await loadLocations();
  renderPalette("", "");
  renderGrid();

  const lockBtn = document.getElementById("lock-toggle");
  if (lockBtn) {
    lockBtn.addEventListener("click", () => {
      window.__pathCreatorLocked = !window.__pathCreatorLocked;
      lockBtn.textContent = window.__pathCreatorLocked ? "Unlock positions" : "Lock positions";
      lockBtn.style.opacity = window.__pathCreatorLocked ? "0.85" : "1";
      renderGrid();
    });
  }

  // Load bundled examples into select
  const exampleSelect = document.getElementById("load-example-select");
  const loadExampleBtn = document.getElementById("load-example-btn");

  async function applyExample(id) {
    const data = await PathStorage.loadBundled();
    const ex = (data.examples || []).find((e) => e.id === id);
    if (!ex) return;
    const occupied = Object.keys(model.surface).length + Object.keys(model.underground).length;
    if (occupied > 0 && !confirm("Load example? This will replace the current grid.")) return;
    model.surface = { ...(ex.gridSurface || {}) };
    model.underground = { ...(ex.gridUnderground || {}) };
    renderGrid();
  }

  PathStorage.loadBundled().then((data) => {
    (data.examples || []).forEach((ex) => {
      const opt = document.createElement("option");
      opt.value = ex.id;
      opt.textContent = ex.name;
      exampleSelect.appendChild(opt);
    });

    // Handle ?load=id URL param (navigated from path library)
    const urlParams = new URLSearchParams(window.location.search);
    const loadId = urlParams.get("load");
    if (loadId) {
      exampleSelect.value = loadId;
      applyExample(loadId);
    }
  });

  if (loadExampleBtn) {
    loadExampleBtn.addEventListener("click", () => {
      const id = exampleSelect?.value;
      if (id) applyExample(id);
    });
  }
})();


