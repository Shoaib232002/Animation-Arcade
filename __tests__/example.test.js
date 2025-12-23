import { multiply } from "../js/example.js";

describe("multiply", () => {
  test("multiplies two numbers", () => {
    expect(multiply(2, 3)).toBe(6);
  });
});
