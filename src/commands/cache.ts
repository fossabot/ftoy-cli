import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { cacheComponents, cacheProjects, cleanCache } from "../utils/cache";

const debug = Debug("[Command] cache");

module.exports = {
  aliases: ["c"],
  command: "cache",
  describe: "组件缓存管理",
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
          await cacheProjects();

          // 组件缓存
          spinner.start("正在更新组件缓存...");
          await cacheComponents();

          spinner.succeed("更新缓存成功");
          break;
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
