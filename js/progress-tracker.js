/**
 * Aprendiendo MATLAB para análisis estructural
 * Gestor de Progreso y Almacenamiento Local (localStorage)
 */

class ProgressTracker {
  constructor() {
    this.storageKey = 'matlab_structural_progress_v1';
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          completedLessons: new Set(parsed.completedLessons || []),
          lastLessonId: parsed.lastLessonId || 'les-1-1',
          quizScores: parsed.quizScores || {}
        };
      }
    } catch (e) {
      console.warn("No se pudo cargar localStorage:", e);
    }
    return {
      completedLessons: new Set(),
      lastLessonId: 'les-1-1',
      quizScores: {}
    };
  }

  saveState() {
    try {
      const dataToSave = {
        completedLessons: Array.from(this.state.completedLessons),
        lastLessonId: this.state.lastLessonId,
        quizScores: this.state.quizScores
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  isLessonCompleted(lessonId) {
    return this.state.completedLessons.has(lessonId);
  }

  toggleLessonCompleted(lessonId) {
    if (this.state.completedLessons.has(lessonId)) {
      this.state.completedLessons.delete(lessonId);
    } else {
      this.state.completedLessons.add(lessonId);
    }
    this.saveState();
    this.updateUI();
    return this.isLessonCompleted(lessonId);
  }

  setLastVisitedLesson(lessonId) {
    this.state.lastLessonId = lessonId;
    this.saveState();
  }

  saveQuizScore(lessonId, score) {
    this.state.quizScores[lessonId] = score;
    this.saveState();
  }

  getTotalAvailableLessons() {
    let total = 0;
    COURSE_DATA.modules.forEach(m => {
      total += m.lessons ? m.lessons.length : 0;
    });
    return total;
  }

  getProgressPercentage() {
    const total = this.getTotalAvailableLessons();
    if (total === 0) return 0;
    const completed = this.state.completedLessons.size;
    return Math.min(100, Math.round((completed / total) * 100));
  }

  updateUI() {
    const pct = this.getProgressPercentage();
    
    // Barra superior y sidebar
    const fillEl = document.querySelector('.progress-bar-fill');
    const textEl = document.querySelector('.progress-header strong');
    if (fillEl) fillEl.style.width = `${pct}%`;
    if (textEl) textEl.textContent = `${pct}%`;

    // Actualizar badges en sidebar
    COURSE_DATA.modules.forEach(m => {
      if (m.lessons) {
        m.lessons.forEach(l => {
          const badge = document.querySelector(`[data-lesson-badge="${l.id}"]`);
          if (badge) {
            if (this.isLessonCompleted(l.id)) {
              badge.textContent = '✓ Hecho';
              badge.classList.add('completed');
            } else {
              badge.textContent = l.number;
              badge.classList.remove('completed');
            }
          }
        });
      }
    });

    // Actualizar botón de lección actual si existe
    const completeBtn = document.getElementById('btn-toggle-complete');
    if (completeBtn) {
      const currentLessonId = completeBtn.getAttribute('data-current-lesson');
      if (currentLessonId && this.isLessonCompleted(currentLessonId)) {
        completeBtn.innerHTML = `<span>✓</span> Lección Completada`;
        completeBtn.classList.add('is-completed');
      } else if (completeBtn) {
        completeBtn.innerHTML = `<span>○</span> Marcar como completada`;
        completeBtn.classList.remove('is-completed');
      }
    }
  }
}

// Instancia global
const progressTracker = new ProgressTracker();
