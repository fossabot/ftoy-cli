import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { resolve } from "path";
import { CommandModule } from "yargs";
import { TMP_COMPONENT_DIR } from "../const";
import { cacheComponent } from "../utils/cache";
import { Component } from "../utils/component";
import { Directory } from "../utils/directory";
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
          message: "请输入组件名称",
          name: "componentName",
          validate: async (name) => {
            if (!name) {
              return "组件名称不能为空哦";
            } else {
              if (Directory.exist(resolve(componentDir, name))) {
                return `本地项目目录中已存在 ${name} 文件夹`;
              } else if (!(await Component.validateName(name))) {
                return `组件库中已存在 ${name} 组件`;
              } else {
                return true;
              }
            }
          },
        });
        spinner.start("正在克隆组件...");
        if (!Directory.exist(TMP_COMPONENT_DIR)) {
          cacheComponent();
        }
        const componentDist = resolve(componentDir, componentName);
        Directory.copy(TMP_COMPONENT_DIR, componentDist);

        spinner.succeed("组件创建成功！");
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
