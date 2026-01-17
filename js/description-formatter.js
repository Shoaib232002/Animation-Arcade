import { EDITOR_CONSTANTS } from "./constants.js";

export class DescriptionFormatter {
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  addQuestion(html, question) {
    if (question) {
      html += `<br/><br/><strong class="question-highlight">${question}</strong>`;
    }
    return html;
  }

  formatSpecialDescription(level) {
    if (!level.description) return this.addQuestion("", level.question);
    const firstSentenceEnd = level.description.search(/[.!?]/);
    const splitAt =
      firstSentenceEnd === -1
        ? level.description.length
        : firstSentenceEnd + EDITOR_CONSTANTS.LINE_INCREMENT;
    const firstPart = level.description
      .slice(EDITOR_CONSTANTS.LEVEL_START, splitAt)
      .trim();
    const restPart = level.description.slice(splitAt).trim();
    let result = `<span class="description-highlight">${firstPart}</span>`;
    if (restPart) result += `<br/><span>${restPart}</span>`;
    return this.addQuestion(result, level.question);
  }

  formatStandardDescription(level) {
    const html = level.description || "";
    return this.addQuestion(html, level.question);
  }

  getFormattedDescription(level) {
    return this.formatStandardDescription(level);
  }
}
