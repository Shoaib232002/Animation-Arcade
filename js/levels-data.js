import { UI_STRINGS } from "./constants.js";

let levelsData = [];

export async function loadLevels() {
  try {
    const response = await fetch("./levelsdata.json");

    if (!response.ok) {
      const response2 = await fetch("levelsdata.json");
      if (!response2.ok) throw new Error(UI_STRINGS.FAILED_TO_LOAD_LEVELS);
      return processLevels(await response2.json());
    }

    const rawLevels = await response.json();
    return processLevels(rawLevels);
  } catch {
    throw new Error(UI_STRINGS.ERROR_LOADING_LEVELS);
  }
}

function processLevels(rawLevels) {
  levelsData = rawLevels.map((level) => {
    const conceptHint = level.hints
      ? level.hints.concept
      : level.topicDescription;
    const cssHint = level.hints ? level.hints.css : level.expectedCSS;

    return {
      ...level,
      topicDescription: conceptHint,
      expectedCSS: cssHint,
      topicHints: [{ keyword: level.keyword, description: conceptHint }],
    };
  });
  return levelsData;
}

export function getLevels() {
  return levelsData;
}
