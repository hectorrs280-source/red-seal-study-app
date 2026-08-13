/* Gestión de estadísticas y persistencia de progreso. */
(function () {
  'use strict';

  const KEY = 'redSealStudyProgressV1';

  function defaultProgress() {
    return {
      quiz: { answered: 0, correct: 0, byBlock: {}, history: [] },
      flashcards: {},
      settings: { flashcardCategory: 'Todas', quizBlock: 'Todos' },
      activityDates: [],
      lastUpdated: null
    };
  }

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY));
      if (!parsed || typeof parsed !== 'object') return defaultProgress();
      const defaults = defaultProgress();
      return {
        ...defaults,
        ...parsed,
        quiz: { ...defaults.quiz, ...(parsed.quiz || {}), byBlock: { ...(parsed.quiz?.byBlock || {}) }, history: [...(parsed.quiz?.history || [])] },
        flashcards: { ...(parsed.flashcards || {}) },
        settings: { ...defaults.settings, ...(parsed.settings || {}) },
        activityDates: [...(parsed.activityDates || [])]
      };
    } catch (_) {
      return defaultProgress();
    }
  }

  function save(progress) {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(KEY, JSON.stringify(progress));
  }

  function todayKey(date = new Date()) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }

  function touchActivity(progress) {
    const today = todayKey();
    if (!progress.activityDates.includes(today)) progress.activityDates.push(today);
    progress.activityDates = progress.activityDates.sort().slice(-180);
  }

  function recordQuizAnswer(block, isCorrect, detail = {}) {
    const progress = load();
    progress.quiz.answered += 1;
    if (isCorrect) progress.quiz.correct += 1;
    if (!progress.quiz.byBlock[block]) progress.quiz.byBlock[block] = { answered: 0, correct: 0 };
    progress.quiz.byBlock[block].answered += 1;
    if (isCorrect) progress.quiz.byBlock[block].correct += 1;

    // Conserva un historial compacto de respuestas para revisar el progreso sin servidor.
    progress.quiz.history.push({
      questionId: detail.questionId ?? null,
      block,
      selectedIndex: detail.selectedIndex ?? null,
      correctIndex: detail.correctIndex ?? null,
      isCorrect,
      answeredAt: new Date().toISOString()
    });
    progress.quiz.history = progress.quiz.history.slice(-500);

    touchActivity(progress);
    save(progress);
    return progress;
  }

  function setSetting(name, value) {
    const progress = load();
    progress.settings[name] = value;
    save(progress);
  }

  function getSetting(name, fallback = null) {
    const progress = load();
    return Object.prototype.hasOwnProperty.call(progress.settings, name) ? progress.settings[name] : fallback;
  }

  function updateFlashcard(termId, state) {
    const progress = load();
    progress.flashcards[String(termId)] = state;
    touchActivity(progress);
    save(progress);
    return progress;
  }

  function getFlashcard(termId) {
    const progress = load();
    return progress.flashcards[String(termId)] || null;
  }

  function calculateStreak(activityDates) {
    if (!activityDates.length) return 0;
    const set = new Set(activityDates);
    const cursor = new Date();
    let streak = 0;

    // Si hoy aún no hubo actividad, permitimos que la racha continúe desde ayer.
    if (!set.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (set.has(todayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function getStats() {
    const progress = load();
    const mastered = Object.values(progress.flashcards).filter((item) => item && item.repetitions >= 3 && item.easeFactor >= 2.3).length;
    return {
      ...progress,
      mastered,
      streak: calculateStreak(progress.activityDates)
    };
  }

  function reset() {
    localStorage.removeItem(KEY);
    return defaultProgress();
  }

  window.ProgressStore = {
    load,
    save,
    recordQuizAnswer,
    updateFlashcard,
    getFlashcard,
    getStats,
    setSetting,
    getSetting,
    reset
  };
})();
