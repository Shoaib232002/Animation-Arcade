import { spawn } from "child_process";
import chokidar from "chokidar";

console.log("Watching for file changes...\n");

const jsWatcher = chokidar.watch(["js/**/*.js", "__tests__/**/*.js"], {
  ignored: /node_modules/,
  persistent: true,
  ignoreInitial: true
});

const cssWatcher = chokidar.watch(["css/**/*.css"], {
  ignored: /node_modules/,
  persistent: true,
  ignoreInitial: true
});

jsWatcher.on("change", (path) => {
  console.log(`\nJS File changed: ${path}`);
  console.log("Running ESLint...\n");
  
  const eslint = spawn("npx", ["eslint", path], { stdio: "inherit" });
  
  eslint.on("close", (eslintCode) => {
    if (eslintCode === 0) {
      console.log("\nESLint passed!\n");
    } else {
      console.log("\nESLint failed!\n");
    }
    
    console.log("Running related tests...\n");
    const jest = spawn(
      "node",
      [
        "--experimental-vm-modules",
        "node_modules/jest/bin/jest.js",
        "--findRelatedTests",
        path
      ],
      { stdio: "inherit" }
    );
    
    jest.on("close", (jestCode) => {
      if (jestCode === 0) {
        console.log("\nTests passed!\n");
      } else {
        console.log("\nTests failed!\n");
      }
      console.log("Watching for changes...\n");
    });
  });
});

cssWatcher.on("change", (path) => {
  console.log(`\nCSS File changed: ${path}`);
  console.log("Running Stylelint...\n");
  
  const stylelint = spawn("npx", ["stylelint", path], { stdio: "inherit" });
  
  stylelint.on("close", (code) => {
    if (code === 0) {
      console.log("\nCSS linting passed!\n");
    } else {
      console.log("\nCSS linting failed!\n");
    }
    console.log("Watching for changes...\n");
  });
});

console.log("Auto-watching enabled!");
console.log("JS files -> ESLint + Jest");
console.log("CSS files -> Stylelint");
console.log("\nWatching: js/**/*.js, __tests__/**/*.js, css/**/*.css");
console.log("Press Ctrl+C to stop\n");
