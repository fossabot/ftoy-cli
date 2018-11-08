import Axios, { AxiosResponse } from "axios";
import * as Debug from "debug";
import { readdirSync, statSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { join, resolve } from "path";
import { CommandModule } from "yargs";
import { IComponent } from "../interface/IComponent";
import { Component } from "../utils/component";
import { Git } from "../utils/git";

const debug = Debug("[Command] release");

module.exports = {
  aliases: ["rl"],
  command: "release",
  describe: "发布组件",
  handler: async () => {
    const spinner = ora();
    try {
      spinner.start("正在获取信息...");
      const remoteUrl = await Git.getRemoteUrl().catch(() =>
        Promise.reject("找不到远程地址，请确保当前仓库存在 [origin] 信息。"),
      );
      const repoName = await Git.getRepoName().catch(() =>
        Promise.reject("找不到项目名称，请确保当前仓库存在 [origin] 信息。"),
      );
      const componentDir = resolve("src", "components");
      const allComponents: IComponent[] = readdirSync(componentDir)
        .filter((e) => statSync(resolve(componentDir, e)).isDirectory())
        .map((component) => resolve(componentDir, component, "config.js"))
        .map((configJs) => require(configJs))
        .map((config: IComponent) => {
          const versionFixed = config.version || "1.0.0";
          return Object.assign(config, {
            _id: config.name,
            version: versionFixed,
            gitname: repoName,
            regname: config.name + versionFixed.split(".").join("-"),
            giturl: remoteUrl,
            path: ["src", "components", config.name].join("/"),
            attributes: config.props.attributes.default(),
          });
        });

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
      const result = Promise.all(
        (selectedComponents as IComponent[]).map(
          async (selectedComponent: IComponent) => {
            // new Component(selectedComponent)
            //   .release()
            //   .then((data: any) => {
            //     debug(data);

            //     const { code } = data;
            //     if (code === 0) {
            //       componentSpinner.succeed(
            //         `组件 ${selectedComponent.name} 发布成功，版本号 ${
            //           selectedComponent.version
            //         }`,
            //       );
            //     } else {
            //       componentSpinner
            //         .fail(
            //           `组件 ${selectedComponent.name} 发布失败，版本号 ${
            //             selectedComponent.version
            //           }`,
            //         )
            //         .stopAndPersist({ text: `Code: ${code}`, symbol: "✖" });
            //     }
            //   })
            //   .catch((msg) => {
            //     componentSpinner
            //       .fail(
            //         `组件 ${selectedComponent.name} 发布失败，版本号 ${
            //           selectedComponent.version
            //         }`,
            //       )
            //       .stopAndPersist({ text: "请求失败，服务器错误", symbol: "✖" });
            //   });
          },
        ),
      );
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
