import { add } from "../js/add.js";

describe("add()", () => {
  test("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("adds negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
  });

  test("adds zero correctly", () => {
    expect(add(0, 5)).toBe(5);
  });
});
