import { calTabNum, generateTable, getShowLength } from "./table";

describe("[utils] table", () => {
  describe("generateTable", () => {
    test("should return string", () => {
      expect(generateTable([["中文测试 Head"], ["中文测试 Body"]])).toContain(
        `--------`,
      );
    });
  });

  describe("calTabNum", () => {
    test("should return number", () => {
      expect(calTabNum()).toBe(1);
      expect(calTabNum("中文测试 Head")).toBe(2);
    });
  });

  describe("getShowLength", () => {
    test("should return number", () => {
      expect(getShowLength()).toBe(0);
      expect(getShowLength("中文测试 Head")).toBe(13);
    });
  });
});
