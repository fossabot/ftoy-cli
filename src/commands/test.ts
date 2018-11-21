import * as Debug from "debug";
import { CommandModule } from "yargs";
import { release } from "../process/release.process";

const debug = Debug("[Command] test");

module.exports = {
  aliases: ["t"],
  command: "test",
  describe: "发布组件至测试环境",
  handler: () => release("test", debug),
} as CommandModule;
