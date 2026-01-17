import { getLevels } from "./levels-data.js";
import {
  UI_STRINGS,
  VALIDATOR_CONSTANTS,
  EDITOR_CSS_CLASSES,
} from "./constants.js";

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

  validateInput(input) {
    const userAnswer = this.normalizeValue(input.value);
    const correctAnswer = this.normalizeValue(input.dataset.answer);
    const isCorrect = userAnswer === correctAnswer;

    input.classList.remove(
      EDITOR_CSS_CLASSES.ERROR,
      EDITOR_CSS_CLASSES.CORRECT
    );
    if (isCorrect) {
      input.classList.add(EDITOR_CSS_CLASSES.CORRECT);
    } else {
      input.classList.add(EDITOR_CSS_CLASSES.ERROR);
    }

    return isCorrect;
  }

  handleSuccess(level) {
    this.editor.applyAnimation(level.expectedCSS);
    if (this.editor.elements.submitBtn) {
      this.editor.elements.submitBtn.textContent = UI_STRINGS.SUCCESS;
    }

    this.editor.progressManager.markLevelComplete(this.editor.currentLevel);

    setTimeout(() => {
      this.updateSubmitButton();
      this.navigateToNextLevel();
    }, VALIDATOR_CONSTANTS.DELAYS.SUCCESS_MESSAGE);
  }

  updateSubmitButton() {
    if (this.editor.elements.submitBtn) {
      this.editor.elements.submitBtn.textContent = UI_STRINGS.NEXT;
    }
  }

  navigateToNextLevel() {
    const levels = getLevels();
    const nextLevelIndex =
      this.editor.currentLevel + VALIDATOR_CONSTANTS.NAVIGATION.NEXT_LEVEL;

    if (nextLevelIndex < levels.length) {
      this.editor.loadLevel(nextLevelIndex);
    } else {
      this.editor.showCompletionMessage();
    }
  }

  checkAnswer() {
    const allCorrect = this.editor.inputs.every((input) =>
      this.validateInput(input)
    );

    if (allCorrect) {
      const levels = getLevels();
      const level = levels[this.editor.currentLevel];
      this.handleSuccess(level);
    }
  }
}
