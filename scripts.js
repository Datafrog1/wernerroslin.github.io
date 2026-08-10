(() => {
  const root = document.documentElement;
  const button = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('wr-theme');
  const preferredLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (preferredLight ? 'light' : 'dark');

  function applyTheme(theme) {
    if (theme === 'light') {
      root.dataset.theme = 'light';
      if (button) {
        button.textContent = '☾';
        button.setAttribute('aria-label', 'Switch to dark theme');
      }
    } else {
      delete root.dataset.theme;
      if (button) {
        button.textContent = '☀';
        button.setAttribute('aria-label', 'Switch to light theme');
      }
    }
  }

  applyTheme(initialTheme);

  if (button) {
    button.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('wr-theme', next);
      applyTheme(next);
    });
  }

  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
