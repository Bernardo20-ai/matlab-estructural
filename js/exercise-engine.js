/**
 * Aprendiendo MATLAB para análisis estructural
 * Motor de Ejercicios Interactivos y Evaluación
 */

class ExerciseEngine {
  constructor() {
    this.activeHints = {};
  }

  // Normalizar strings para comparaciones tolerantes a espacios
  normalizeString(str) {
    if (!str) return '';
    return str
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/;\s*$/, ';')
      .toLowerCase();
  }

  // Comprobar ejercicio de código
  checkCodeFill(exerciseId, expectedAnswer) {
    const inputEl = document.getElementById(`input-${exerciseId}`);
    const feedbackEl = document.getElementById(`feedback-${exerciseId}`);
    if (!inputEl || !feedbackEl) return;

    const userInput = inputEl.value.trim();
    if (!userInput) {
      this.showFeedback(feedbackEl, 'warning', '⚠️ Por favor escribe una respuesta antes de comprobar.');
      return;
    }

    const normUser = this.normalizeString(userInput);
    const normExpected = this.normalizeString(expectedAnswer);

    // Comparar versión normalizada
    if (normUser === normExpected || normUser.replace(/;/g, '') === normExpected.replace(/;/g, '')) {
      this.showFeedback(feedbackEl, 'success', `🎉 <strong>¡Correcto!</strong> La sintaxis es exacta y cumple la regla de operación matricial en MATLAB.`);
    } else {
      this.showFeedback(feedbackEl, 'error', `❌ <strong>Respuesta incorrecta o con error de sintaxis.</strong> Revisa el nombre de las variables, el uso de corchetes <code>[]</code> y el punto y coma <code>;</code>.`);
    }
  }

  // Comprobar ejercicio de predicción / opciones
  checkPrediction(exerciseId, correctIndex, explanation) {
    const feedbackEl = document.getElementById(`feedback-${exerciseId}`);
    const selectedOption = document.querySelector(`input[name="opt-${exerciseId}"]:checked`);
    
    if (!selectedOption) {
      this.showFeedback(feedbackEl, 'warning', '⚠️ Por favor selecciona una de las opciones antes de comprobar.');
      return;
    }

    const userVal = parseInt(selectedOption.value, 10);
    if (userVal === correctIndex) {
      this.showFeedback(feedbackEl, 'success', `🎉 <strong>¡Excelente predicción!</strong> ${explanation || ''}`);
    } else {
      this.showFeedback(feedbackEl, 'error', `❌ <strong>Predicción incorrecta.</strong> Reflexiona sobre cómo maneja MATLAB la memoria o las dimensiones.`);
    }
  }

  // Comprobar cuestionario corto / autoevaluación
  checkQuiz(lessonId, correctIndex, explanation) {
    const feedbackEl = document.getElementById(`quiz-feedback-${lessonId}`);
    const selectedOption = document.querySelector(`input[name="quiz-opt-${lessonId}"]:checked`);
    
    if (!selectedOption) {
      this.showFeedback(feedbackEl, 'warning', '⚠️ Selecciona una opción para autoevaluarte.');
      return;
    }

    const userVal = parseInt(selectedOption.value, 10);
    if (userVal === correctIndex) {
      this.showFeedback(feedbackEl, 'success', `🎉 <strong>¡Respuesta Correcta!</strong> ${explanation}`);
      progressTracker.saveQuizScore(lessonId, 100);
    } else {
      this.showFeedback(feedbackEl, 'error', `❌ <strong>No es correcto.</strong> Revisa los conceptos teóricos de la lección e inténtalo de nuevo.`);
    }
  }

  // Mostrar Pista
  showHint(exerciseId, hintText) {
    const feedbackEl = document.getElementById(`feedback-${exerciseId}`);
    if (!feedbackEl) return;
    this.showFeedback(feedbackEl, 'hint', `💡 <strong>Pista didáctica:</strong> ${hintText}`);
  }

  // Revelar Solución
  showSolution(exerciseId, solutionText) {
    const feedbackEl = document.getElementById(`feedback-${exerciseId}`);
    if (!feedbackEl) return;
    this.showFeedback(feedbackEl, 'solution', `👁️ <strong>Solución explicada:</strong><br><code>${solutionText}</code>`);
  }

  // Reiniciar Ejercicio
  resetExercise(exerciseId) {
    const inputEl = document.getElementById(`input-${exerciseId}`);
    if (inputEl) inputEl.value = '';

    const radios = document.querySelectorAll(`input[name="opt-${exerciseId}"]`);
    radios.forEach(r => r.checked = false);

    const feedbackEl = document.getElementById(`feedback-${exerciseId}`);
    if (feedbackEl) {
      feedbackEl.className = 'exercise-feedback';
      feedbackEl.innerHTML = '';
    }
  }

  // Helper visual para retroalimentación
  showFeedback(el, type, htmlContent) {
    el.className = 'exercise-feedback active';
    if (type === 'success') el.classList.add('feedback-success');
    else if (type === 'error') el.classList.add('feedback-error');
    else if (type === 'hint') el.classList.add('feedback-hint');
    else if (type === 'solution') el.classList.add('feedback-solution');
    else if (type === 'warning') el.classList.add('feedback-hint');
    
    el.innerHTML = htmlContent;
  }
}

const exerciseEngine = new ExerciseEngine();
