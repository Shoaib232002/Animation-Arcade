export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".js"],
  testMatch: ["**/__tests__/**/*.test.js"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/tests/",
    "/playwright-report/",
    "/test-results/",
  ],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  transform: {},
};
