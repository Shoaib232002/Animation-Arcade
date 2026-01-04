const levelsOverlay = document.getElementById("levelsOverlay");
const levelsGrid = document.getElementById("levelsGrid");
const closeModal = document.getElementById("closeModal");
const levelTextTrigger = document.getElementById("levelTextTrigger");
const currentLevelSpan = document.getElementById("currentLevel");
const totalLevelsSpan = document.getElementById("totalLevels");

function initializeLevelsOverlay() {
  const totalLevels = parseInt(totalLevelsSpan.textContent, 10);

  for (let i = 1; i <= totalLevels; i++) {
    const levelCircle = document.createElement("div");
    levelCircle.className = "level-circle";
    levelCircle.textContent = i;
    
    if (i === parseInt(currentLevelSpan.textContent, 10)) {
      levelCircle.classList.add("current");
    }
    
    levelCircle.addEventListener("click", () => {
      navigateToLevel(i);
    });

    levelsGrid.appendChild(levelCircle);
  }
}

function openLevelsOverlay() {
  levelsOverlay.classList.add("active");
}

function closeLevelsOverlay() {
  levelsOverlay.classList.remove("active");
}

levelsOverlay.addEventListener("click", (e) => {
  if (e.target === levelsOverlay) {
    closeLevelsOverlay();
  }
});

closeModal.addEventListener("click", closeLevelsOverlay);

levelTextTrigger.addEventListener("click", openLevelsOverlay);

function navigateToLevel(levelNumber) {
  currentLevelSpan.textContent = levelNumber;

  document.querySelectorAll(".level-circle").forEach((circle, index) => {
    circle.classList.remove("current");
    if (index + 1 === levelNumber) {
      circle.classList.add("current");
    }
  });

  closeLevelsOverlay();

  window.dispatchEvent(new CustomEvent("levelChanged", { detail: { level: levelNumber } }));
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLevelsOverlay();
  }
});

document.addEventListener("DOMContentLoaded", initializeLevelsOverlay);
