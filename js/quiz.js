/* Quiz normal y simulacro de 50 preguntas. */
(function () {
  'use strict';

  class QuizController {
    constructor(root, questions, onProgressChanged) {
      this.root = root;
      this.questions = questions;
      this.onProgressChanged = onProgressChanged;
      this.block = window.ProgressStore.getSetting('quizBlock', 'Todos');
      this.session = [];
      this.index = 0;
      this.score = 0;
      this.mode = 'practice';
      this.timerId = null;
      this.secondsRemaining = 0;
      this.answeredCurrent = false;
      this.renderSetup();
    }

    filteredQuestions() {
      return this.block === 'Todos'
        ? this.questions
        : this.questions.filter((question) => question.block === this.block);
    }

    shuffled(list) {
      const copy = [...list];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }

    buildSimulation(pool, count) {
      if (!pool.length) return [];
      const result = [];
      while (result.length < count) {
        result.push(...this.shuffled(pool));
      }
      return result.slice(0, count);
    }

    start(mode) {
      const pool = this.filteredQuestions();
      if (!pool.length) return;
      this.mode = mode;
      this.index = 0;
      this.score = 0;
      this.answeredCurrent = false;
      clearInterval(this.timerId);
      this.session = mode === 'simulation' ? this.buildSimulation(pool, 50) : this.shuffled(pool);
      if (mode === 'simulation') this.startTimer(60 * 60);
      this.renderQuestion();
    }

    startTimer(seconds) {
      this.secondsRemaining = seconds;
      this.timerId = setInterval(() => {
        this.secondsRemaining -= 1;
        const timer = this.root.querySelector('#quiz-timer');
        if (timer) timer.textContent = this.formatTime(this.secondsRemaining);
        if (this.secondsRemaining <= 0) {
          clearInterval(this.timerId);
          this.renderResults(true);
        }
      }, 1000);
    }

    formatTime(seconds) {
      const safe = Math.max(0, seconds);
      const minutes = Math.floor(safe / 60);
      const secs = safe % 60;
      return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    renderSetup() {
      const requiredBlocks = ['Seguridad', 'Planos', 'Máquinas', 'Controles', 'Distribución', 'Electrónica', 'Instalación'];
      const blocks = ['Todos', ...new Set([...requiredBlocks, ...this.questions.map((question) => question.block)])];
      this.root.innerHTML = `
        <div class="section-heading">
          <div>
            <p class="eyebrow">PRÁCTICA TIPO EXAMEN</p>
            <h2>Quiz Red Seal</h2>
          </div>
          <label class="field compact">Bloque
            <select id="quiz-block">
              ${blocks.map((block) => `<option value="${escapeHtml(block)}" ${block === this.block ? 'selected' : ''}>${escapeHtml(block)}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="quiz-launch-grid">
          <button class="mode-card" id="start-practice">
            <span class="mode-icon">🧠</span>
            <strong>Práctica</strong>
            <span>Recorre el banco filtrado sin límite de tiempo.</span>
          </button>
          <button class="mode-card" id="start-simulation">
            <span class="mode-icon">⏱️</span>
            <strong>Simulacro</strong>
            <span>50 preguntas aleatorias · temporizador de práctica de 60 min.</span>
          </button>
        </div>
        <p class="microcopy">Si el banco tiene menos de 50 preguntas, el simulacro reutiliza preguntas para mantener el flujo funcional de 50 reactivos.</p>
      `;
      this.root.querySelector('#quiz-block').addEventListener('change', (event) => {
        this.block = event.target.value;
        window.ProgressStore.setSetting('quizBlock', this.block);
      });
      this.root.querySelector('#start-practice').addEventListener('click', () => this.start('practice'));
      this.root.querySelector('#start-simulation').addEventListener('click', () => this.start('simulation'));
    }

    renderQuestion() {
      if (this.index >= this.session.length) {
        this.renderResults(false);
        return;
      }

      const question = this.session[this.index];
      this.answeredCurrent = false;
      const progressText = `${this.index + 1} / ${this.session.length}`;
      this.root.innerHTML = `
        <div class="quiz-topbar">
          <button class="text-button" id="exit-quiz">← Salir</button>
          <div class="quiz-progress"><span>${progressText}</span><div class="progress-track"><div class="progress-fill" style="width:${((this.index + 1) / this.session.length) * 100}%"></div></div></div>
          ${this.mode === 'simulation' ? `<span class="timer" id="quiz-timer">${this.formatTime(this.secondsRemaining)}</span>` : '<span></span>'}
        </div>
        <article class="question-card card">
          <div class="badge-row">
            <span class="badge">${escapeHtml(question.block)}</span>
            <span class="badge muted">${escapeHtml(question.difficulty)}</span>
          </div>
          <div class="question-title-row">
            <h3>${escapeHtml(question.question_en)}</h3>
            <button class="icon-button" id="speak-question" aria-label="Escuchar pregunta en inglés">🔊</button>
          </div>
          <div class="options" id="quiz-options">
            ${question.options.map((option, idx) => `<button class="option" data-index="${idx}">${escapeHtml(option)}</button>`).join('')}
          </div>
          <div id="answer-feedback"></div>
        </article>
      `;

      this.root.querySelector('#exit-quiz').addEventListener('click', () => {
        clearInterval(this.timerId);
        this.renderSetup();
      });
      this.root.querySelector('#speak-question').addEventListener('click', () => window.SpeechTools.speak(question.question_en));
      this.root.querySelectorAll('.option').forEach((button) => {
        button.addEventListener('click', () => this.answer(Number(button.dataset.index)));
      });
    }

    answer(selectedIndex) {
      if (this.answeredCurrent) return;
      this.answeredCurrent = true;
      const question = this.session[this.index];
      const correct = selectedIndex === question.correct;
      if (correct) this.score += 1;
      window.ProgressStore.recordQuizAnswer(question.block, correct, {
        questionId: question.id,
        selectedIndex,
        correctIndex: question.correct
      });
      if (this.onProgressChanged) this.onProgressChanged();

      this.root.querySelectorAll('.option').forEach((button) => {
        const idx = Number(button.dataset.index);
        button.disabled = true;
        if (idx === question.correct) button.classList.add('correct');
        if (idx === selectedIndex && !correct) button.classList.add('incorrect');
      });

      const feedback = this.root.querySelector('#answer-feedback');
      feedback.innerHTML = `
        <div class="feedback ${correct ? 'good' : 'bad'}">
          <h4>${correct ? '✓ Correcto' : '✕ Incorrecto'}</h4>
          <p><strong>ES:</strong> ${escapeHtml(question.explanation_es)}</p>
          <p><strong>EN:</strong> ${escapeHtml(question.explanation_en)}</p>
        </div>
        <div class="follow-up">
          <h4>Comprueba que entendiste</h4>
          <p lang="en">${escapeHtml(question.follow_up)}</p>
          <textarea id="follow-up-user" rows="4" placeholder="Explícalo con tus propias palabras. Esta respuesta no se califica automáticamente."></textarea>
          <div class="inline-actions">
            <button class="button secondary" id="show-model">Ver respuesta modelo</button>
            <button class="button primary" id="next-question">Siguiente</button>
          </div>
          <div id="model-answer"></div>
        </div>
      `;

      feedback.querySelector('#show-model').addEventListener('click', () => {
        feedback.querySelector('#model-answer').innerHTML = `<div class="model-answer"><strong>Respuesta modelo:</strong> ${escapeHtml(question.follow_up_answer)}</div>`;
      });
      feedback.querySelector('#next-question').addEventListener('click', () => {
        this.index += 1;
        this.renderQuestion();
      });
    }

    renderResults(timeExpired) {
      clearInterval(this.timerId);
      const answered = Math.min(this.index + (this.answeredCurrent ? 1 : 0), this.session.length);
      const denominator = answered || 1;
      const percentage = Math.round((this.score / denominator) * 100);
      this.root.innerHTML = `
        <article class="results-card card">
          <p class="eyebrow">${timeExpired ? 'TIEMPO TERMINADO' : 'SESIÓN COMPLETADA'}</p>
          <h2>${this.score} correctas de ${answered}</h2>
          <div class="score-ring" aria-label="${percentage}% de aciertos">${percentage}%</div>
          <p>Revisa las explicaciones y vuelve a practicar los bloques con menor porcentaje.</p>
          <button class="button primary" id="quiz-again">Volver al menú del quiz</button>
        </article>
      `;
      this.root.querySelector('#quiz-again').addEventListener('click', () => this.renderSetup());
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

  window.QuizController = QuizController;
})();
