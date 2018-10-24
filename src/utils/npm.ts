import { Command } from "./command";

export class NodePackageManager {
  public static MANAGERS = ["yarn", "cnpm", "npm"];

  public static get managersCanUse(): string[] {
    return NodePackageManager.MANAGERS.filter((cmd) => Command.has(cmd));
  }
}
