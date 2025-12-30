/**
 * @jest-environment jsdom
 */
import { ThemeManager } from "../js/landing.js";
import { THEME_KEY, DARK_THEME, LIGHT_THEME } from "../js/constants.js";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

describe("ThemeManager", () => {
  let htmlContent;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const getThemeIcon = () => document.querySelector("#themeToggle img");
  
  const expectThemeState = (theme) => {
    const isDark = theme === DARK_THEME;
    expect(document.body.classList.contains("dark-theme")).toBe(isDark);
    expect(localStorage.getItem(THEME_KEY)).toBe(theme);
    
    const icon = getThemeIcon();
    if (icon) {
      const expectedIcon = isDark ? "lightmode.png" : "darkmode.jpeg";
      expect(icon.src).toContain(expectedIcon);
    }
  };

  const getElement = (id) => document.getElementById(id);

  beforeAll(() => {
    const htmlPath = path.join(__dirname, "..", "index.html");
    htmlContent = fs.readFileSync(htmlPath, "utf-8");
  });

  beforeEach(() => {
    document.documentElement.innerHTML = htmlContent;
    localStorage.clear();
    document.body.classList.remove("dark-theme");
  });

  describe("ThemeManager Functionality", () => {
    test("initializes with light theme by default", () => {
      ThemeManager.init();
      expect(document.body).not.toHaveClass("dark-theme");
      expect(getThemeIcon()).toHaveAttribute("src", expect.stringContaining("darkmode.jpeg"));
    });

    test("loads dark theme from localStorage on init", () => {
      localStorage.setItem(THEME_KEY, DARK_THEME);
      ThemeManager.init();
      expectThemeState(DARK_THEME);
    });

    test("applyTheme('dark') enables dark theme and updates icon", () => {
      ThemeManager.init();
      ThemeManager.applyTheme(DARK_THEME);
      expect(document.body).toHaveClass("dark-theme");
      expectThemeState(DARK_THEME);
    });

    test("applyTheme('light') disables dark theme and updates icon", () => {
      ThemeManager.init();
      ThemeManager.applyTheme(LIGHT_THEME);
      expect(document.body).not.toHaveClass("dark-theme");
      expectThemeState(LIGHT_THEME);
    });

    test("toggleTheme switches from light to dark", () => {
      ThemeManager.init();
      ThemeManager.toggleTheme();
      expect(document.body).toHaveClass("dark-theme");
      expectThemeState(DARK_THEME);
    });

    test("toggleTheme switches from dark to light", () => {
      localStorage.setItem(THEME_KEY, DARK_THEME);
      ThemeManager.init();
      ThemeManager.toggleTheme();
      expect(document.body).not.toHaveClass("dark-theme");
      expectThemeState(LIGHT_THEME);
    });

    test("getCurrentTheme returns correct value", () => {
      ThemeManager.init();
      expect(ThemeManager.getCurrentTheme()).toBe(LIGHT_THEME);
      
      ThemeManager.applyTheme(DARK_THEME);
      expect(ThemeManager.getCurrentTheme()).toBe(DARK_THEME);
    });

    test("clicking theme toggle button toggles theme", async () => {
      ThemeManager.init();
      const user = userEvent.setup();
      const button = getElement("themeToggle");
      
      await user.click(button);
      
      expect(document.body).toHaveClass("dark-theme");
      expectThemeState(DARK_THEME);
    });

    test("updateIcon does nothing if icon is missing", () => {
      getElement("themeToggle").innerHTML = "";
      ThemeManager.init();
      expect(() => ThemeManager.updateIcon(DARK_THEME)).not.toThrow();
    });
  });
});