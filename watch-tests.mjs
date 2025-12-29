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

// Helper function to run a command with live stdio
const runCommand = (cmd, args, onClose) => {
  const proc = spawn(cmd, args, { stdio: "inherit" });
  proc.on("close", onClose);
};

// JS watcher
jsWatcher.on("change", (path) => {
  console.log(`\nJS File changed: ${path}`);
  console.log("Running ESLint...\n");

  runCommand("npx", ["eslint", path], (eslintCode) => {
    console.log(eslintCode === 0 ? "\nESLint passed!" : "\nESLint failed!");

    console.log("Running related tests...\n");
    runCommand(
      "node",
      [
        "--experimental-vm-modules",
        "node_modules/jest/bin/jest.js",
        "--findRelatedTests",
        path
      ],
      (jestCode) => {
        console.log(jestCode === 0 ? "\nTests passed!" : "\nTests failed!");
        console.log("Watching for changes...\n");
      }
    );
  });
});

// CSS watcher
cssWatcher.on("change", (path) => {
  console.log(`\nCSS File changed: ${path}`);
  console.log("Running Stylelint...\n");

  runCommand("npx", ["stylelint", path], (code) => {
    console.log(code === 0 ? "\nCSS linting passed!" : "\nCSS linting failed!");
    console.log("Watching for changes...\n");
  });
});

console.log("Auto-watching enabled!");
console.log("JS files -> ESLint + Jest");
console.log("CSS files -> Stylelint");
console.log("\nWatching: js/**/*.js, __tests__/**/*.js, css/**/*.css");
console.log("Press Ctrl+C to stop\n");
