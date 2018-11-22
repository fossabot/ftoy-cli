import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
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

  /**
   * 删除文件(夹)
   *
   * @static
   * @param {string} name 文件(夹)路径
   * @memberof Directory
   */
  public static delete(name: string): void {
    rm("-rf", resolve(name));
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
    cp("-R", resolve(from), resolve(to));
  }

  /**
   * 递归获取目录文件
   *
   * @param dir 目录
   */
  public static readAllSync(dir: string): string[] {
    const subs = readdirSync(dir).map((sub) => join(dir, sub));
    const subDirs = subs
      .filter((sub) => statSync(sub).isDirectory())
      .reduce(
        (target, subDir) => [...target, ...Directory.readAllSync(subDir)],
        [] as string[],
      );
    const subFiles = subs.filter((sub) => statSync(sub).isFile());
    return [...subDirs, ...subFiles];
  }
}
