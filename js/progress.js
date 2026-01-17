const PROGRESS_KEY = "animationArcadeProgress";

export class ProgressManager {
  constructor() {
    this.loadProgress();
  }

  loadProgress() {
    const stored = localStorage.getItem(PROGRESS_KEY);
    this.completedLevels = stored ? JSON.parse(stored) : [0]; // Level 0 (first level) is always available
  }

  saveProgress() {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.completedLevels));
  }

  markLevelComplete(levelIndex) {
    if (!this.completedLevels.includes(levelIndex)) {
      this.completedLevels.push(levelIndex);
      this.saveProgress();
    }
  }

  isLevelCompleted(levelIndex) {
    return this.completedLevels.includes(levelIndex);
  }

  isLevelAccessible(levelIndex) {
    if (levelIndex === 0) return true;
    return (
      this.isLevelCompleted(levelIndex - 1) || this.isLevelCompleted(levelIndex)
    );
  }

  getCompletedLevels() {
    return [...this.completedLevels];
  }

  reset() {
    this.completedLevels = [0];
    this.saveProgress();
  }
}
