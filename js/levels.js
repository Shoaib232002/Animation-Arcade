import { UI_STRINGS } from "./constants.js";

const createLevel = (levelData = {}) => ({
  ...levelData,
  hints: [{ term: UI_STRINGS.SHOW_SOLUTION, description: levelData.answer }],
  topicHints: [
    { keyword: levelData.keyword, description: levelData.topicDescription },
  ],
});

export { createLevel };
