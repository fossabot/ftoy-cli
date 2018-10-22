import { prompt } from "inquirer";
import { CommandModule } from "yargs";

module.exports = {
  aliases: ["d"],
  command: "dev",
  describe: "组件调试开发",
  handler: () => {
    // TODO toy-app 修改，添加 debug 环境
  },
} as CommandModule;
