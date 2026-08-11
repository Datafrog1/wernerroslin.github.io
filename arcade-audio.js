if (!document.querySelector('script[src="analytics.js"]')) {
  const analyticsScript = document.createElement('script');
  analyticsScript.src = 'analytics.js';
  document.head.appendChild(analyticsScript);
}

(() => {
  let context = null;
  let muted = localStorage.getItem('wernerArcadeMuted') === 'true';

  function audioContext() {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') context.resume();
    return context;
  }

  function tone(frequency, duration = 0.08, wave = 'square', volume = 0.055, delay = 0) {
    if (muted) return;
    try {
      const ac = audioContext();
      const oscillator = ac.createOscillator();
      const gain = ac.createGain();
      const start = ac.currentTime + delay;
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(ac.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    } catch (_) {}
  }

  const effects = {
    start: () => { tone(330, .08, 'square'); tone(494, .11, 'square', .05, .09); },
    move: () => tone(180, .035, 'square', .025),
    action: () => tone(620, .055, 'square', .045),
    drop: () => { tone(240, .05, 'square'); tone(130, .09, 'square', .05, .045); },
    point: () => { tone(520, .06, 'square'); tone(780, .09, 'square', .05, .055); },
    hit: () => { tone(115, .13, 'sawtooth', .06); },
    level: () => [392, 494, 587, 784].forEach((f, i) => tone(f, .1, 'square', .05, i * .07)),
    gameover: () => [330, 247, 196, 131].forEach((f, i) => tone(f, .16, 'sawtooth', .045, i * .11))
  };

  window.arcadeSound = {
    play(name) { (effects[name] || effects.action)(); },
    toggle() {
      muted = !muted;
      localStorage.setItem('wernerArcadeMuted', String(muted));
      if (!muted) effects.start();
      return muted;
    },
    get muted() { return muted; }
  };

  addEventListener('keydown', event => {
    if (event.code === 'KeyM' && !event.repeat) window.arcadeSound.toggle();
    if (event.repeat) return;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(event.code)) effects.move();
    if (event.code === 'Space') effects.action();
  });

  addEventListener('pointerdown', event => {
    if (event.target.closest('canvas, .drop, .controls, .mobile-controls, .dpad')) effects.action();
  }, { passive: true });
})();
