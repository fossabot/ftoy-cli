import * as Debug from "debug";
import { prompt } from "inquirer";
import { CommandModule } from "yargs";
import { release } from "../process/release";

const debug = Debug("[Command] test");

module.exports = {
  aliases: ["t"],
  command: "test",
  describe: "发布组件至测试环境",
  handler: () => {
    release("test", debug);
  },
} as CommandModule;
