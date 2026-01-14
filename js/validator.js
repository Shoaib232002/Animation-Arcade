import { getLevels } from "./levelsData.js";

const VALIDATOR_CONSTANTS = {
  DELAYS: {
    SUCCESS_MESSAGE: 2000,
  },
  NAVIGATION: {
    NEXT_LEVEL: 1,
  },
  NORMALIZATION: {
    SPACE_PATTERN: /\s+/g,
    OPENING_PAREN_PATTERN: /\s*\(\s*/g,
    CLOSING_PAREN_PATTERN: /\s*\)\s*/g,
    COMMA_PATTERN: /\s*,\s*/g,
    SEMICOLON_PATTERN: /;+$/g,
    SINGLE_SPACE: " ",
    OPENING_PAREN: "(",
    CLOSING_PAREN: ")",
    COMMA: ",",
    EMPTY_STRING: "",
  },
  MESSAGES: {
    SUCCESS: "Success!",
    NEXT: "Next",
  },
  CSS_CLASSES: {
    ERROR: "error",
    CORRECT: "correct",
  },
};

export class GameValidator {
  constructor(editor) {
    this.editor = editor;
  }

  normalizeValue(value) {
    return value
      .toLowerCase()
      .replace(
        VALIDATOR_CONSTANTS.NORMALIZATION.SPACE_PATTERN,
        VALIDATOR_CONSTANTS.NORMALIZATION.SINGLE_SPACE
      )
      .replace(
        VALIDATOR_CONSTANTS.NORMALIZATION.OPENING_PAREN_PATTERN,
        VALIDATOR_CONSTANTS.NORMALIZATION.OPENING_PAREN
      )
      .replace(
        VALIDATOR_CONSTANTS.NORMALIZATION.CLOSING_PAREN_PATTERN,
        VALIDATOR_CONSTANTS.NORMALIZATION.CLOSING_PAREN
      )
      .replace(
        VALIDATOR_CONSTANTS.NORMALIZATION.COMMA_PATTERN,
        VALIDATOR_CONSTANTS.NORMALIZATION.COMMA
      )
      .replace(
        VALIDATOR_CONSTANTS.NORMALIZATION.SEMICOLON_PATTERN,
        VALIDATOR_CONSTANTS.NORMALIZATION.EMPTY_STRING
      )
      .trim();
  }

  validateInput(input) {
    const userAnswer = this.normalizeValue(input.value);
    const correctAnswer = this.normalizeValue(input.dataset.answer);
    const isCorrect = userAnswer === correctAnswer;

    input.classList.remove(
      VALIDATOR_CONSTANTS.CSS_CLASSES.ERROR,
      VALIDATOR_CONSTANTS.CSS_CLASSES.CORRECT
    );
    if (isCorrect) {
      input.classList.add(VALIDATOR_CONSTANTS.CSS_CLASSES.CORRECT);
    } else {
      input.classList.add(VALIDATOR_CONSTANTS.CSS_CLASSES.ERROR);
    }

    return isCorrect;
  }

  handleSuccess(level) {
    this.editor.applyAnimation(level.expectedCSS);
    if (this.editor.elements.submitBtn) {
      this.editor.elements.submitBtn.textContent =
        VALIDATOR_CONSTANTS.MESSAGES.SUCCESS;
    }

    setTimeout(() => {
      this.updateSubmitButton();
      this.navigateToNextLevel();
    }, VALIDATOR_CONSTANTS.DELAYS.SUCCESS_MESSAGE);
  }

  updateSubmitButton() {
    if (this.editor.elements.submitBtn) {
      this.editor.elements.submitBtn.textContent =
        VALIDATOR_CONSTANTS.MESSAGES.NEXT;
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
