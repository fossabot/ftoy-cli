import { fork } from "child_process";
import * as Debug from "debug";
import * as ora from "ora";
import { resolve } from "path";
import { CommandModule } from "yargs";
import { Component } from "../utils/component";

const debug = Debug("[Command] dev");

module.exports = {
  aliases: ["d"],
  command: "dev",
  describe: "组件调试",
  handler: async () => {
    const spinner = ora();
    try {
      spinner.start("正在打包组件...");
      await Component.bundle().catch((e) => {
        spinner.info(e.message);
        process.exit();
      });
      spinner.stop();

      fork(resolve(__dirname, "../process/mock.process"), [], {
        stdio: "inherit",
      });
      fork(resolve(__dirname, "../process/build.watch.process"), [], {
        stdio: "inherit",
      });
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
