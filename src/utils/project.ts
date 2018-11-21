import { resolve } from "path";
import { CONFIG_FILE_PATH } from "../config.const";
import { Directory } from "./directory";

const configPath = resolve(CONFIG_FILE_PATH);

let type: string;
let componentDir: string;
let distDir: string;
let buildScript: string;
let buildWatchScript: string;
let testServer: string;

if (Directory.exist(configPath)) {
  const {
    type: $type,
    componentDir: $componentDir,
    distDir: $distDir,
    buildScript: $buildScript,
    buildWatchScript: $buildWatchScript,
    testServer: $testServer,
  }: any = require(configPath);
  type = $type;
  componentDir = $componentDir;
  distDir = $distDir;
  buildScript = $buildScript;
  buildWatchScript = $buildWatchScript;
  testServer = $testServer;
}

export class Project {
  public static componentDir: string = componentDir || "src/components";
  public static distDir: string = distDir || "dist";
  public static buildScript: string = buildScript || "build";
  public static buildWatchScript: string = buildWatchScript || "build:w";
  public static testServer: string = testServer || "192.168.66.198:7112";

  public static isValid(): boolean {
    return type === "ftoy";
  }
}
