import { UI_STRINGS } from "./constants.js";

let levelsData = [];

export async function loadLevels() {
  try {
    const response = await fetch("../levelsdata.json");
    if (!response.ok) {
      throw new Error(UI_STRINGS.FAILED_TO_LOAD_LEVELS);
    }
    const rawLevels = await response.json();
    levelsData = rawLevels.map((level) => ({
      ...level,
      hints: [{ term: UI_STRINGS.SHOW_SOLUTION, description: level.answer }],
      topicHints: [
        { keyword: level.keyword, description: level.topicDescription },
      ],
    }));
    return levelsData;
  } catch {
    console.log(UI_STRINGS.ERROR_LOADING_LEVELS);
  }
}

export function getLevels() {
  return levelsData;
}
