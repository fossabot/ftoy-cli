import { resolve } from "path";
import { Directory } from "./directory";

const configPath = resolve(".ftoy-cli.json");

let type: string;
let componentDir: string;
let distDir: string;
let buildScript: string;
let testServer: string;

if (Directory.exist(configPath)) {
  const {
    type: $type,
    componentDir: $componentDir,
    distDir: $distDir,
    buildScript: $buildScript,
    testServer: $testServer,
  }: any = require(configPath);
  type = $type;
  componentDir = $componentDir;
  distDir = $distDir;
  buildScript = $buildScript;
  testServer = $testServer;
}

export class Project {
  public static componentDir: string = componentDir || "src/components";
  public static distDir: string = distDir || "dist";
  public static buildScript: string = buildScript || "build";
  public static testServer: string = testServer || "192.168.66.198";

  public static isValid(): boolean {
    return type === "ftoy";
  }
}
