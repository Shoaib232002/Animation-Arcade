import http from "http";

describe("Server basic test", () => {
  test("http module should be available", () => {
    expect(http).toBeDefined();
  });
});
