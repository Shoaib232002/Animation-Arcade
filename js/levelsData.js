let levelsData = [];

export async function loadLevels() {
  try {
    const response = await fetch("../levelsdata.json");
    if (!response.ok) {
      throw new Error(`Failed to load levels: ${response.statusText}`);
    }
    const rawLevels = await response.json();
    levelsData = rawLevels.map((level) => ({
      ...level,
      hints: [{ term: "Show Solution", description: level.answer }],
      topicHints: [
        { keyword: level.keyword, description: level.topicDescription },
      ],
    }));
    return levelsData;
  } catch (error) {
    console.error("Error loading levels data:", error);
    throw error;
  }
}

export function getLevels() {
  return levelsData;
}
