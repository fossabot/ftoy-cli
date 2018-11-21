import { Version } from "./version";

jest.mock("../const");

describe("[utils] version", () => {

  describe("shouldCheck", () => {
    test("should return default true", () => {
      expect(Version.shouldCheck).toBe(true);
    });
  });
});
