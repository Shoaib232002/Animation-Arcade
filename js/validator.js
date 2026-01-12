import { levels } from "./levels.js";

export class GameValidator {
  constructor(editor) {
    this.editor = editor;
  }

  normalizeValue(value) {
    return value
      .toLowerCase()
      .replace(/\s+/g, " ")
      .replace(/\s*\(\s*/g, "(")
      .replace(/\s*\)\s*/g, ")")
      .replace(/\s*,\s*/g, ",")
      .replace(/;+$/g, "")
      .trim();
  }

  checkAnswer() {
    let allCorrect = true;
    const level = levels[this.editor.currentLevel];

    this.editor.inputs.forEach((input) => {
      const userAnswer = this.normalizeValue(input.value);
      const correctAnswer = this.normalizeValue(input.dataset.answer);

      if (userAnswer === correctAnswer) {
        input.classList.remove("error");
        input.classList.add("correct");
      } else {
        input.classList.remove("correct");
        input.classList.add("error");
        allCorrect = false;
      }
    });

    if (allCorrect) {
      this.editor.applyAnimation(level.expectedCSS);

      if (this.editor.elements.submitBtn) {
        this.editor.elements.submitBtn.textContent = "Success!";
      }

      setTimeout(() => {
        if (this.editor.elements.submitBtn) {
          this.editor.elements.submitBtn.textContent = "Next";
        }

        if (this.editor.currentLevel < levels.length - 1) {
          this.editor.loadLevel(this.editor.currentLevel + 1);
        } else {
          this.editor.showCompletionMessage();
        }
      }, 2000);
    }
  }
}
