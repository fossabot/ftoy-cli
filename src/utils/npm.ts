import { which } from "shelljs";

export class NodePackageManager {
  public static MANAGERS = ["yarn", "cnpm", "npm"];

  public static get managersCanUse(): string[] {
    return NodePackageManager.MANAGERS.filter((cmd) => !!which(cmd));
  }
}
