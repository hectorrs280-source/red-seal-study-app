/* Modo flashcards con una variante simplificada del algoritmo SM-2. */
(function () {
  'use strict';

  const DAY_MS = 24 * 60 * 60 * 1000;

  function initialState() {
    return {
      repetitions: 0,
      interval: 0,
      easeFactor: 2.5,
      due: Date.now(),
      reviews: 0,
      lastQuality: null
    };
  }

  function reviewSM2(previous, quality) {
    const state = { ...initialState(), ...(previous || {}) };
    state.reviews += 1;
    state.lastQuality = quality;

    if (quality < 3) {
      state.repetitions = 0;
      state.interval = 1;
    } else {
      state.repetitions += 1;
      if (state.repetitions === 1) state.interval = 1;
      else if (state.repetitions === 2) state.interval = 6;
      else state.interval = Math.max(1, Math.round(state.interval * state.easeFactor));
    }

    state.easeFactor = Math.max(
      1.3,
      state.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );
    state.due = Date.now() + state.interval * DAY_MS;
    return state;
  }

  class FlashcardsController {
    constructor(root, terms, onProgressChanged) {
      this.root = root;
      this.terms = terms;
      this.onProgressChanged = onProgressChanged;
      this.category = window.ProgressStore.getSetting('flashcardCategory', 'Todas');
      this.index = 0;
      this.render();
    }

    get filteredTerms() {
      return this.category === 'Todas'
        ? this.terms
        : this.terms.filter((term) => term.category === this.category);
    }

    setCategory(category) {
      this.category = category;
      window.ProgressStore.setSetting('flashcardCategory', category);
      this.index = 0;
      this.renderCard();
    }

    focusTerm(termId) {
      const term = this.terms.find((item) => item.id === Number(termId));
      if (!term) return;
      this.category = term.category;
      const select = this.root.querySelector('#flashcard-category');
      if (select) select.value = term.category;
      const list = this.prioritizeDue(this.filteredTerms);
      const position = list.findIndex((item) => item.id === term.id);
      this.index = position >= 0 ? position : 0;
      this.renderCard();
    }

    prioritizeDue(list) {
      const now = Date.now();
      return [...list].sort((a, b) => {
        const aState = window.ProgressStore.getFlashcard(a.id) || initialState();
        const bState = window.ProgressStore.getFlashcard(b.id) || initialState();
        const aDue = aState.due <= now ? 0 : 1;
        const bDue = bState.due <= now ? 0 : 1;
        return aDue - bDue || aState.due - bState.due;
      });
    }

    current() {
      const list = this.prioritizeDue(this.filteredTerms);
      if (!list.length) return null;
      this.index = this.index % list.length;
      return list[this.index];
    }

    review(quality) {
      const term = this.current();
      if (!term) return;
      const previous = window.ProgressStore.getFlashcard(term.id);
      const next = reviewSM2(previous, quality);
      window.ProgressStore.updateFlashcard(term.id, next);
      this.index += 1;
      this.renderCard();
      if (this.onProgressChanged) this.onProgressChanged();
    }

    render() {
      const requiredCategories = ['General', 'Seguridad', 'Máquinas', 'Controles', 'Código Eléctrico'];
      const categories = ['Todas', ...new Set([...requiredCategories, ...this.terms.map((term) => term.category)])];
      if (!categories.includes(this.category)) this.category = 'Todas';
      this.root.innerHTML = `
        <div class="section-heading">
          <div>
            <p class="eyebrow">VOCABULARIO TÉCNICO</p>
            <h2>Flashcards con repetición espaciada</h2>
          </div>
          <label class="field compact">Categoría
            <select id="flashcard-category">
              ${categories.map((c) => `<option value="${escapeHtml(c)}" ${c === this.category ? 'selected' : ''}>${escapeHtml(c)}</option>`).join('')}
            </select>
          </label>
        </div>
        <div id="flashcard-stage"></div>
      `;
      this.root.querySelector('#flashcard-category').addEventListener('change', (event) => this.setCategory(event.target.value));
      this.renderCard();
    }

    renderCard() {
      const stage = this.root.querySelector('#flashcard-stage');
      const term = this.current();
      if (!term) {
        stage.innerHTML = '<div class="empty-state">No hay términos para esta categoría.</div>';
        return;
      }

      const state = window.ProgressStore.getFlashcard(term.id) || initialState();
      const dueText = state.reviews === 0
        ? 'Nueva tarjeta'
        : state.due <= Date.now()
          ? 'Repaso pendiente'
          : `Próximo repaso: ${new Date(state.due).toLocaleDateString('es-MX')}`;

      stage.innerHTML = `
        <article class="flashcard card">
          <div class="badge-row">
            <span class="badge">${escapeHtml(term.category)}</span>
            <span class="badge muted">${escapeHtml(dueText)}</span>
          </div>
          <div class="term-line">
            <h3>${escapeHtml(term.term_en)}</h3>
            <button class="icon-button" id="speak-term" aria-label="Escuchar término en inglés">🔊</button>
          </div>
          <p class="pronunciation">${escapeHtml(term.pronunciation)}</p>
          <p class="translation">${escapeHtml(term.term_es)}</p>
          <div class="example-box">
            <p><strong>EN:</strong> ${escapeHtml(term.example_en)}</p>
            <p><strong>ES:</strong> ${escapeHtml(term.example_es)}</p>
          </div>
          <div class="review-actions">
            <button class="button danger" id="did-not-know">No la sabía</button>
            <button class="button success" id="knew-it">La sabía</button>
          </div>
          <p class="microcopy">SM-2: repeticiones ${state.repetitions} · intervalo ${state.interval} día(s) · facilidad ${state.easeFactor.toFixed(2)}</p>
        </article>
      `;

      stage.querySelector('#speak-term').addEventListener('click', () => window.SpeechTools.speak(`${term.term_en}. ${term.example_en}`));
      stage.querySelector('#did-not-know').addEventListener('click', () => this.review(1));
      stage.querySelector('#knew-it').addEventListener('click', () => this.review(4));
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  window.FlashcardsController = FlashcardsController;
})();
