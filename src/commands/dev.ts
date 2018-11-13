import { prompt } from "inquirer";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";
import { fork } from "child_process";
import { resolve } from "path";

module.exports = {
  aliases: ["d"],
  command: "dev",
  describe: "组件调试开发",
  handler: () => {
    // TODO toy-app 修改，添加 debug 环境
    fork(resolve(__dirname, "../process/build.watch"), [], {
      stdio: "inherit"
    });
    fork(resolve(__dirname, "../process/mock.router"), [], {
      stdio: "inherit"
    });
  }
} as CommandModule;
