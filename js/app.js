/**
 * Aprendiendo MATLAB para análisis estructural
 * Controlador Principal de la Aplicación (UI, Router, Render y Búsqueda)
 */

class AppController {
  constructor() {
    this.currentView = 'home';
    this.currentLessonId = null;
    this.init();
  }

  init() {
    this.renderSidebarNavigation();
    this.bindEvents();
    this.handleRouteFromHash();
    progressTracker.updateUI();
  }

  // Configuración de eventos globales
  bindEvents() {
    // Manejo de cambios en el Hash (URL)
    window.addEventListener('hashchange', () => this.handleRouteFromHash());

    // Botón de menú en móvil
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    
    if (menuToggle && sidebar) {
      menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('active');
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });
    }

    // Modal de búsqueda
    const searchOpenBtn = document.getElementById('search-btn');
    const searchModal = document.getElementById('search-modal');
    const searchInput = document.getElementById('search-input');
    const modalClose = document.getElementById('modal-close');

    if (searchOpenBtn && searchModal) {
      searchOpenBtn.addEventListener('click', () => {
        searchModal.classList.add('open');
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
          this.performSearch('');
        }
      });
    }

    if (modalClose && searchModal) {
      modalClose.addEventListener('click', () => searchModal.classList.remove('open'));
    }

    if (searchModal) {
      searchModal.addEventListener('click', (e) => {
        if (e.target === searchModal) searchModal.classList.remove('open');
      });
    }

    // Atajo de teclado para buscar (Ctrl+K o /)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
        e.preventDefault();
        if (searchModal) {
          searchModal.classList.add('open');
          if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
            this.performSearch('');
          }
        }
      } else if (e.key === 'Escape' && searchModal && searchModal.classList.contains('open')) {
        searchModal.classList.remove('open');
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.performSearch(e.target.value));
    }
  }

  // Renderizar menú de navegación en Sidebar
  renderSidebarNavigation() {
    const navContainer = document.getElementById('sidebar-nav-list');
    if (!navContainer) return;

    let html = `
      <div class="nav-section-title">General</div>
      <a class="nav-item" data-nav="home" href="#home">
        <div class="nav-item-content">
          <span class="nav-item-icon">🏛️</span>
          <span>Inicio y Filosofía</span>
        </div>
      </a>
      <a class="nav-item" data-nav="glossary" href="#glossary">
        <div class="nav-item-content">
          <span class="nav-item-icon">📖</span>
          <span>Glosario Estructural</span>
        </div>
      </a>
      <a class="nav-item" data-nav="civil-example" href="#civil-example">
        <div class="nav-item-content">
          <span class="nav-item-icon">🏗️</span>
          <span>Caso Práctico Civil</span>
        </div>
      </a>
      <a class="nav-item" data-nav="errors" href="#errors">
        <div class="nav-item-content">
          <span class="nav-item-icon">⚠️</span>
          <span>Errores Frecuentes</span>
        </div>
      </a>

      <div class="nav-section-title" style="margin-top: 1rem;">Módulos del Curso</div>
    `;

    COURSE_DATA.modules.forEach(mod => {
      const isReady = mod.status === 'ready';
      html += `
        <div class="module-group" style="margin-bottom: 0.5rem;">
          <div style="font-size: 0.75rem; color: #94a3b8; padding: 0.4rem 0.75rem; font-weight: 600; display: flex; justify-content: space-between;">
            <span>Módulo ${mod.number}: ${mod.title}</span>
            <span style="font-size: 0.65rem; opacity: 0.8;">${isReady ? 'Disponible' : 'Próximamente'}</span>
          </div>
      `;

      if (mod.lessons && mod.lessons.length > 0) {
        mod.lessons.forEach(les => {
          const isComp = progressTracker.isLessonCompleted(les.id);
          html += `
            <a class="nav-item" data-nav="${les.id}" href="#lesson/${les.id}">
              <div class="nav-item-content">
                <span class="nav-item-icon">📄</span>
                <span title="${les.number}. ${les.title}">${les.number}. ${les.title}</span>
              </div>
              <span class="nav-status-badge ${isComp ? 'completed' : ''}" data-lesson-badge="${les.id}">
                ${isComp ? '✓ Hecho' : les.number}
              </span>
            </a>
          `;
        });
      } else {
        html += `
          <div style="padding: 0.3rem 0.75rem 0.5rem 2rem; font-size: 0.75rem; color: #64748b; font-style: italic;">
            ${mod.summary}
          </div>
        `;
      }

      html += `</div>`;
    });

    navContainer.innerHTML = html;
  }

  // Manejador de Hash Routing
  handleRouteFromHash() {
    const hash = window.location.hash.slice(1) || 'home';
    const container = document.getElementById('content-container');
    const breadcrumb = document.getElementById('breadcrumb-title');
    
    // Cerrar sidebar en móvil si estaba abierto
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');

    // Deseleccionar items activos en sidebar
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    if (hash === 'home') {
      this.currentView = 'home';
      this.renderHomeView(container);
      if (breadcrumb) breadcrumb.innerHTML = 'Inicio &bull; <span>Ruta de Aprendizaje</span>';
      const navItem = document.querySelector('[data-nav="home"]');
      if (navItem) navItem.classList.add('active');
    } else if (hash === 'glossary') {
      this.currentView = 'glossary';
      this.renderGlossaryView(container);
      if (breadcrumb) breadcrumb.innerHTML = 'Recursos &bull; <span>Glosario Estructural</span>';
      const navItem = document.querySelector('[data-nav="glossary"]');
      if (navItem) navItem.classList.add('active');
    } else if (hash === 'civil-example') {
      this.currentView = 'civil-example';
      this.renderCivilExampleView(container);
      if (breadcrumb) breadcrumb.innerHTML = 'Aplicación &bull; <span>Caso Práctico Civil</span>';
      const navItem = document.querySelector('[data-nav="civil-example"]');
      if (navItem) navItem.classList.add('active');
    } else if (hash === 'errors') {
      this.currentView = 'errors';
      this.renderErrorsView(container);
      if (breadcrumb) breadcrumb.innerHTML = 'Diagnóstico &bull; <span>Errores Frecuentes</span>';
      const navItem = document.querySelector('[data-nav="errors"]');
      if (navItem) navItem.classList.add('active');
    } else if (hash.startsWith('lesson/')) {
      const lessonId = hash.replace('lesson/', '');
      this.renderLessonView(container, lessonId);
    } else {
      this.renderHomeView(container);
    }

    // Scroll al tope
    const scrollArea = document.getElementById('content-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;
  }

  // 1. VISTA DE INICIO / DASHBOARD
  renderHomeView(container) {
    const pct = progressTracker.getProgressPercentage();
    
    container.innerHTML = `
      <div class="lesson-header">
        <span class="lesson-tag">Proyecto Educativo Universitario</span>
        <h1 class="lesson-title">${COURSE_DATA.title}</h1>
        <p class="lesson-subtitle">${COURSE_DATA.subtitle}</p>
      </div>

      <!-- Tarjeta de Filosofía Didáctica -->
      <div class="objective-card" style="border-left-color: var(--color-accent); background: #fffaf0; border-color: #feebc8;">
        <div class="objective-card-title" style="color: var(--color-accent);">
          <span>📐</span> Filosofía Didáctica del Curso
        </div>
        <p style="font-size: 1.05rem; font-weight: 600; color: #7b341e; margin-bottom: 0.5rem;">
          «${COURSE_DATA.philosophy}»
        </p>
        <p style="color: #4a5568; font-size: 0.92rem;">
          Este curso no enseña programación genérica ni sintaxis aislada. Cada comando de MATLAB se presenta como la representación computacional directa de un concepto de mecánica estructural o álgebra lineal.
        </p>
      </div>

      <!-- Métricas de Progreso -->
      <div class="lesson-section" style="display: flex; gap: 1.5rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
        <div>
          <h3 style="color: var(--color-primary-dark); margin-bottom: 0.25rem;">Tu Estado de Avance</h3>
          <p style="color: var(--text-secondary); font-size: 0.9rem;">Continúa con tus lecciones donde lo dejaste.</p>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="text-align: right;">
            <span style="font-size: 1.75rem; font-weight: 700; color: var(--color-primary-light);">${pct}%</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">Completado</span>
          </div>
          <a href="#lesson/${progressTracker.state.lastLessonId || 'les-1-1'}" class="btn btn-primary" style="padding: 0.75rem 1.25rem; font-size: 0.95rem;">
            Continuar Aprendizaje →
          </a>
        </div>
      </div>

      <!-- Ruta de Aprendizaje (10 Módulos) -->
      <h3 style="color: var(--color-primary-dark); margin: 2rem 0 1rem; font-size: 1.25rem;">
        Ruta Progresiva de Formación (10 Módulos)
      </h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
        ${COURSE_DATA.modules.map(mod => {
          const isReady = mod.status === 'ready';
          return `
            <div class="lesson-section" style="margin: 0; padding: 1.25rem; border-top: 4px solid ${isReady ? 'var(--color-primary-light)' : '#cbd5e1'};">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <span style="font-weight: 700; font-size: 0.8rem; color: var(--color-primary);">MÓDULO ${mod.number}</span>
                <span class="nav-status-badge ${isReady ? 'completed' : ''}">${isReady ? 'Disponible' : 'Próximamente'}</span>
              </div>
              <h4 style="color: var(--color-primary-dark); font-size: 1rem; margin-bottom: 0.5rem;">${mod.title}</h4>
              <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1rem;">${mod.summary}</p>
              ${isReady && mod.lessons ? `
                <div style="display: flex; flex-direction: column; gap: 0.35rem;">
                  ${mod.lessons.map(l => `
                    <a href="#lesson/${l.id}" style="font-size: 0.82rem; color: var(--color-primary-light); text-decoration: none; font-weight: 500;">
                      ▶ Lección ${l.number}: ${l.title}
                    </a>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 2. VISTA DE LECCIÓN
  renderLessonView(container, lessonId) {
    let currentLesson = null;
    let parentModule = null;
    let prevLesson = null;
    let nextLesson = null;

    const allLessons = [];
    COURSE_DATA.modules.forEach(m => {
      if (m.lessons) {
        m.lessons.forEach(l => {
          allLessons.push({ lesson: l, module: m });
        });
      }
    });

    for (let i = 0; i < allLessons.length; i++) {
      if (allLessons[i].lesson.id === lessonId) {
        currentLesson = allLessons[i].lesson;
        parentModule = allLessons[i].module;
        prevLesson = i > 0 ? allLessons[i - 1].lesson : null;
        nextLesson = i < allLessons.length - 1 ? allLessons[i + 1].lesson : null;
        break;
      }
    }

    if (!currentLesson) {
      container.innerHTML = `<div class="lesson-section"><h3>Lección no encontrada</h3><p>La lección solicitada no existe o aún está en preparación.</p><a href="#home" class="btn btn-primary">Volver al Inicio</a></div>`;
      return;
    }

    this.currentLessonId = lessonId;
    progressTracker.setLastVisitedLesson(lessonId);

    const breadcrumb = document.getElementById('breadcrumb-title');
    if (breadcrumb) {
      breadcrumb.innerHTML = `Módulo ${parentModule.number} &bull; <span>Lección ${currentLesson.number}</span>`;
    }

    const navItem = document.querySelector(`[data-nav="${lessonId}"]`);
    if (navItem) navItem.classList.add('active');

    const isCompleted = progressTracker.isLessonCompleted(lessonId);

    container.innerHTML = `
      <div class="lesson-header">
        <span class="lesson-tag">Módulo ${parentModule.number} &bull; Lección ${currentLesson.number}</span>
        <h1 class="lesson-title">${currentLesson.title}</h1>
      </div>

      <!-- 1. Objetivo de Aprendizaje -->
      <div class="objective-card">
        <div class="objective-card-title">
          <span>🎯</span> Objetivo de Aprendizaje
        </div>
        <p>${currentLesson.objective}</p>
      </div>

      <!-- 2. Concepto Teórico -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">📚</span> Concepto Teórico y Fundamentación
        </h3>
        <div style="font-size: 0.95rem; color: var(--text-primary); line-height: 1.7;">
          ${currentLesson.theory.replace(/\n\n/g, '<br><br>')}
        </div>
      </div>

      <!-- 3. Expresión Matemática -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">∑</span> Formulación Matemática
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          Representación analítica de la operación que implementaremos en MATLAB:
        </p>
        <div class="math-block">
          <div class="math-display">
            ${currentLesson.math}
          </div>
        </div>
      </div>

      <!-- 4. Glosario de Variables Utilizadas -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">📋</span> Glosario de Variables y Nomenclatura
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary);">
          Significado físico y matemático de las variables declaradas en esta lección:
        </p>
        <div class="variable-table-wrapper">
          <table class="variable-table">
            <thead>
              <tr>
                <th style="width: 25%;">Variable</th>
                <th>Significado / Función en el Análisis</th>
              </tr>
            </thead>
            <tbody>
              ${currentLesson.glossary.map(g => `
                <tr>
                  <td><span class="var-tag">${g.var}</span></td>
                  <td>${g.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- 5. Código MATLAB -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">💻</span> Implementación en MATLAB
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          Código fuente comentado siguiendo las mejores prácticas de cálculo estructural:
        </p>
        <div class="code-container">
          <div class="code-header">
            <div class="code-title">
              <span class="matlab-badge">MATLAB</span>
              <span>leccion_${currentLesson.number.replace('.', '_')}.m</span>
            </div>
            <button class="copy-btn" onclick="appController.copyCode(this)">
              <span>📋</span> Copiar código
            </button>
          </div>
          <div class="code-body">
            <pre><code>${this.syntaxHighlight(currentLesson.code)}</code></pre>
          </div>
        </div>

        <!-- 6. Explicación Línea por Línea -->
        <h4 style="font-size: 1rem; color: var(--color-primary-dark); margin: 1.5rem 0 0.75rem;">
          Explicación Detallada Línea por Línea
        </h4>
        <ul class="line-by-line-list">
          ${currentLesson.lineByLine.map(lbl => `
            <li class="line-by-line-item">
              <span class="line-code-tag">${lbl.code}</span>
              <span class="line-explanation">${lbl.desc}</span>
            </li>
          `).join('')}
        </ul>

        <!-- 7. Resultado Esperado en MATLAB -->
        <h4 style="font-size: 1rem; color: var(--color-primary-dark); margin: 1.5rem 0 0.75rem;">
          Resultado Esperado en el Command Window
        </h4>
        <div class="output-container">
          <div class="output-header">
            <span>&gt;&gt; Command Window (Salida de MATLAB)</span>
          </div>
          <div class="output-body">
            <pre>${currentLesson.output}</pre>
          </div>
        </div>

        <!-- 8. Interpretación del Resultado -->
        <div class="callout callout-interpretation">
          <div class="callout-icon">🔍</div>
          <div class="callout-content">
            <h4>Interpretación del Resultado Estructural</h4>
            <p>${currentLesson.interpretation}</p>
          </div>
        </div>

        <!-- 9. Error Frecuente -->
        <div class="callout callout-error">
          <div class="callout-icon">⚠️</div>
          <div class="callout-content">
            <h4>Error Frecuente: ${currentLesson.frequentError.title}</h4>
            <p>${currentLesson.frequentError.desc}</p>
          </div>
        </div>
      </div>

      <!-- 10. Ejercicio Guiado -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">✍️</span> Ejercicio Guiado
        </h3>
        <div class="exercise-box guided">
          <div class="exercise-header">
            <span class="exercise-badge guided-badge">Paso a paso</span>
          </div>
          <p class="exercise-prompt">${currentLesson.guidedExercise.prompt}</p>
          <div class="code-container" style="margin-top: 0.75rem;">
            <div class="code-header">
              <span class="code-title" style="color: #cbd5e1;">Solución del Ejercicio Guiado</span>
              <button class="copy-btn" onclick="appController.copyCode(this)">
                <span>📋</span> Copiar
              </button>
            </div>
            <div class="code-body">
              <pre><code>${this.syntaxHighlight(currentLesson.guidedExercise.solutionCode)}</code></pre>
            </div>
          </div>
        </div>
      </div>

      <!-- 11. Ejercicio Interactivo -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">⚡</span> Ejercicio Interactivo para Resolver
        </h3>
        ${this.renderInteractiveExercise(currentLesson.interactiveExercise)}
      </div>

      <!-- 12. Autoevaluación Rápida -->
      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">📝</span> Pregunta de Autoevaluación
        </h3>
        <div class="exercise-box">
          <p class="exercise-prompt" style="font-weight: 600;">${currentLesson.quiz.question}</p>
          <div class="exercise-options">
            ${currentLesson.quiz.options.map((opt, idx) => `
              <label class="option-label">
                <input type="radio" name="quiz-opt-${currentLesson.id}" value="${idx}">
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="exercise-controls">
            <button class="btn btn-primary" onclick="exerciseEngine.checkQuiz('${currentLesson.id}', ${currentLesson.quiz.correctIndex}, \`${currentLesson.quiz.explanation.replace(/`/g, '\\`')}\`)">
              Validar Autoevaluación
            </button>
          </div>
          <div id="quiz-feedback-${currentLesson.id}" class="exercise-feedback"></div>
        </div>
      </div>

      <!-- Navegación y Finalización de Lección -->
      <div class="lesson-footer-nav">
        <div>
          ${prevLesson ? `
            <a href="#lesson/${prevLesson.id}" class="btn btn-secondary">
              ← Anterior: Lección ${prevLesson.number}
            </a>
          ` : `
            <a href="#home" class="btn btn-secondary">← Volver al Inicio</a>
          `}
        </div>

        <button id="btn-toggle-complete" 
                data-current-lesson="${currentLesson.id}"
                class="complete-lesson-btn ${isCompleted ? 'is-completed' : ''}" 
                onclick="appController.toggleCompleteCurrentLesson('${currentLesson.id}')">
          ${isCompleted ? '<span>✓</span> Lección Completada' : '<span>○</span> Marcar como completada'}
        </button>

        <div>
          ${nextLesson ? `
            <a href="#lesson/${nextLesson.id}" class="btn btn-primary">
              Siguiente: Lección ${nextLesson.number} →
            </a>
          ` : `
            <a href="#civil-example" class="btn btn-primary">Ver Caso Práctico Civil →</a>
          `}
        </div>
      </div>
    `;
  }

  // Renderizar componente de Ejercicio Interactivo
  renderInteractiveExercise(ex) {
    if (!ex) return '';
    
    if (ex.type === 'code-fill') {
      return `
        <div class="exercise-box">
          <div class="exercise-header">
            <span class="exercise-badge interactive-badge">${ex.badge}</span>
          </div>
          <p class="exercise-prompt">${ex.prompt}</p>
          <div class="exercise-input-wrapper">
            <input type="text" id="input-${ex.id}" class="exercise-input" placeholder="${ex.placeholder}" spellcheck="false" autocomplete="off">
          </div>
          <div class="exercise-controls">
            <button class="btn btn-primary" onclick="exerciseEngine.checkCodeFill('${ex.id}', \`${ex.expectedAnswer.replace(/`/g, '\\`')}\`)">
              🔍 Comprobar respuesta
            </button>
            <button class="btn btn-secondary" onclick="exerciseEngine.showHint('${ex.id}', \`${ex.hint.replace(/`/g, '\\`')}\`)">
              💡 Pista
            </button>
            <button class="btn btn-outline" onclick="exerciseEngine.showSolution('${ex.id}', \`${ex.solution.replace(/`/g, '\\`')}\`)">
              👁️ Mostrar solución
            </button>
            <button class="btn btn-outline" onclick="exerciseEngine.resetExercise('${ex.id}')">
              🔄 Reiniciar
            </button>
          </div>
          <div id="feedback-${ex.id}" class="exercise-feedback"></div>
        </div>
      `;
    } else if (ex.type === 'prediction') {
      return `
        <div class="exercise-box">
          <div class="exercise-header">
            <span class="exercise-badge interactive-badge">${ex.badge}</span>
          </div>
          <p class="exercise-prompt">${ex.prompt}</p>
          <div class="exercise-options">
            ${ex.options.map((opt, idx) => `
              <label class="option-label">
                <input type="radio" name="opt-${ex.id}" value="${idx}">
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="exercise-controls">
            <button class="btn btn-primary" onclick="exerciseEngine.checkPrediction('${ex.id}', ${ex.correctIndex}, \`${ex.solution.replace(/`/g, '\\`')}\`)">
              🔍 Comprobar predicción
            </button>
            <button class="btn btn-secondary" onclick="exerciseEngine.showHint('${ex.id}', \`${ex.hint.replace(/`/g, '\\`')}\`)">
              💡 Pista
            </button>
            <button class="btn btn-outline" onclick="exerciseEngine.showSolution('${ex.id}', \`${ex.solution.replace(/`/g, '\\`')}\`)">
              👁️ Mostrar solución
            </button>
            <button class="btn btn-outline" onclick="exerciseEngine.resetExercise('${ex.id}')">
              🔄 Reiniciar
            </button>
          </div>
          <div id="feedback-${ex.id}" class="exercise-feedback"></div>
        </div>
      `;
    }
    return '';
  }

  // 3. VISTA CASO PRÁCTICO CIVIL
  renderCivilExampleView(container) {
    const ex = COURSE_DATA.civilEngineeringExample;
    container.innerHTML = `
      <div class="lesson-header">
        <span class="lesson-tag">${ex.badge}</span>
        <h1 class="lesson-title">${ex.title}</h1>
        <p class="lesson-subtitle">${ex.description}</p>
      </div>

      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">📐</span> Esquema Geométrico de la Barra
        </h3>
        <p style="font-size: 0.92rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
          Diagrama de coordenadas globales, proyecciones ortogonales y longitud euclidiana:
        </p>
        ${ex.diagramSvg}
      </div>

      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">∑</span> Formulación Matemática Vectorial
        </h3>
        <div class="math-block">
          <div class="math-display">
            ${ex.math}
          </div>
        </div>
      </div>

      <div class="lesson-section">
        <h3 class="section-heading">
          <span class="section-heading-icon">💻</span> Código en MATLAB y Extracción con Indexación
        </h3>
        <div class="code-container">
          <div class="code-header">
            <span class="code-title"><span class="matlab-badge">MATLAB</span> calculo_propiedades_barra.m</span>
            <button class="copy-btn" onclick="appController.copyCode(this)">
              <span>📋</span> Copiar código
            </button>
          </div>
          <div class="code-body">
            <pre><code>${this.syntaxHighlight(ex.code)}</code></pre>
          </div>
        </div>

        <h4 style="font-size: 1rem; color: var(--color-primary-dark); margin: 1.5rem 0 0.75rem;">
          Resultado en el Command Window
        </h4>
        <div class="output-container">
          <div class="output-header">&gt;&gt; Command Window</div>
          <div class="output-body"><pre>${ex.output}</pre></div>
        </div>

        <div class="callout callout-interpretation">
          <div class="callout-icon">🔍</div>
          <div class="callout-content">
            <h4>Interpretación para el Análisis Matricial</h4>
            <p>${ex.interpretation}</p>
          </div>
        </div>
      </div>

      <div class="lesson-footer-nav">
        <a href="#lesson/les-2-2" class="btn btn-secondary">← Volver a Matrices Coord y Con</a>
        <a href="#glossary" class="btn btn-primary">Ir al Glosario Estructural →</a>
      </div>
    `;
  }

  // 4. VISTA DE GLOSARIO
  renderGlossaryView(container) {
    container.innerHTML = `
      <div class="lesson-header">
        <span class="lesson-tag">Nomenclatura Estándar</span>
        <h1 class="lesson-title">Glosario de MATLAB para Análisis Matricial</h1>
        <p class="lesson-subtitle">Notación unificada y significado matemático y físico de las variables utilizadas en todo el curso.</p>
      </div>

      <div class="lesson-section">
        <div style="margin-bottom: 1.25rem;">
          <input type="text" id="glossary-filter" class="exercise-input" placeholder="🔍 Filtrar variables (ej: Coord, Ke, gdl_libres, K)..." oninput="appController.filterGlossary(this.value)">
        </div>
        <div class="variable-table-wrapper">
          <table class="variable-table" id="glossary-table">
            <thead>
              <tr>
                <th style="width: 20%;">Variable</th>
                <th style="width: 30%;">Nombre Formal</th>
                <th style="width: 20%;">Dimensiones Típicas</th>
                <th>Descripción y Significado en el Método</th>
              </tr>
            </thead>
            <tbody>
              ${COURSE_DATA.glossaryList.map(g => `
                <tr class="glossary-row" data-term="${g.var.toLowerCase()} ${g.name.toLowerCase()} ${g.desc.toLowerCase()}">
                  <td><span class="var-tag">${g.var}</span></td>
                  <td><strong>${g.name}</strong></td>
                  <td style="font-family: var(--font-mono); font-size: 0.85rem; color: #475569;">${g.dim}</td>
                  <td>${g.desc}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  filterGlossary(term) {
    const q = term.toLowerCase().trim();
    const rows = document.querySelectorAll('.glossary-row');
    rows.forEach(r => {
      const match = r.getAttribute('data-term').includes(q);
      r.style.display = match ? '' : 'none';
    });
  }

  // 5. VISTA DE ERRORES FRECUENTES
  renderErrorsView(container) {
    container.innerHTML = `
      <div class="lesson-header">
        <span class="lesson-tag">Guía de Prevención y Depuración</span>
        <h1 class="lesson-title">Catálogo de Errores Frecuentes en MATLAB</h1>
        <p class="lesson-subtitle">Identificación, causa técnica y corrección inmediata de errores habituales en cálculo matricial.</p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        ${COURSE_DATA.frequentErrorsList.map(err => `
          <div class="lesson-section" style="margin: 0; border-left: 4px solid var(--status-danger);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h3 style="color: #991b1b; font-size: 1.15rem; margin: 0;">${err.title}</h3>
              <span class="nav-status-badge" style="background: #fee2e2; color: #991b1b; font-weight: 700;">${err.severity}</span>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1rem 0;">
              <!-- Código Incorrecto -->
              <div class="code-container" style="margin: 0; border-color: #fca5a5;">
                <div class="code-header" style="background: #450a0a;">
                  <span class="code-title" style="color: #fca5a5;">❌ Práctica Inadecuada o Errónea</span>
                </div>
                <div class="code-body">
                  <pre><code>${this.syntaxHighlight(err.badCode)}</code></pre>
                </div>
              </div>

              <!-- Código Correcto -->
              <div class="code-container" style="margin: 0; border-color: #86efac;">
                <div class="code-header" style="background: #052e16;">
                  <span class="code-title" style="color: #86efac;">✅ Código Recomendado / Riguroso</span>
                </div>
                <div class="code-body">
                  <pre><code>${this.syntaxHighlight(err.goodCode)}</code></pre>
                </div>
              </div>
            </div>

            <div class="callout callout-interpretation" style="margin-top: 1rem; border-color: #cbd5e1; background: #f8fafc;">
              <div class="callout-icon">💡</div>
              <div class="callout-content">
                <h4 style="color: var(--color-primary-dark);">Explicación Técnica</h4>
                <p style="color: var(--text-secondary);">${err.why}</p>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Copiar código de forma limpia extrayendo el contenido del bloque pre
  copyCode(btn) {
    const codeBlock = btn.closest('.code-container')?.querySelector('pre');
    if (!codeBlock) return;
    const textToCopy = codeBlock.innerText;

    navigator.clipboard.writeText(textToCopy).then(() => {
      const origHtml = btn.innerHTML;
      btn.innerHTML = `<span>✓</span> Copiado`;
      btn.classList.add('copied');
      setTimeout(() => {
        btn.innerHTML = origHtml;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => {
      console.error("Error al copiar:", err);
    });
  }

  // Marcar lección actual como completada
  toggleCompleteCurrentLesson(lessonId) {
    const newState = progressTracker.toggleLessonCompleted(lessonId);
    const btn = document.getElementById('btn-toggle-complete');
    if (btn) {
      if (newState) {
        btn.innerHTML = `<span>✓</span> Lección Completada`;
        btn.classList.add('is-completed');
      } else {
        btn.innerHTML = `<span>○</span> Marcar como completada`;
        btn.classList.remove('is-completed');
      }
    }
  }

  // Resaltado de sintaxis simple y robusto para MATLAB
  syntaxHighlight(code) {
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      // Comentarios (% ...)
      .replace(/(%.*$)/gm, '<span class="m-comment">$1</span>')
      // Strings ('...')
      .replace(/('.*?')/g, '<span class="m-string">$1</span>')
      // Palabras clave
      .replace(/\b(clc|clear|close|all|format|long|short|shortEng|for|end|if|else|function|while)\b/g, '<span class="m-keyword">$1</span>')
      // Funciones matriciales
      .replace(/\b(zeros|ones|eye|size|length|sqrt|fprintf|inv|plot|hold|axis|grid|text)\b/g, '<span class="m-func">$1</span>')
      // Números
      .replace(/\b(\d+(\.\d+)?(e[+-]?\d+)?)\b/g, '<span class="m-number">$1</span>');
  }

  // Motor de Búsqueda
  performSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    const q = query.toLowerCase().trim();
    if (!q) {
      resultsContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #94a3b8;">Escribe para buscar lecciones, variables del glosario o errores frecuentes...</div>`;
      return;
    }

    const matches = [];

    // Buscar en lecciones
    COURSE_DATA.modules.forEach(m => {
      if (m.lessons) {
        m.lessons.forEach(l => {
          if (l.title.toLowerCase().includes(q) || l.theory.toLowerCase().includes(q) || l.objective.toLowerCase().includes(q)) {
            matches.push({
              type: 'Lección',
              title: `Lección ${l.number}: ${l.title}`,
              desc: l.objective,
              link: `#lesson/${l.id}`
            });
          }
        });
      }
    });

    // Buscar en glosario
    COURSE_DATA.glossaryList.forEach(g => {
      if (g.var.toLowerCase().includes(q) || g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q)) {
        matches.push({
          type: 'Glosario',
          title: `Variable: ${g.var} (${g.name})`,
          desc: g.desc,
          link: '#glossary'
        });
      }
    });

    // Buscar en errores
    COURSE_DATA.frequentErrorsList.forEach(e => {
      if (e.title.toLowerCase().includes(q) || e.why.toLowerCase().includes(q)) {
        matches.push({
          type: 'Error Frecuente',
          title: `Error: ${e.title}`,
          desc: e.why,
          link: '#errors'
        });
      }
    });

    if (matches.length === 0) {
      resultsContainer.innerHTML = `<div style="padding: 1.5rem; text-align: center; color: #64748b;">No se encontraron resultados para "<strong>${query}</strong>"</div>`;
      return;
    }

    resultsContainer.innerHTML = matches.slice(0, 10).map(m => `
      <div class="search-result-item" onclick="window.location.hash='${m.link}'; document.getElementById('search-modal').classList.remove('open');">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2rem;">
          <h5>${m.title}</h5>
          <span class="nav-status-badge" style="font-size: 0.6rem;">${m.type}</span>
        </div>
        <p>${m.desc.slice(0, 120)}...</p>
      </div>
    `).join('');
  }
}

// Inicialización global al cargar DOM
let appController;
document.addEventListener('DOMContentLoaded', () => {
  appController = new AppController();
});
