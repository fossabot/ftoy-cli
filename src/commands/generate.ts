import * as Debug from "debug";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { join, resolve } from "path";
import { format } from "util";
import { CommandModule } from "yargs";
import { TMP_COMPONENT_DIR } from "../const";
import { cacheComponents } from "../utils/cache";
import { Component } from "../utils/component";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";
import { Project } from "../utils/project";

const debug = Debug("[Command] generate");

module.exports = {
  aliases: ["g"],
  command: "generate",
  describe: "新增组件",
  handler: async () => {
    const spinner = ora();
    try {
      if (!Project.isValid()) {
        spinner.info("当前目录似乎不符合项目规范，请确保处于组件项目根目录");
      } else {
        const componentDir = Project.componentDir;
        const { componentName = "" }: any = await prompt({
          message: "请输入组件名称（仅可由大小写字母、数字与字符 - 组成）",
          name: "componentName",
          validate: async (name: string) => {
            if (!name) {
              return "组件名称不能为空哦";
            } else {
              if (Directory.exist(resolve(componentDir, name))) {
                return `项目目录 ${componentDir} 中已存在 ${name} 文件夹`;
              } else if (!(await Component.validateName(name))) {
                return `组件库中已存在 ${name} 组件`;
              } else if (!name.match(/^[a-zA-Z0-9\-]+$/)) {
                return "组件名称不符合命名规范";
              } else {
                return true;
              }
            }
          }
        });
        let types = await Component.getTypes() || [];
        const { componentType = "" }: any = await prompt({
          message: "请选择组件类型",
          name: "componentType",
          type: "list",
          choices: types.map(e => ({
            name: `${e.label} - ${[...e.value]
              .map((s: string, i: number) => (i === 0 ? s.toUpperCase() : s))
              .join("")}`,
            value: e.value
          })),
          validate: type => type.length >= 1 || "请选择其中一项"
        });
        const { componentLabel = "" }: any = await prompt({
          message: "请输入组件简述（建议使用中文，用作组件展示）",
          name: "componentLabel",
          validate: type => !!type || "组件简述不能为空哦"
        });

        spinner.start("正在克隆组件...");
        if (!Directory.exist(TMP_COMPONENT_DIR)) {
          cacheComponents();
        }
        const componentDist = resolve(componentDir, componentName);
        Directory.copy(TMP_COMPONENT_DIR, componentDist);

        spinner.start("正在更新信息...");
        const configPath = resolve(componentDist, "config.js");
        const configStrBefore = readFileSync(configPath, "utf8");
        const configStrAfter = format(
          configStrBefore,
          componentType,
          componentName,
          componentLabel
        );
        writeFileSync(configPath, configStrAfter, "utf8");

        spinner.succeed("组件创建成功！\n");

        readdirSync(componentDist, "utf8").forEach(file => {
          spinner.stopAndPersist({
            symbol: "CREATE",
            text: join(componentDir, componentName, file)
          });
        });
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  }
} as CommandModule;
