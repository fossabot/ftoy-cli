import { readFileSync } from "fs";
import { CHECK_GAP, CHECK_UPDATE_CACHE_FILE } from "../const";

export class Version {
  public static get shouldCheck(): boolean {
    let shouldCheck = false;
    try {
      const cache = readFileSync(CHECK_UPDATE_CACHE_FILE, {
        encoding: "UTF-8",
      });
      const beforeTimestamp = parseInt(cache, 10);
      shouldCheck = beforeTimestamp
        ? Date.now() - beforeTimestamp >= CHECK_GAP
        : true;
    } catch (e) {
      shouldCheck = true;
    }
    return shouldCheck;
  }

  /**
   * 若 result 为 1，则 v1 > v2
   * 若 result 为 0，则 v1 = v2
   * 若 result 为 -1，则 v2 > v1
   *
   * @param v1
   * @param v2
   * @returns
   */
  public static compare(
    v1: string,
    v2: string,
  ): {
    result: 1 | 0 | -1;
    max: string;
    min: string;
  } {
    const v1Arr = v1.split(".");
    const v2Arr = v2.split(".");

    for (let i = 0; i < 4; i++) {
      const n1 = parseInt(v1Arr[i], 10) || 0;
      const n2 = parseInt(v2Arr[i], 10) || 0;

      if (n1 > n2) {
        return {
          result: 1,
          max: v1Arr.join("."),
          min: v2Arr.join("."),
        };
      }
      if (n2 > n1) {
        return {
          result: -1,
          max: v2Arr.join("."),
          min: v1Arr.join("."),
        };
      }
    }

    return {
      result: 0,
      max: v1Arr.join("."),
      min: v1Arr.join("."),
    };
  }
}
