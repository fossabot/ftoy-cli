import { resolve } from "path";
import { cp, rm, test as shellTest } from "shelljs";

export class Directory {
  /**
   * 判断文件(夹)是否存在
   *
   * @static
   * @param {string} name 文件(夹)路径
   * @param {string} [type="all" as "file" | "dir" | "all"] 类型
   * @returns {boolean}
   * @memberof Directory
   */
  public static exist(
    name: string,
    type = "all" as "file" | "dir" | "all",
  ): boolean {
    if (!name) {
      throw Error("The argument `name` is required.");
    } else {
      const target = resolve(name);
      switch (type) {
        case "file":
          return shellTest("-f", target);
        case "dir":
          return shellTest("-d", target);
        default:
          return shellTest("-e", target);
      }
    }
  }

  /**
   * 删除文件(夹)
   *
   * @static
   * @param {string} name 文件(夹)路径
   * @memberof Directory
   */
  public static delete(name: string): void {
    if (!name) {
      throw Error("The argument `name` is required.");
    } else {
      rm("-rf", resolve(name));
    }
  }

  /**
   * 复制文件(夹)
   *
   * @static
   * @param {string} from   起
   * @param {string} to     止
   * @memberof Directory
   */
  public static copy(from: string, to: string): void {
    if (!from) {
      throw Error("The argument `from` is required.");
    } else if (!to) {
      throw Error("The argument `to` is required.");
    } else {
      cp("-r", resolve(from), resolve(to));
    }
  }
}
