import * as Debug from "debug";
import { readdirSync, statSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { posix, resolve } from "path";
import { format } from "util";
import { CommandModule } from "yargs";
import { IComponent } from "../interface/IComponent";
import { Component } from "../utils/component";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";
import { Project } from "../utils/project";
import { generateTable } from "../utils/table";

const debug = Debug("[Command] release");

module.exports = {
  aliases: ["rl"],
  command: "release",
  describe: "发布组件",
  handler: async () => {
    const spinner = ora();
    try {
      if (!Project.isValid()) {
        spinner.info("当前目录似乎不符合项目规范，请确保处于组件项目根目录");
      } else {
        spinner.start("正在打包组件...");
        Component.bundle();
        Git.commit("Build via ftoy-cli.");
        Git.push();

        spinner.start("正在读取信息...");
        const allComponents: IComponent[] = await Component.getAllComponents();

        if (!allComponents || !allComponents.length) {
          spinner.info("当前项目中组件列表为空");
          process.exit();
        }

        spinner.stop();
        const { selectedComponents }: any = await prompt({
          type: "checkbox",
          name: "selectedComponents",
          message: "请选择你要发布的组件",
          choices: allComponents.map(component => ({
            name: `${component.name} v${component.version}`,
            value: component
          })),
          validate: e => e.length >= 1 || "至少选择一个组件"
        });
        spinner.start("正在发布组件...");
        const results: Array<{
          success: boolean;
          msg: string;
          component: IComponent;
        }> = await Promise.all(
          (selectedComponents as IComponent[]).map(
            async (selectedComponent: IComponent) => {
              return new Component(selectedComponent)
                .release("online")
                .then((data: any) => {
                  debug(data);

                  const { code } = data;
                  return {
                    success: code === 0,
                    msg: code === 0 ? "" : "未知错误",
                    component: selectedComponent
                  };
                })
                .catch(msg => {
                  return {
                    success: false,
                    msg,
                    component: selectedComponent
                  };
                });
            }
          )
        );
        spinner.clear().stop();

        const logs = [
          ["状态", "类型", "名称", "简述", "版本号", "备注信息"],
          ...results.map(result => [
            result.success ? "成功" : "失败",
            result.component.type,
            result.component.name,
            result.component.label,
            result.component.version,
            result.msg
          ])
        ];
        process.stdout.write(generateTable(logs));
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  }
} as CommandModule;
