import { prompt } from "inquirer";
import { CommandModule } from "yargs";

module.exports = {
  aliases: ["t"],
  command: "test",
  describe: "发布组件至测试环境",
  handler: () => {
    // TODO 复用 release 类，更改 API 地址
  },
} as CommandModule;
