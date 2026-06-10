// Helper to load bundled examples and local autosaves
window.PathStorage = (function () {
  const AUTOSAVE_KEY = 'pathCreator.autosaves';

  async function loadBundled() {
    const examples = await loadPathLibrary();
    return { examples };
  }

  function loadAutosaves() {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveAutosave(obj) {
    const list = loadAutosaves();
    list.unshift(obj);
    while (list.length > 10) list.pop();
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(list));
  }

  function clearAutosaves() {
    localStorage.removeItem(AUTOSAVE_KEY);
  }

  return { loadBundled, loadAutosaves, saveAutosave, clearAutosaves };
})();
