import { HINT_CONSTANTS, UI_STRINGS } from "./constants.js";

function ensureOverlay(editor) {
  const container = editor.elements.hintsList?.parentElement;
  if (!container) return null;
  let overlay = container.querySelector(".hint-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "hint-overlay";
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "close-btn";
    closeBtn.setAttribute("aria-label", "Close hints");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", () => {
      overlay.classList.remove("open");
    });
    const content = document.createElement("div");
    content.className = "hint-overlay-content";
    overlay.appendChild(closeBtn);
    overlay.appendChild(content);
    container.appendChild(overlay);
  }
  return overlay;
}

function createShowResultsButton(editor, level) {
  const buttonItem = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.className = HINT_CONSTANTS.CLASSES.SOLUTION_BTN;
  button.textContent = UI_STRINGS.SHOW_SOLUTION;
  buttonItem.appendChild(button);

  let state = 0;
  button.addEventListener("click", () => {
    const contentEl = ensureOverlay(editor);
    if (!contentEl) return;

    contentEl.classList.add("open");
    const contentArea = contentEl.querySelector(".hint-overlay-content");

    if (state === 0) {
      const title = document.createElement("div");
      title.className = "hint-title";
      title.textContent = "Hint 1: Understanding the Concept";

      const body = document.createElement("div");
      body.className = "hint-body";
      body.textContent =
        level.topicDescription ||
        "Start with the basic property and its typical value pattern.";

      const link = document.createElement("a");
      link.href = "#";
      link.className = "hint-link";
      link.textContent = "Go to Hint 2 →";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        button.click();
      });

      contentArea.innerHTML = "";
      contentArea.appendChild(title);
      contentArea.appendChild(body);
      contentArea.appendChild(link);
      state = 1;
    } else if (state === 1) {
      const title = document.createElement("div");
      title.className = "hint-title";
      title.textContent = "Hint 2: CSS Pattern";

      const body = document.createElement("div");
      body.className = "hint-body";
      const expectedCSS =
        level.expectedCSS ||
        level.answer ||
        "Try using the property with appropriate values.";
      body.innerHTML = `<strong>Expected format:</strong><br><code>${expectedCSS}</code>`;

      const link = document.createElement("a");
      link.href = "#";
      link.className = "hint-link";
      link.textContent = "Show Solution →";
      link.addEventListener("click", (e) => {
        e.preventDefault();
        button.click();
      });

      contentArea.innerHTML = "";
      contentArea.appendChild(title);
      contentArea.appendChild(body);
      contentArea.appendChild(link);
      state = 2;
    } else {
      const title = document.createElement("div");
      title.className = "hint-title";
      title.textContent = "✓ Solution";

      const body = document.createElement("div");
      body.className = "hint-body solution";
      const solution =
        level.answer || level.expectedCSS || "Solution not available";
      body.innerHTML = `<strong>Complete Answer:</strong><br><code>${solution}</code>`;



      contentArea.innerHTML = "";
      contentArea.appendChild(title);
      contentArea.appendChild(body);

      button.disabled = true;
      button.classList.add(HINT_CONSTANTS.CLASSES.REVEALED);
      button.textContent = "Solution Revealed";
    }
  });

  return buttonItem;
}

function renderSingleHintFlow(editor, level) {
  const buttonItem = createShowResultsButton(editor, level);
  editor.elements.hintsList.appendChild(buttonItem);
}

export function renderHints(editor, level) {
  if (!editor.elements.hintsList) return;

  const container = editor.elements.hintsList.parentElement;
  if (container) {
    const overlay = container.querySelector(".hint-overlay");
    if (overlay) {
      overlay.classList.remove("open");
    }
  }

  editor.elements.hintsList.innerHTML = "";

  renderSingleHintFlow(editor, level);
}
