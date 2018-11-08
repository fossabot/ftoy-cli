import * as Debug from "debug";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { TMP_COMPONENT_DIR } from "../const";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";

const debug = Debug("[Command] generate");

module.exports = {
  aliases: ["g"],
  command: "generate",
  describe: "新增组件",
  handler: async () => {
    const spinner = ora();
    try {
      const dist = TMP_COMPONENT_DIR;
      if (!Directory.exist(dist)) {
        await Git.clone({
          url: "http://igit.58corp.com/ftoy-cli/toy-component-normal.git",
          dist,
        });
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
