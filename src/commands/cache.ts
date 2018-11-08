import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { cacheComponent, cacheProject, cleanCache } from "../utils/cache";

const debug = Debug("[Command] cache");

module.exports = {
  aliases: ["c"],
  command: "cache",
  describe: "组件调试开发",
  handler: async () => {
    const spinner = ora();

    try {
      const { choice }: any = await prompt({
        type: "list",
        message: "选择相关操作",
        name: "choice",
        choices: [
          {
            value: "refresh",
            name: "更新缓存",
          },
          {
            value: "clean",
            name: "清除缓存",
          },
        ],
      });
      switch (choice) {
        case "clean":
          spinner.start("正在清空缓存...");
          cleanCache();
          spinner.succeed("清空缓存成功");
          break;
        case "refresh":
          // 项目缓存
          spinner.start("正在更新项目缓存...");
          await cacheProject();

          // 组件缓存
          spinner.start("正在更新组件缓存...");
          await cacheComponent();

          spinner.succeed("更新缓存成功");
          break;
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg, symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
