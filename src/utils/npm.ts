import { which } from "shelljs";

export class NodePackageManager {
  private static MANAGERS = [
    {
      name: "yarn",
      global: "global",
      install: "add",
    },
    {
      name: "cnpm",
      global: "-g",
      install: "i",
    },
    {
      name: "npm",
      global: "-g",
      install: "i",
    },
  ];

  public static get managersCanUse(): Array<{
    name: string;
    global: string;
    install: string;
  }> {
    return NodePackageManager.MANAGERS.filter((manager) => !!which(manager.name));
  }
}
