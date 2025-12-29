/**
 * @jest-environment jsdom
 */

import { ThemeManager } from "../js/landing.js";

describe("ThemeManager", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="themeToggle">
        <img src="./assets/lightmode.png" />
      </button>
    `;

    localStorage.clear();
    document.body.classList.remove("dark-theme");
  });

  test("initializes with light theme by default", () => {
    ThemeManager.init();

    expect(document.body.classList.contains("dark-theme")).toBe(false);

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("lightmode.png");
  });

  test("loads dark theme from localStorage on init", () => {
    localStorage.setItem("animation-arcade-theme", "dark");

    ThemeManager.init();

    expect(document.body.classList.contains("dark-theme")).toBe(true);

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("darkmode.jpeg");
  });

  test("applyTheme('dark') enables dark theme and updates icon", () => {
    ThemeManager.init();
    ThemeManager.applyTheme("dark");

    expect(document.body.classList.contains("dark-theme")).toBe(true);
    expect(localStorage.getItem("animation-arcade-theme")).toBe("dark");

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("darkmode.jpeg");
  });

  test("applyTheme('light') disables dark theme and updates icon", () => {
    ThemeManager.init();
    ThemeManager.applyTheme("light");

    expect(document.body.classList.contains("dark-theme")).toBe(false);
    expect(localStorage.getItem("animation-arcade-theme")).toBe("light");

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("lightmode.png");
  });

  test("toggleTheme switches from light to dark", () => {
    ThemeManager.init();
    ThemeManager.toggleTheme();

    expect(document.body.classList.contains("dark-theme")).toBe(true);

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("darkmode.jpeg");
  });

  test("toggleTheme switches from dark to light", () => {
    localStorage.setItem("animation-arcade-theme", "dark");

    ThemeManager.init();
    ThemeManager.toggleTheme();

    expect(document.body.classList.contains("dark-theme")).toBe(false);

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("lightmode.png");
  });

  test("getCurrentTheme returns correct value", () => {
    ThemeManager.init();
    expect(ThemeManager.getCurrentTheme()).toBe("light");

    ThemeManager.applyTheme("dark");
    expect(ThemeManager.getCurrentTheme()).toBe("dark");
  });

  test("clicking theme toggle button toggles theme", () => {
    ThemeManager.init();

    const button = document.getElementById("themeToggle");
    button.click();

    expect(document.body.classList.contains("dark-theme")).toBe(true);

    const icon = document.querySelector("#themeToggle img");
    expect(icon.src).toContain("darkmode.jpeg");
  });

  test("updateIcon does nothing if icon is missing", () => {
    document.body.innerHTML = "<button id=\"themeToggle\"></button>";
    ThemeManager.init();

    expect(() => ThemeManager.updateIcon("dark")).not.toThrow();
  });
});
