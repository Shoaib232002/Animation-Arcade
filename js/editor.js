import { levels } from "./levels.js";
import "./animation.js";
import { GameValidator } from "./validator.js";
import { renderHints } from "./hints.js";

class GameEditor {
  constructor() {
    this.currentLevel = 0;
    this.inputs = [];
    this.initializeElements();
    this.validator = new GameValidator(this);
    this.setupEventListeners();
    this.loadLevel(this.currentLevel);
  }

  initializeElements() {
    this.elements = {
      levelTitle: document.querySelector(".level-title"),
      description: document.querySelector(".game-description"),
      codeContent: document.querySelector("#codeContent"),
      lineNumbers: document.querySelector("#lineNumbers"),
      hintsList: document.querySelector("#hintsList"),
      currentLevel: document.querySelector("#currentLevel"),
      totalLevels: document.querySelector("#totalLevels"),
      submitBtn: document.querySelector(".submit-btn"),
      outputBox: document.querySelector(".output-box"),
      prevArrow: document.querySelector("#prevArrow"),
      nextArrow: document.querySelector("#nextArrow"),
    };
  }

  setupEventListeners() {
    this.elements.submitBtn?.addEventListener("click", () =>
      this.validator.checkAnswer()
    );
    this.elements.prevArrow?.addEventListener("click", () =>
      this.navigateLevel(-1)
    );
    this.elements.nextArrow?.addEventListener("click", () =>
      this.navigateLevel(1)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        this.validator.checkAnswer();
      }
    });
  }

  loadLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= levels.length) return;

    this.currentLevel = levelIndex;
    const level = levels[levelIndex];

    this.updateLevelInfo(level);
    this.renderCode(level);
    renderHints(this, level);
    this.renderOutput();
    this.clearInputStates();
  }

  updateLevelInfo(level) {
    this.setLevelTitle(level.title);
    this.setDescription(level);
    this.setLevelCount(level.id, levels.length);
  }

  setLevelTitle(title) {
    if (this.elements.levelTitle) {
      this.elements.levelTitle.textContent = title;
    }
  }

  setDescription(level) {
    if (!this.elements.description) return;
    const descHTML =
      level?.id === 1
        ? this.formatSpecialDescription(level)
        : this.formatStandardDescription(level);
    this.elements.description.innerHTML = descHTML;
  }
  formatSpecialDescription(level) {
    if (!level.description) return this.addQuestion("", level.question);
    const firstSentenceEnd = level.description.search(/[.!?]/);
    const splitAt =
      firstSentenceEnd === -1 ? level.description.length : firstSentenceEnd + 1;
    const firstPart = level.description.slice(0, splitAt).trim();
    const restPart = level.description.slice(splitAt).trim();
    let result = `<span style="color: var(--accent-primary); font-weight:700;">${firstPart}</span>`;
    if (restPart) result += `<br/><span>${restPart}</span>`;
    return this.addQuestion(result, level.question);
  }

  formatStandardDescription(level) {
    const base = level.description || "";
    return this.addQuestion(base, level.question);
  }

  addQuestion(html, question) {
    if (question) {
      html += `<br/><br/><strong style="color: var(--accent-primary);">${question}</strong>`;
    }
    return html;
  }

  setLevelCount(current, total) {
    if (this.elements.currentLevel) {
      this.elements.currentLevel.textContent = current;
    }
    if (this.elements.totalLevels) {
      this.elements.totalLevels.textContent = total;
    }
  }

  renderCode(level) {
    if (!this.elements.codeContent || !this.elements.lineNumbers) return;

    this.elements.codeContent.innerHTML = "";
    this.elements.lineNumbers.innerHTML = "";
    this.inputs = [];

    level.code.forEach((line, index) => {
      const lineNumber = document.createElement("span");
      lineNumber.textContent = index + 1;
      this.elements.lineNumbers.appendChild(lineNumber);

      const codeLine = document.createElement("div");
      codeLine.className = "code-line";

      const blank = level.blanks.find((b) => b.line === index);

      if (blank) {
        const parts = line.split("_____");

        if (parts[0]) {
          const textBefore = document.createElement("span");
          textBefore.className = "code-line-text";
          textBefore.textContent = parts[0];
          codeLine.appendChild(textBefore);
        }

        const input = document.createElement("input");
        input.type = "text";
        input.className = "blank-input";
        input.dataset.answer = blank.answer;
        input.dataset.line = index;
        input.placeholder = "";
        this.inputs.push(input);

        const blankContainer = document.createElement("span");
        blankContainer.className = "code-line-blank";
        blankContainer.appendChild(input);
        codeLine.appendChild(blankContainer);

        if (parts[1]) {
          const textAfter = document.createElement("span");
          textAfter.className = "code-line-text";
          textAfter.textContent = parts[1];
          codeLine.appendChild(textAfter);
        }
      } else {
        const text = document.createElement("span");
        text.className = "code-line-text";
        text.textContent = line;
        codeLine.appendChild(text);
      }

      this.elements.codeContent.appendChild(codeLine);
    });

    if (this.inputs.length > 0) {
      setTimeout(() => {
        this.inputs[0]?.focus();
      }, 100);
    }
  }

  renderOutput() {
    if (!this.elements.outputBox) return;

    this.elements.outputBox.innerHTML = `
      <div class="ground">
        <div class="ball"></div>
      </div>
    `;
  }

  applyAnimation(cssRule) {
    const ball = document.querySelector(".ball");
    if (!ball) return;

    ball.removeAttribute("style");

    const rules = cssRule.split(";").filter((r) => r.trim());
    rules.forEach((rule) => {
      const [property, value] = rule.split(":").map((s) => s.trim());
      if (property && value) {
        const camelCase = property.replace(/-([a-z])/g, (g) =>
          g[1].toUpperCase()
        );
        ball.style[camelCase] = value;
      }
    });
  }

  clearInputStates() {
    this.inputs.forEach((input) => {
      input.classList.remove("correct", "error");
      input.value = "";
    });
  }

  navigateLevel(direction) {
    const newLevel = this.currentLevel + direction;
    if (newLevel >= 0 && newLevel < levels.length) {
      this.loadLevel(newLevel);
    }
  }

  showCompletionMessage() {
    if (this.elements.outputBox) {
      this.elements.outputBox.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h2 style="color: var(--bg-body); margin-bottom: 1rem;">
            You've completed all levels!
          </h2>
        </div>
      `;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    new GameEditor();
  } catch {
    const outputBox = document.querySelector(".output-box");
    if (outputBox) {
      outputBox.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #d32f2f;">
          <h3>Error Loading Game</h3>
          <p>Please check that all files are loaded correctly.</p>
          <p style="font-size: 0.85rem; margin-top: 1rem;">
            Check browser console for details.
          </p>
        </div>
      `;
    }
  }
});
