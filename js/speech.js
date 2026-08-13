/* Utilidades de voz con Web Speech API. */
(function () {
  'use strict';

  function speak(text, lang = 'en-CA') {
    if (!('speechSynthesis' in window)) {
      alert('Tu navegador no soporta síntesis de voz.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.88;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => voice.lang.toLowerCase() === lang.toLowerCase()) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en-ca')) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }

  window.SpeechTools = { speak };
})();
