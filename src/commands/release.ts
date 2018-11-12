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
        const remoteUrl = await Git.getRemoteUrl().catch(() =>
          Promise.reject("找不到远程地址，请确保当前仓库存在 [origin] 信息。"),
        );
        const repoName = await Git.getRepoName().catch(() =>
          Promise.reject("找不到项目名称，请确保当前仓库存在 [origin] 信息。"),
        );

        spinner.start("正在打包组件...");
        Component.bundle();
        Git.commit("Build via ftoy-cli.");
        Git.push();

        spinner.start("正在读取信息...");
        let tmpPath: string;
        const distDir = Project.distDir;
        const componentDir = Project.componentDir;
        const allComponents: IComponent[] = readdirSync(componentDir)
          .filter((e) => statSync(resolve(componentDir, e)).isDirectory())
          .filter((component) =>
            Directory.exist(resolve(componentDir, component, "config.js")),
          )
          .map((component) => {
            tmpPath = posix.join(distDir, component);
            return resolve(componentDir, component, "config.js");
          })
          .map((configJs) => require(configJs))
          .map((config: IComponent) => {
            const versionFixed = config.version || "1.0.0";
            return Object.assign(config, {
              _id: config.name,
              version: versionFixed,
              gitname: repoName,
              regname: config.name + versionFixed.split(".").join("-"),
              giturl: remoteUrl,
              path: tmpPath,
              attributes: config.props.attributes.default(),
            });
          });
        debug(allComponents);

        if (!allComponents || !allComponents.length) {
          spinner.info("当前项目中组件列表为空");
          process.exit();
        }

        spinner.stop();
        const { selectedComponents }: any = await prompt({
          type: "checkbox",
          name: "selectedComponents",
          message: "请选择你要发布的组件",
          choices: allComponents.map((component) => ({
            name: `${component.name} v${component.version}`,
            value: component,
          })),
          validate: (e) => e.length >= 1 || "至少选择一个组件",
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
                .release()
                .then((data: any) => {
                  debug(data);

                  const { code } = data;
                  return {
                    success: code === 0,
                    msg: code === 0 ? "" : "未知错误",
                    component: selectedComponent,
                  };
                })
                .catch((msg) => {
                  return {
                    success: false,
                    msg,
                    component: selectedComponent,
                  };
                });
            },
          ),
        );
        spinner.clear().stop();

        const successComponents = results.filter((e) => e.success);
        if (successComponents && successComponents.length) {
          const successLogs = [
            "-".repeat(50),
            "状态\t名称\t版本号",
            "-".repeat(50),
          ];
          successComponents.forEach((result) => {
            successLogs.push(
              format(
                "%s\t%s\t%s",
                "成功",
                result.component.name,
                result.component.version,
              ),
            );
          });
          successLogs.push("-".repeat(50), "\n");
          process.stdout.write(successLogs.join("\n"));
        }

        const failedComponents = results.filter((e) => !e.success);
        if (failedComponents && failedComponents.length) {
          const failedLogs = [
            "-".repeat(50),
            "状态\t名称\t版本号\t错误信息",
            "-".repeat(50),
          ];
          failedComponents.forEach((result) => {
            failedLogs.push(
              format(
                "%s\t%s\t%s\t%s",
                "失败",
                result.component.name,
                result.component.version,
                result.msg,
              ),
            );
          });
          failedLogs.push("-".repeat(50), "\n");
          process.stdout.write(failedLogs.join("\n"));
        }
      }
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
