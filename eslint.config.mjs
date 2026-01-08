import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      prettier,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "prettier/prettier": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "warn",
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-console": "warn",
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      "max-depth": ["warn", 4],
      complexity: ["warn", 10],
    },
  },
  {
    files: [
      "**/__tests__/**/*.{js,mjs}",
      "**/*.test.{js,mjs}",
      "tests/**/*.{js,mjs}",
      "**/*.spec.{js,mjs}",
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    files: [
      "server.js",
      "watch-tests.mjs",
      "**/*.config.{js,mjs}",
      "**/scripts/**/*.{js,mjs}",
    ],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "no-console": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "test-results/**",
      "playwright-report/**",
      ".cache/**",
    ],
  },
];
