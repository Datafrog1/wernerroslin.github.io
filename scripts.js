// Global JavaScript for Werner Roslin Website (light-only, no emojis)

/* -----------------------------------------------------------------------------
   Google Analytics (gtag) — turvallinen alustaja + apuri
----------------------------------------------------------------------------- */
(function initAnalytics() {
  const GA_ID = 'G-LRLHN7K86D';

  // Luo script-tag
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  s.onerror = () => console.warn('Analytics script failed to load.');
  document.head.appendChild(s);

  // gtag-puskuri ennen kuin GA on valmis
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
})();

// Yksinkertainen tapahtuma-apuri
function trackEvent(action, category, label, value) {
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value
      });
    }
  } catch (e) {
    // Ei estä sivua toimimasta
    console.debug('trackEvent error:', e);
  }
}

/* -----------------------------------------------------------------------------
   Utilityt
----------------------------------------------------------------------------- */

// Pehmeä scroll ylös
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Päivämäärän muotoilu (tarvittaessa)
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/* -----------------------------------------------------------------------------
   Viewport-animoinnit: kun elementti näkyy, fade-in + pieni siirto
   Kunnioittaa prefers-reduced-motion -asetusta.
----------------------------------------------------------------------------- */
function observeElements() {
  // Jos käyttäjä on valinnut vähennetyn liikkeen, ei tehdä efektejä
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const targets = document.querySelectorAll('section, .blog-post, .portfolio-item, .portfolio-card');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      el.style.transition = 'opacity 500ms ease, transform 500ms ease';
      obs.unobserve(el);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    observer.observe(el);
  });
}

/* -----------------------------------------------------------------------------
   Portfolio: haku + tagi-suodatus + analytiikka
   - HTML-odotukset:
     #portfolio-grid .portfolio-card[data-tags="ai frontend"]
     #portfolio-search
     .tag-chip[data-tag="ai|frontend|..."] (yksi "all")
----------------------------------------------------------------------------- */
function initPortfolioFilters() {
  const grid = document.getElementById('portfolio-grid');
  const search = document.getElementById('portfolio-search');
  const chips = Array.from(document.querySelectorAll('.tag-chip'));

  if (!grid || (!search && !chips.length)) return;

  const cards = Array.from(grid.querySelectorAll('.portfolio-card'));
  let activeTag = 'all';

  function applyFilters() {
    const q = (search?.value || '').trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase().split(/\s+/);
      const title = (card.querySelector('.portfolio-title')?.textContent || '').toLowerCase();
      const desc  = (card.querySelector('.portfolio-desc')?.textContent  || '').toLowerCase();

      const matchesTag = activeTag === 'all' || tags.includes(activeTag);
      const matchesSearch = !q || title.includes(q) || desc.includes(q);

      const show = matchesTag && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Pieni analytiikka: suodatuksen tulosmäärä
    trackEvent('filter_apply', 'Portfolio', `tag:${activeTag}|q:${q}`, visibleCount);
  }

  // Haku
  if (search) {
    search.addEventListener('input', () => {
      applyFilters();
      trackEvent('search_input', 'Portfolio', search.value);
    }, { passive: true });
  }

  // Tagit
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed', 'false'); });
      chip.classList.add('is-active');
      chip.setAttribute('aria-pressed', 'true');
      activeTag = chip.dataset.tag || 'all';
      applyFilters();
      trackEvent('tag_click', 'Portfolio', activeTag);
    });
  });

  // Alku
  applyFilters();
}

/* -----------------------------------------------------------------------------
   Klikkiseuranta: Live/Code -napit tms. (delegointi)
----------------------------------------------------------------------------- */
function initClickTracking() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    // Merkitään isot portfoliolinkit
    if (a.classList.contains('big-link')) {
      const label = a.textContent.trim().toLowerCase(); // "live" | "code" tms.
      trackEvent('portfolio_click', 'Portfolio', label);
    }
  }, { passive: true });
}

/* -----------------------------------------------------------------------------
   Pikanäppäimet (ei dark-modea):
   - Alt + / → fokus hakuun, jos portfolio-sivulla
   - Alt + H → etusivulle
----------------------------------------------------------------------------- */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (!e.altKey) return;

    // Alt + /
    if (e.key === '/') {
      const search = document.getElementById('portfolio-search');
      if (search) {
        e.preventDefault();
        search.focus();
      }
    }

    // Alt + H
    if (e.key.toLowerCase() === 'h') {
      e.preventDefault();
      window.location.href = 'index.html';
    }
  });
}

/* -----------------------------------------------------------------------------
   Käynnistys
----------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  observeElements();
  initPortfolioFilters();
  initClickTracking();
  initKeyboardShortcuts();

  console.log('Werner Roslin Website — scripts initialized');
});
