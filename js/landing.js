import { STORAGE_KEYS, DARK_THEME, LIGHT_THEME } from "./constants.js";
import "./auth.js";

const THEME_ICONS = {
  [DARK_THEME]: "assets/lightmode.png",
  [LIGHT_THEME]: "assets/darkmode.jpeg",
};

const THEME_CLASS = "dark-theme";

class ThemeManagerClass {
  constructor() {
    this.toggleButton = null;
    this.icon = null;
    this.currentTheme = LIGHT_THEME;
  }

  bootstrap() {
    const apply = () => {
      if (!document.body) {
        requestAnimationFrame(apply);
        return;
      }

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      const theme = this.isValidTheme(storedTheme) ? storedTheme : LIGHT_THEME;
      this.applyTheme(theme);
    };

    apply();
  }

  init() {
    this.toggleButton = document.getElementById("themeToggle");
    this.icon = this.toggleButton?.querySelector("img");

    this.toggleButton?.addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  isValidTheme(theme) {
    return theme === DARK_THEME || theme === LIGHT_THEME;
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.body.classList.toggle(THEME_CLASS, theme === DARK_THEME);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    this.updateIcon(theme);
  }

  toggleTheme() {
    const nextTheme =
      this.currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    this.applyTheme(nextTheme);
  }

  updateIcon(theme) {
    if (!this.icon) return;
    this.icon.src = THEME_ICONS[theme];
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}

export const ThemeManager = new ThemeManagerClass();
window.ThemeManager = ThemeManager;

ThemeManager.bootstrap();

document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
});
