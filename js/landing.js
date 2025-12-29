const ThemeManager = {
  THEME_KEY: "animation-arcade-theme",
  DARK_THEME: "dark",
  LIGHT_THEME: "light",
  
  init() {
    this.themeIcon = document.querySelector("#themeToggle img");
    this.loadTheme();
    this.attachEventListeners();
  },
  
  loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const theme = savedTheme || this.LIGHT_THEME;
    this.applyTheme(theme);
  },
  
  applyTheme(theme) {
    if (theme === this.DARK_THEME) {
      document.body.classList.add("dark-theme");
      this.updateIcon(this.DARK_THEME);
    } else {
      document.body.classList.remove("dark-theme");
      this.updateIcon(this.LIGHT_THEME);
    }
    localStorage.setItem(this.THEME_KEY, theme);
  },
  
  toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    const newTheme = isDark ? this.LIGHT_THEME : this.DARK_THEME;
    this.applyTheme(newTheme);
  },
  
  getCurrentTheme() {
    return document.body.classList.contains("dark-theme")
      ? this.DARK_THEME
      : this.LIGHT_THEME;
  },
  
  updateIcon(theme) {
    if (!this.themeIcon) return;
    this.themeIcon.src =
      theme === this.DARK_THEME
        ? "./assets/lightmode.png"
        : "./assets/darkmode.jpeg";
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