export function renderHints(editor, level) {
  if (!editor.elements.hintsList) return;

  editor.elements.hintsList.innerHTML = "";

  if (level.keyword) {
    const keywordLi = document.createElement("li");
    keywordLi.className = "hint-keyword";
    keywordLi.textContent = level.keyword;

    if (Array.isArray(level.topicHints) && level.topicHints.length > 0) {
      const topic =
        level.topicHints.find((t) => t.keyword === level.keyword) ||
        level.topicHints[0];

      if (topic && topic.description) {
        keywordLi.setAttribute("data-values", topic.description);
        keywordLi.title = topic.description;
      }
    }

    editor.elements.hintsList.appendChild(keywordLi);
  }

  level.hints.forEach((hint) => {
    const li = document.createElement("li");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "show-solution-btn";
    btn.textContent = hint.term;
    btn.dataset.hint = hint.description;

    btn.addEventListener("click", () => {
      const confirmed = window.confirm(
        "Do you really want to check the solution?"
      );
      if (!confirmed) return;

      btn.disabled = true;
      btn.classList.add("revealed");
      btn.textContent = hint.description;
    });

    li.appendChild(btn);
    editor.elements.hintsList.appendChild(li);
  });
}
