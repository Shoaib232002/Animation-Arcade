import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,

  // Browser source files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "no-console": "warn",
      "no-debugger": "error",
      "eqeqeq": ["error", "always"],
      "max-depth": ["warn", 4],
      "complexity": ["warn", 10]
    }
  },

  // Jest + jsdom test files
  {
    files: ["**/__tests__/**/*.{js,mjs}", "**/*.test.{js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser
      }
    }
  },

  // Node / config / scripts
  {
    files: ["**/*.config.{js,mjs}", "**/scripts/**/*.{js,mjs}"],
    languageOptions: {
      globals: globals.node
    },
    rules: {
      "no-console": "off"
    }
  }
];
