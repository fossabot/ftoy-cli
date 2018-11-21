import { writeFileSync } from "fs";
import { CHECK_UPDATE_CACHE_FILE } from "../const";
import { Directory } from "./directory";
import { Version } from "./version";

describe("[utils] version", () => {
  describe("compare", () => {
    test.each`
      v1         | v2         | min        | max        | result
      ${"1.0.0"} | ${"1.0.0"} | ${"1.0.0"} | ${"1.0.0"} | ${0}
      ${"1.0.0"} | ${"2.0.0"} | ${"1.0.0"} | ${"2.0.0"} | ${-1}
      ${"2.0.0"} | ${"1.0.0"} | ${"1.0.0"} | ${"2.0.0"} | ${1}
    `("Version.compare($v1, $v2)", ({ v1, v2, min, max, result }) => {
      expect(Version.compare(v1, v2).max).toEqual(max);
      expect(Version.compare(v1, v2).min).toEqual(min);
      expect(Version.compare(v1, v2).result).toEqual(result);
    });
  });

  describe("shouldCheck", () => {
    test("should return boolean", () => {
      // 无缓存文件
      Directory.delete(CHECK_UPDATE_CACHE_FILE);
      expect(Version.shouldCheck).toBe(true);

      // 缓存文件期内
      writeFileSync(CHECK_UPDATE_CACHE_FILE, Date.now(), "utf8");
      expect(Version.shouldCheck).toBe(false);

      // 缓存文件过期
      writeFileSync(CHECK_UPDATE_CACHE_FILE, 0, "utf8");
      expect(Version.shouldCheck).toBe(true);
    });
  });
});
