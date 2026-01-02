import { THEME_KEY, DARK_THEME, LIGHT_THEME } from "./constants.js";
import "./auth.js";

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

      const storedTheme = localStorage.getItem(THEME_KEY);

      if (storedTheme === DARK_THEME || storedTheme === LIGHT_THEME) {
        this.applyTheme(storedTheme);
      } else {
        this.applyTheme(LIGHT_THEME);
      }
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

  applyTheme(theme) {
    this.currentTheme = theme;

    document.body.classList.toggle("dark-theme", theme === DARK_THEME);

    localStorage.setItem(THEME_KEY, theme);
    this.updateIcon(theme);
  }

  toggleTheme() {
    const nextTheme =
      this.currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    this.applyTheme(nextTheme);
  }

  updateIcon(theme) {
    if (!this.icon) return;

    this.icon.src =
      theme === DARK_THEME ? "assets/lightmode.png" : "assets/darkmode.jpeg";
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
