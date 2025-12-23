import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
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
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  },
  {
    files: ["**/*.mjs", "**/*.config.js", "**/scripts/**/*.js"],
    rules: {
      "no-console": "off"
    }
  }
];