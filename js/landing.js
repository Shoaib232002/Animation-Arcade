import { THEME_KEY, DARK_THEME, LIGHT_THEME, THEME_ICONS } from "./constants.js";

const ThemeManager = {
  init() {
    this.themeIcon = document.querySelector("#themeToggle img");
    this.loadTheme();
    this.attachEventListeners();
  },

  loadTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const theme = savedTheme || LIGHT_THEME;
    this.applyTheme(theme);
  },

  applyTheme(theme) {
    if (theme === DARK_THEME) {
      document.body.classList.add("dark-theme");
      this.updateIcon(DARK_THEME);
    } else {
      document.body.classList.remove("dark-theme");
      this.updateIcon(LIGHT_THEME);
    }
    localStorage.setItem(THEME_KEY, theme);
  },

  toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? LIGHT_THEME : DARK_THEME;
    this.applyTheme(newTheme);
  },

  getCurrentTheme() {
    return document.body.classList.contains("dark-theme")
      ? DARK_THEME
      : LIGHT_THEME;
  },

  updateIcon(theme) {
    if (!this.themeIcon) return;
    this.themeIcon.src = THEME_ICONS[theme];
  },

  attachEventListeners() {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme());
    }
  }
};

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    ThemeManager.init();
  });
}

export { ThemeManager };