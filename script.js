// Basic interactivity for the placeholder game page:
// - theme toggle (dark/light)
// - search/filter slots by title
// - open/close modal preview
// - fill dynamic year in footer
// Accessible keyboard handling included.

(function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const searchInput = document.getElementById('search-input');
  const grid = document.getElementById('game-grid');
  const modal = document.getElementById('game-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalClose = modal.querySelector('.modal-close');
  const yearEl = document.getElementById('year');

  // Init year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme (persist in localStorage)
  const THEME_KEY = 'htg_theme';
  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.style.setProperty('color-scheme', 'light');
      root.style.setProperty('--bg', '#f6f7fb');
      root.style.setProperty('--panel', 'rgba(2,6,23,0.03)');
      themeBtn.setAttribute('aria-pressed', 'true');
    } else {
      root.style.setProperty('color-scheme', 'dark');
      root.style.setProperty('--bg', '#05060a');
      root.style.setProperty('--panel', 'rgba(255,255,255,0.02)');
      themeBtn.setAttribute('aria-pressed', 'false');
    }
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
  };

  const saved = (function(){
    try { return localStorage.getItem(THEME_KEY); } catch(e){ return null; }
  })();
  applyTheme(saved || 'dark');

  themeBtn.addEventListener('click', () => {
    const next = (root.style.getPropertyValue('color-scheme') === 'light') ? 'dark' : 'light';
    applyTheme(next);
  });

  // Simple search/filter
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const items = grid.querySelectorAll('.game-card');
    items.forEach(card => {
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      if (!q || title.includes(q)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });

  // Modal handling
  function openModal(title) {
    modalTitle.textContent = title || 'Slot Preview';
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('.modal-close')?.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Delegate click on grid buttons and cards
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
      const action = btn.dataset.action;
      const card = btn.closest('.game-card');
      const title = card?.dataset.title || 'Slot';
      if (action === 'view' || action === 'edit' || action === 'unlock') {
        openModal(title);
      }
      return;
    }
    const card = e.target.closest('.game-card');
    if (card) {
      openModal(card.dataset.title || 'Slot Preview');
    }
  });

  // Keyboard: Enter or Space opens focused card
  grid.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.game-card')) {
      e.preventDefault();
      const card = e.target.closest('.game-card');
      openModal(card.dataset.title || 'Slot Preview');
    }
  });

  // Modal close events
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // "New slot" quick action
  const newBtn = document.getElementById('new-game-btn');
  newBtn.addEventListener('click', () => {
    openModal('Configure new slot');
  });

  // Tour button (simple toast/stub)
  document.getElementById('tour').addEventListener('click', () => {
    alert('This is a preview layout. Click cards to open a slot preview modal. Use the search to filter slots and the theme button to toggle theme.');
  });
})();
