import { createHash } from "crypto";
import * as Debug from "debug";
import { readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { join, resolve } from "path";
import { format } from "util";
import { CommandModule } from "yargs";
import { TMP_COMPONENT_DIR } from "../const";
import { cacheComponents } from "../utils/cache";
import { Component } from "../utils/component";
import { Directory } from "../utils/directory";
import { Project } from "../utils/project";

const debug = Debug("[Command] generate");

async function askForComponentType(): Promise<{
  componentType: string;
  componentName: string;
}> {
  const spinner = ora();
  const componentDir = Project.componentDir;
  spinner.start("正在获取组件类型...");
  const types = (await Component.getTypes()) || [];
  spinner.stop();

  return await prompt({
    message: "请选择组件类型",
    name: "componentType",
    type: "list",
    choices: types.map((e) => ({
      name: `${e.label} - ${[...e.value]
        .map((s: string, i: number) => (i === 0 ? s.toUpperCase() : s))
        .join("")}`,
      value: e.value,
    })),
  }).then(async ({ componentType }: any) => {
    const hash = createHash("md5");
    const res = hash
      .update(Date.now().toString())
      .digest("hex")
      .slice(0, 6);
    const componentName = `toy-${componentType}-${res}`;
    if (Directory.exist(resolve(componentDir, componentName))) {
      spinner.info(`项目目录 ${componentDir} 中已存在 ${componentName} 文件夹`);
      return await askForComponentType();
    } else if (!(await Component.validateName(componentName))) {
      spinner.info(`组件库中已存在 ${componentName} 组件`);
      return await askForComponentType();
    } else if (!componentName.match(/^[a-zA-Z0-9\-]+$/)) {
      spinner.info("组件名称不符合命名规范");
      return await askForComponentType();
    } else {
      return {
        componentType,
        componentName,
      };
    }
  });
}

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
        const { componentType, componentName } = await askForComponentType();

        const { componentLabel = "" }: any = await prompt({
          message: "请输入组件简述（建议使用中文，用作组件展示）",
          name: "componentLabel",
          validate: (type) => !!type || "组件简述不能为空哦",
        });

        spinner.start("正在克隆组件...");
        if (!Directory.exist(TMP_COMPONENT_DIR)) {
          await cacheComponents();
        }
        const componentDist = join(componentDir, componentName);
        Directory.copy(TMP_COMPONENT_DIR, componentDist);

        spinner.start("正在更新信息...");
        const configPath = resolve(componentDist, "config.js");
        const configStrBefore = readFileSync(configPath, "utf8");
        const configStrAfter = format(
          configStrBefore,
          componentType,
          componentName,
          componentLabel,
        );
        writeFileSync(configPath, configStrAfter, "utf8");

        spinner.succeed("组件创建成功！\n");

        Directory.readAllSync(componentDist).forEach((file) => {
          spinner.stopAndPersist({
            symbol: "CREATE",
            text: file,
          });
        });
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
