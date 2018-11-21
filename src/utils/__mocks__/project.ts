import { join } from "path";

const ROOT = "temp";
export class Project {
  public static componentDir: string = join(ROOT, "__components__");
  public static distDir: string = join(ROOT, "dist");
  public static buildScript: string = "build";
  public static buildWatchScript: string =  "build:w";
  public static testServer: string = "192.168.66.198:7112";

  public static isValid(): boolean {
    return true;
  }
}
