import chokidar from "chokidar";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const testMapping = {
  "js/landing.js": "__tests__/visual/theme.spec.js",
  "js/ThemeManager.js": "__tests__/visual/theme.spec.js",
  "js/constants.js": "__tests__/visual/theme.spec.js",
  "css/main.css": "__tests__/visual/theme.spec.js",
  "index.html": "__tests__/visual/theme.spec.js",
};

let currentTestProcess = null;
let testQueue = [];
let isRunning = false;

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function killCurrentTest() {
  if (currentTestProcess) {
    currentTestProcess.kill("SIGTERM");
    currentTestProcess = null;
  }
}

function runTest(testFile) {
  if (isRunning) {
    testQueue.push(testFile);
    console.log(`${colors.yellow}Test queued: ${testFile}${colors.reset}`);
    return;
  }

  isRunning = true;
  console.log(`\n${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}Running tests: ${testFile}${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

  const startTime = Date.now();

  currentTestProcess = spawn("npx", ["playwright", "test", testFile], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });

  currentTestProcess.on("close", (code) => {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    if (code === 0) {
      console.log(`\n${colors.green}Tests passed in ${duration}s${colors.reset}\n`);
    } else {
      console.log(`\n${colors.red}Tests failed in ${duration}s (exit code: ${code})${colors.reset}\n`);
    }

    currentTestProcess = null;
    isRunning = false;

    if (testQueue.length > 0) {
      const nextTest = testQueue.shift();
      runTest(nextTest);
    } else {
      console.log(`${colors.magenta}Watching for changes...${colors.reset}\n`);
    }
  });

  currentTestProcess.on("error", (error) => {
    console.error(`${colors.red}Test execution error: ${error.message}${colors.reset}`);
    isRunning = false;
  });
}

const debouncedRunTest = debounce((testFile) => {
  killCurrentTest();
  testQueue = [];
  runTest(testFile);
}, 500);

function initWatcher() {
  const watcher = chokidar.watch(
    [
      "js/**/*.js",
      "css/**/*.css",
      "index.html",
      "__tests__/**/*.spec.js",
      "__tests__/**/helpers/**/*.js",
    ],
    {
      ignored: /(^|[\\])\../,
      persistent: true,
      ignoreInitial: true,
      cwd: projectRoot,
      awaitWriteFinish: {
        stabilityThreshold: 300,
        pollInterval: 100,
      },
    }
  );

  console.log(`${colors.bright}${colors.green}Animation Arcade - Test Watcher${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}`);
  console.log(`${colors.magenta}Watching for file changes...${colors.reset}`);
  console.log(`${colors.yellow}Watched patterns:${colors.reset}`);
  console.log(`${colors.cyan}${"=".repeat(60)}${colors.reset}\n`);

  watcher
    .on("change", (filePath) => {
      const normalizedPath = filePath.replace(/\\/g, "/");
      console.log(`${colors.yellow}File changed: ${normalizedPath}${colors.reset}`);

      if (normalizedPath.includes("__tests__") && normalizedPath.endsWith(".spec.js")) {
        debouncedRunTest(normalizedPath);
        return;
      }

      if (normalizedPath.includes("__tests__") && normalizedPath.includes("helpers")) {
        console.log(`${colors.blue}Helper file changed, running all tests${colors.reset}`);
        debouncedRunTest("__tests__/visual");
        return;
      }

      const testFile = testMapping[normalizedPath];

      if (testFile) {
        debouncedRunTest(testFile);
      } else {
        console.log(`${colors.yellow}No test mapping found for: ${normalizedPath}${colors.reset}`);
        console.log(`${colors.yellow}Add mapping in scripts/test-watcher.js if needed${colors.reset}\n`);
      }
    })
    .on("error", (error) => {
      console.error(`${colors.red}Watcher error: ${error}${colors.reset}`);
    });

  return watcher;
}

function setupCleanup(watcher) {
  const cleanup = () => {
    console.log(`\n${colors.yellow}Stopping file watcher...${colors.reset}`);
    killCurrentTest();
    watcher.close();
    process.exit(0);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
}

const watcher = initWatcher();
setupCleanup(watcher);