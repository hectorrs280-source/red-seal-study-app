/* Pronunciación canadiense mediante Web Speech API. */
(function () {
  'use strict';
  function speak(text, lang = 'en-CA') {
    if (!('speechSynthesis' in window)) { alert('Este navegador no soporta síntesis de voz.'); return; }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang; u.rate = 0.86;
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.toLowerCase() === 'en-ca') || voices.find(v => v.lang.toLowerCase().startsWith('en'));
    if (preferred) u.voice = preferred;
    speechSynthesis.speak(u);
  }
  window.SpeechTools = { speak };
})();
