import { fork } from "child_process";
import { prompt } from "inquirer";
import { resolve } from "path";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";

module.exports = {
  aliases: ["d"],
  command: "dev",
  describe: "组件调试开发",
  handler: () => {
    fork(resolve(__dirname, "../process/build.watch"), [], {
      stdio: "inherit",
    });
    fork(resolve(__dirname, "../process/mock.router"), [], {
      stdio: "inherit",
    });
  },
} as CommandModule;
