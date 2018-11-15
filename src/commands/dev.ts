import { fork } from "child_process";
import * as Debug from "debug";
import * as ora from "ora";
import { resolve } from "path";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";
import { Project } from "../utils/project";

const debug = Debug("[Command] dev");

module.exports = {
  aliases: ["d"],
  command: "dev",
  describe: "组件调试开发",
  handler: async () => {
    const spinner = ora();
    try {
      spinner.start("正在打包组件...");
      Command.exec(`npm run ${Project.buildScript}`);
      spinner.stop();

      fork(resolve(__dirname, "../process/build.watch"), [], {
        stdio: "inherit",
      });
      fork(resolve(__dirname, "../process/mock.router"), [], {
        stdio: "inherit",
      });
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
