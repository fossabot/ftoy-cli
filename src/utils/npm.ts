import { Command } from "./command";

export default class NodePackageManager {
  public static MANAGERS = ["yarn", "cnpm", "npm"];

  public static get managersCanUse(): string[] {
    return NodePackageManager.MANAGERS.filter(
      async (cmd) => await Command.has(cmd),
    );
  }
}
