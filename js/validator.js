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
    const ground = document.querySelector(".ground");
    if (ground) {
      ground.classList.add("lights-on");
    }
    this.editor.applyAnimation(level.expectedCSS);
    if (this.editor.elements.submitBtn) {
      this.editor.elements.submitBtn.textContent = UI_STRINGS.SUCCESS;
    }

    this.editor.progressManager.markLevelComplete(this.editor.currentLevel);

    let delay = VALIDATOR_CONSTANTS.DELAYS.SUCCESS_MESSAGE;

    if (level.id >= 13) {
      delay = 4000;
    }

    const levels = getLevels();
    if (this.editor.currentLevel === levels.length - 1) {
      delay = 6000;
    }

    setTimeout(() => {
      this.updateSubmitButton();
      this.navigateToNextLevel();
    }, delay);
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
    } else {
      const levels = getLevels();
      const level = levels[this.editor.currentLevel];
      const staticParts = level.code
        .filter(
          (line) =>
            line.includes(":") &&
            !line.includes("{") &&
            !line.includes("}") &&
            !line.includes("_____")
        )
        .map((l) => l.trim());
      const inputParts = [];
      this.editor.inputs.forEach((input) => {
        const lineIndex = parseInt(input.dataset.line, 10);
        const line = level.code[lineIndex] || "";
        if (line.includes(":")) {
          const candidate = line.replace("_____", input.value).trim();
          if (!candidate.includes("{") && !candidate.includes("}")) {
            inputParts.push(candidate.replace(/;+\s*$/, ";"));
          }
        }
      });
      const cssRule = [...staticParts, ...inputParts].join(" ");
      if (cssRule) {
        this.editor.applyAnimation(cssRule);
      }
    }
  }
}
