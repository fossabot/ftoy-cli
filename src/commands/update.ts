import * as Debug from "debug";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { checkUpdate } from "../process/update.process";

const debug = Debug("[Command] test");

module.exports = {
  aliases: ["up"],
  command: "update",
  describe: "检查更新",
  handler: async () => {
    const spinner = ora();
    try {
      await checkUpdate();
    } catch (msg) {
      spinner.stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
