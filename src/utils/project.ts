import { resolve } from "path";
import { Directory } from "./directory";

const configPath = resolve(".ftoy-cli.json");

let type: string;
let componentDir: string;

if (Directory.exist(configPath)) {
  const { type: $type, componentDir: $componentDir }: any = require(configPath);
  type = $type;
  componentDir = $componentDir;
}

export class Project {
  public static componentDir: string = componentDir || "src/components";

  public static isValid(): boolean {
    return type === "ftoy";
  }
}
