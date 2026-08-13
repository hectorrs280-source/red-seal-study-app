/* Punto de entrada de la aplicación. Sin frameworks ni dependencias externas. */
(function () {
  'use strict';

  const FALLBACK = {
    terms: [
      { id: 1, term_en: 'Overcurrent protection device', term_es: 'Dispositivo de protección contra sobrecorriente', pronunciation: '/ˌoʊvərˈkɜːrənt prəˈtɛkʃən dɪˈvaɪs/', example_en: 'The circuit breaker is an overcurrent protection device that opens automatically during a fault.', example_es: 'El interruptor termomagnético es un dispositivo de protección contra sobrecorriente que se abre automáticamente durante una falla.', category: 'Seguridad' },
      { id: 2, term_en: 'Conduit', term_es: 'Tubería / conducto', pronunciation: '/ˈkɑːnduɪt/', example_en: 'Run the conductors through a rigid metal conduit.', example_es: 'Pasa los conductores a través de una tubería metálica rígida.', category: 'Instalación' },
      { id: 3, term_en: 'Overload relay', term_es: 'Relé de sobrecarga', pronunciation: '/ˈoʊvərˌloʊd ˈriːleɪ/', example_en: 'The overload relay protects the motor from sustained overcurrent.', example_es: 'El relé de sobrecarga protege al motor de sobrecorriente sostenida.', category: 'Controles' },
      { id: 4, term_en: 'Grounding electrode', term_es: 'Electrodo de puesta a tierra', pronunciation: '/ˈɡraʊndɪŋ ɪˈlɛkˌtroʊd/', example_en: 'The grounding electrode must be buried below the frost line.', example_es: 'El electrodo de puesta a tierra debe enterrarse por debajo de la línea de congelación.', category: 'Distribución' },
      { id: 5, term_en: 'Lockout/tagout', term_es: 'Bloqueo y etiquetado', pronunciation: '/ˈlɑːkaʊt ˈtæɡaʊt/', example_en: 'Always follow lockout/tagout procedures before servicing equipment.', example_es: 'Sigue siempre los procedimientos de bloqueo y etiquetado antes de dar servicio al equipo.', category: 'Seguridad' }
    ],
    questions: [
      { id: 1, block: 'Controles', question_en: 'An industrial electrician is troubleshooting a three-phase motor that trips its overload relay after running for 10 minutes. The motor nameplate current is 10 A. The overload relay is set to 12 A. Which of the following is the most likely cause?', options: ['A) The motor windings are shorted to ground.', 'B) The motor is single-phasing.', 'C) The motor is overloaded mechanically.', 'D) The overload relay is set too low.'], correct: 2, explanation_en: 'A gradual trip after 10 minutes indicates mechanical overload. A ground fault would trip the breaker instantly. Single-phasing usually trips within seconds. 12 A is a reasonable setting (120% of FLA), so it is not too low.', explanation_es: 'Un disparo gradual después de 10 minutos indica sobrecarga mecánica. Una falla a tierra dispararía el breaker instantáneamente. La pérdida de fase normalmente dispara en pocos segundos. 12 A es un ajuste razonable (120% de la corriente nominal), por lo que no está demasiado bajo.', follow_up: 'Explain why single-phasing causes faster tripping than mechanical overload.', follow_up_answer: 'Single-phasing causes a large current imbalance quickly, with one phase carrying excessive current, leading to rapid heating of the overload relay. Mechanical overload develops gradually as the load increases.', difficulty: 'medium' },
      { id: 2, block: 'Código Eléctrico', question_en: 'According to the Canadian Electrical Code, what is the minimum size of copper conductor required for a 100 A circuit at 75°C in a raceway with 4 current-carrying conductors?', options: ['A) #4 AWG', 'B) #3 AWG', 'C) #2 AWG', 'D) #1 AWG'], correct: 3, explanation_en: 'With 4 current-carrying conductors, you must derate to 80%. #3 AWG at 75°C is rated 100 A, but derated to 80% gives 80 A, insufficient. #2 AWG at 75°C is rated 115 A, derated to 92 A, still under 100 A. #1 AWG at 75°C is rated 130 A, derated to 104 A, sufficient.', explanation_es: 'Con 4 conductores activos, debes aplicar factor de corrección del 80%. #3 AWG a 75°C soporta 100 A, pero al 80% da 80 A, insuficiente. #2 AWG a 75°C soporta 115 A, al 80% da 92 A, aún por debajo de 100 A. #1 AWG a 75°C soporta 130 A, al 80% da 104 A, suficiente.', follow_up: 'What table in the CEC would you use to find the base ampacity of conductors?', follow_up_answer: 'Table 2 (for copper conductors in raceway) or Table 4 (for cable). You also need Table 5C for correction factors for more than 3 conductors.', difficulty: 'hard' },
      { id: 3, block: 'Seguridad', question_en: 'Before performing maintenance on a 600 V motor control center, the electrician must verify the absence of voltage. What is the correct sequence according to CSA Z462?', options: ['A) Test the voltmeter on a known source, test the equipment, test the voltmeter again.', 'B) Test the equipment with a voltmeter, then lockout the disconnect.', 'C) Open the disconnect, lock it out, then test the equipment.', 'D) Turn off the breaker and wait 5 minutes before testing.'], correct: 0, explanation_en: "CSA Z462 requires a 'live-dead-live' check: verify the meter works on a known live source, test the de-energized equipment, then verify the meter again to ensure it still works.", explanation_es: "CSA Z462 exige una verificación 'vivo-muerto-vivo': comprobar que el multímetro funciona en una fuente viva conocida, probar el equipo desenergizado y volver a verificar el multímetro para asegurar que sigue funcionando.", follow_up: 'Why is it important to re-test the voltmeter after measuring the equipment?', follow_up_answer: "To ensure the meter did not fail during the measurement, which could give a false 'no voltage' reading and create a serious safety hazard.", difficulty: 'medium' }
    ],
    guides: [
      { id: 1, block: 'Máquinas Eléctricas', title_en: 'Induction Motors', title_es: 'Motores de inducción', topics_en: ['Operating principle: rotating magnetic field', 'Slip and torque-speed characteristics', 'Squirrel cage vs wound rotor', 'Starting methods: DOL, star-delta, soft starter, VFD', 'Motor protection: overload, short circuit, ground fault'], topics_es: ['Principio de funcionamiento: campo magnético rotatorio', 'Deslizamiento y curva par-velocidad', 'Rotor jaula de ardilla vs rotor bobinado', 'Métodos de arranque: directo, estrella-delta, arrancador suave, variador de frecuencia', 'Protección del motor: sobrecarga, cortocircuito, falla a tierra'], term_ids: [3] }
    ]
  };

  const app = {
    data: FALLBACK,
    flashcards: null,
    quiz: null,
    activeTab: 'home'
  };

  async function loadJson(path, fallback) {
    if (location.protocol === 'file:') return fallback;
    try {
      const response = await fetch(path, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.warn(`No se pudo cargar ${path}; usando respaldo local.`, error);
      return fallback;
    }
  }

  async function init() {
    const [terms, questions, guides] = await Promise.all([
      loadJson('data/terms.json', FALLBACK.terms),
      loadJson('data/questions.json', FALLBACK.questions),
      loadJson('data/study_guides.json', FALLBACK.guides)
    ]);
    app.data = { terms, questions, guides };
    bindNavigation();
    renderHome();
    renderGuides();
    renderProgress();
    app.flashcards = new window.FlashcardsController(document.querySelector('#flashcards-root'), terms, renderProgress);
    app.quiz = new window.QuizController(document.querySelector('#quiz-root'), questions, renderProgress);
    registerServiceWorker();
  }

  function bindNavigation() {
    document.querySelectorAll('[data-tab]').forEach((button) => {
      button.addEventListener('click', () => activateTab(button.dataset.tab));
    });

  }

  function activateTab(tab) {
    app.activeTab = tab;
    document.querySelectorAll('[data-tab]').forEach((button) => button.classList.toggle('active', button.dataset.tab === tab));
    document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.toggle('active', panel.id === `tab-${tab}`));
    if (tab === 'progress') renderProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderHome() {
    const root = document.querySelector('#home-root');
    root.innerHTML = `
      <section class="hero">
        <div>
          <p class="eyebrow">RED SEAL · INDUSTRIAL ELECTRICIAN</p>
          <h1>Aprende el concepto.<br><span>Domina el inglés técnico.</span></h1>
          <p class="hero-copy">Preparación bilingüe para practicar vocabulario, razonamiento técnico y preguntas tipo examen sin depender de memorización mecánica.</p>
          <div class="hero-actions">
            <button class="button primary" data-go="quiz">Practicar quiz</button>
            <button class="button secondary" data-go="flashcards">Estudiar vocabulario</button>
          </div>
        </div>
        <div class="hero-panel" aria-label="Resumen de funciones">
          <div class="electric-mark">⚡</div>
          <strong>Study loop</strong>
          <ol>
            <li>Lee en inglés.</li>
            <li>Razona el diagnóstico.</li>
            <li>Comprueba la explicación.</li>
            <li>Explícalo con tus palabras.</li>
          </ol>
        </div>
      </section>
      <section class="feature-grid">
        <article class="feature-card"><span>01</span><h3>Flashcards SM-2</h3><p>El vocabulario que cuesta más vuelve antes.</p></article>
        <article class="feature-card"><span>02</span><h3>Quiz bilingüe</h3><p>Respuesta, explicación y verificación de comprensión.</p></article>
        <article class="feature-card"><span>03</span><h3>Audio en inglés</h3><p>Pronunciación canadiense mediante Web Speech API.</p></article>
        <article class="feature-card"><span>04</span><h3>Progreso local</h3><p>Todo queda guardado en este dispositivo.</p></article>
      </section>
    `;
    root.querySelectorAll('[data-go]').forEach((button) => button.addEventListener('click', () => activateTab(button.dataset.go)));
  }

  function renderGuides() {
    const root = document.querySelector('#guides-root');
    root.innerHTML = `
      <div class="section-heading"><div><p class="eyebrow">RUTA DE ESTUDIO</p><h2>Guías bilingües</h2></div></div>
      <div class="guide-grid">
        ${app.data.guides.map((guide) => `
          <article class="guide-card card">
            <div class="badge-row"><span class="badge">${escapeHtml(guide.block)}</span></div>
            <h3>${escapeHtml(guide.title_en)}</h3>
            <p class="translation">${escapeHtml(guide.title_es)}</p>
            <div class="bilingual-topics">
              <div><h4>English</h4><ol>${guide.topics_en.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ol></div>
              <div><h4>Español</h4><ol>${guide.topics_es.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ol></div>
            </div>
            <button class="button secondary guide-to-flashcards" data-term-ids="${(guide.term_ids || []).join(',')}">Ir a flashcards relacionadas</button>
          </article>
        `).join('')}
      </div>
    `;
    root.querySelectorAll('.guide-to-flashcards').forEach((button) => {
      button.addEventListener('click', () => {
        activateTab('flashcards');
        const ids = button.dataset.termIds.split(',').filter(Boolean);
        if (ids.length) app.flashcards?.focusTerm(Number(ids[0]));
      });
    });
  }

  function renderProgress() {
    const root = document.querySelector('#progress-root');
    const stats = window.ProgressStore.getStats();
    const overall = stats.quiz.answered ? Math.round((stats.quiz.correct / stats.quiz.answered) * 100) : 0;
    const blocks = Object.entries(stats.quiz.byBlock);

    root.innerHTML = `
      <div class="section-heading">
        <div><p class="eyebrow">DATOS LOCALES</p><h2>Panel de progreso</h2></div>
        <button class="button ghost" id="reset-progress">Reiniciar progreso</button>
      </div>
      <div class="stat-grid">
        <article class="stat-card"><span>Preguntas</span><strong>${stats.quiz.answered}</strong></article>
        <article class="stat-card"><span>Acierto total</span><strong>${overall}%</strong></article>
        <article class="stat-card"><span>Racha diaria</span><strong>${stats.streak}</strong><small>días</small></article>
        <article class="stat-card"><span>Términos dominados</span><strong>${stats.mastered}</strong></article>
      </div>
      <article class="card chart-card">
        <h3>Aciertos por bloque</h3>
        ${blocks.length ? blocks.map(([block, value]) => {
          const pct = value.answered ? Math.round((value.correct / value.answered) * 100) : 0;
          return `<div class="bar-row"><div class="bar-label"><span>${escapeHtml(block)}</span><strong>${pct}%</strong></div><div class="bar-track"><div class="bar-value" style="width:${pct}%"></div></div></div>`;
        }).join('') : '<div class="empty-state">Responde preguntas para generar estadísticas por bloque.</div>'}
      </article>
      <article class="card local-note"><strong>Privacidad:</strong> el progreso se almacena únicamente en <code>localStorage</code> del navegador actual.</article>
    `;
    root.querySelector('#reset-progress').addEventListener('click', () => {
      if (!confirm('¿Borrar todo el progreso?')) return;
      window.ProgressStore.reset();
      app.flashcards?.renderCard();
      renderProgress();
    });
  }

  function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('./service-worker.js').catch((error) => console.warn('Service worker no disponible:', error));
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

  document.addEventListener('DOMContentLoaded', init);
})();
