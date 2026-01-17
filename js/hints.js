import { HINT_CONSTANTS } from "./constants.js";

function findTopicByKeyword(topicHints, keyword) {
  return (
    topicHints.find((topic) => topic.keyword === keyword) ||
    topicHints[HINT_CONSTANTS.FIRST_TOPIC_INDEX]
  );
}

function createKeywordElement(keyword, topicHints) {
  const keywordElement = document.createElement("li");
  keywordElement.className = HINT_CONSTANTS.CLASSES.KEYWORD;
  keywordElement.textContent = keyword;

  if (
    Array.isArray(topicHints) &&
    topicHints.length > HINT_CONSTANTS.FIRST_TOPIC_INDEX
  ) {
    const topic = findTopicByKeyword(topicHints, keyword);

    if (topic && topic.description) {
      keywordElement.setAttribute(
        HINT_CONSTANTS.ATTRIBUTES.VALUES,
        topic.description
      );
      keywordElement.title = topic.description;
    }
  }

  return keywordElement;
}

function handleSolutionReveal(button, description) {
  const userConfirmed = window.confirm(
    HINT_CONSTANTS.MESSAGES.CONFIRM_SOLUTION
  );

  if (!userConfirmed) return;

  button.disabled = true;
  button.classList.add(HINT_CONSTANTS.CLASSES.REVEALED);
  button.textContent = description;
}

function createHintButton(hint) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = HINT_CONSTANTS.CLASSES.SOLUTION_BTN;
  button.textContent = hint.term;
  button.dataset.hint = hint.description;

  button.addEventListener("click", () => {
    handleSolutionReveal(button, hint.description);
  });

  return button;
}

function createHintListItem(hint) {
  const listItem = document.createElement("li");
  const hintButton = createHintButton(hint);
  listItem.appendChild(hintButton);
  return listItem;
}

function renderKeywordHint(editor, level) {
  if (!level.keyword) return;

  const keywordElement = createKeywordElement(level.keyword, level.topicHints);
  editor.elements.hintsList.appendChild(keywordElement);
}

function renderHintsList(editor, hints) {
  hints.forEach((hint) => {
    const hintListItem = createHintListItem(hint);
    editor.elements.hintsList.appendChild(hintListItem);
  });
}

export function renderHints(editor, level) {
  if (!editor.elements.hintsList) return;

  editor.elements.hintsList.innerHTML = "";

  renderKeywordHint(editor, level);
  renderHintsList(editor, level.hints);
}
