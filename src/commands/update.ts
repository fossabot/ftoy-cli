import { prompt } from "inquirer";
import { CommandModule } from "yargs";

module.exports = {
  aliases: ["u"],
  command: "update",
  describe: "更新 CLI 工具",
  handler: (argv) => {
    // TODO 搭建服务器端版本管理，调用 NPM 类执行命令
  },
} as CommandModule;
