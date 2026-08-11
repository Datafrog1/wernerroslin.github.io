(() => {
  const ID = 'G-LRLHN7K86D';
  const KEY = 'wernerAnalyticsConsent';
  let loaded = false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    if (localStorage.getItem(KEY) === 'granted') window.dataLayer.push(arguments);
  };

  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ID}`;
    document.head.appendChild(script);
    window.gtag('js', new Date());
    window.gtag('config', ID, { anonymize_ip: true });
  }

  function clearCookies() {
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      if (name.startsWith('_ga')) document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    });
  }

  function setConsent(value) {
    localStorage.setItem(KEY, value);
    document.querySelector('.cookie-consent')?.remove();
    if (value === 'granted') loadAnalytics();
    else {
      clearCookies();
      if (loaded) window.dataLayer.push(['consent', 'update', { analytics_storage: 'denied' }]);
    }
  }

  function showConsent() {
    if (document.querySelector('.cookie-consent')) return;
    const banner = document.createElement('section');
    banner.className = 'cookie-consent';
    banner.setAttribute('aria-label', 'Analytics settings');
    banner.innerHTML = `<div><strong>Website analytics</strong><p>May I collect anonymous usage statistics with Google Analytics? They help me understand which pages and games people enjoy. Your choice does not affect how the site works.</p></div><div class="cookie-actions"><button type="button" data-consent="denied">Decline</button><button type="button" class="accept" data-consent="granted">Accept analytics</button></div>`;
    document.body.appendChild(banner);
    banner.querySelectorAll('[data-consent]').forEach(button => button.addEventListener('click', () => setConsent(button.dataset.consent)));
  }

  function addSettingsButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cookie-settings';
    button.textContent = 'Cookie settings';
    button.addEventListener('click', showConsent);
    document.body.appendChild(button);
  }

  window.trackArcadeEvent = (name, parameters = {}) => {
    if (localStorage.getItem(KEY) === 'granted') window.gtag('event', name, parameters);
  };

  function installStyles() {
    const style = document.createElement('style');
    style.textContent = `.cookie-consent{position:fixed;z-index:10000;left:18px;right:18px;bottom:18px;display:flex;align-items:center;justify-content:space-between;gap:22px;max-width:900px;margin:auto;padding:17px 18px;border:1px solid rgba(181,255,226,.22);border-radius:15px;color:#f2fff9;background:rgba(9,20,17,.97);box-shadow:0 20px 60px rgba(0,0,0,.5);font-family:Inter,system-ui,sans-serif;backdrop-filter:blur(16px)}.cookie-consent strong{display:block;margin-bottom:4px;font-size:14px}.cookie-consent p{max-width:590px;margin:0;color:#a9beb6;font-size:11px;line-height:1.5}.cookie-actions{display:flex;gap:8px;flex-shrink:0}.cookie-actions button,.cookie-settings{padding:9px 12px;border:1px solid rgba(181,255,226,.18);border-radius:9px;color:#f2fff9;background:#152720;font:800 10px Inter,system-ui,sans-serif;cursor:pointer}.cookie-actions .accept{border-color:#64f4bd;color:#062017;background:#64f4bd}.cookie-settings{position:fixed;z-index:9998;right:10px;bottom:10px;padding:6px 8px;opacity:.58;font-size:8px}.cookie-settings:hover{opacity:1}@media(max-width:650px){.cookie-consent{left:8px;right:8px;bottom:8px;display:block;padding:14px}.cookie-actions{margin-top:12px}.cookie-actions button{flex:1}.cookie-settings{right:6px;bottom:6px}}`;
    document.head.appendChild(style);
  }

  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (link && /arcade|tetris|snake|space|tower|paddle|brick|meteor|hopper|sky|target|color|lane|memory|reflex/.test(link.getAttribute('href') || '')) {
      window.trackArcadeEvent('arcade_game_open', { game_name: link.getAttribute('href') });
    }
    const startButton = event.target.closest('#start');
    if (startButton) {
      const gameName = document.body.dataset.game || location.pathname.split('/').pop().replace('.html', '');
      window.trackArcadeEvent('game_start', { game_name: gameName });
    }
  });

  function init() {
    installStyles();
    const consent = localStorage.getItem(KEY);
    if (consent === 'granted') loadAnalytics();
    else if (!consent) showConsent();
    addSettingsButton();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
