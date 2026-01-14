const createLevel = (levelData = {}) => ({
  ...levelData,
  hints: [{ term: "Show Solution", description: levelData.answer }],
  topicHints: [
    { keyword: levelData.keyword, description: levelData.topicDescription },
  ],
});

export { createLevel };
