import Axios, { AxiosResponse } from "axios";
import * as Debug from "debug";
import { readdirSync, statSync } from "fs";
import { prompt } from "inquirer";
import ora = require("ora");
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
    const componentDir = resolve(__dirname, "src", "components");
    const allComponents: IComponent[] = readdirSync(componentDir)
      .filter((e) => statSync(resolve(componentDir, e)).isDirectory())
      .map((component) => resolve(componentDir, component, "config.js"))
      .map((configJs) => require(configJs))
      .map((config: IComponent) => {
        const versionFixed = config.version || "1.0.0";
        return Object.assign(config, {
          _id: config.name,
          version: versionFixed,
          gitname: Git.getRepoName(),
          regname: config.name + versionFixed.split(".").join("-"),
          giturl: Git.getRemoteUrl(),
          path: ["src", "components", config.name].join("/"),
          attributes: config.props.attributes.default(),
        });
      });

    debug(allComponents);
    const { selectedComponents }: any = await prompt({
      type: "checkbox",
      name: "selectedComponents",
      message: "请选择你要发布的组件",
      choices: allComponents.map((component) => ({
        name: `${component.name}-${component.version}`,
        value: component,
      })),
      validate: (e) => e.length >= 1 || "至少选择一个组件",
    });

    debug(selectedComponents);
    (selectedComponents as IComponent[]).forEach(
      async (selectedComponent: IComponent) => {
        const spinner = ora(
          `正在发布组件 ${selectedComponent.name}，版本号 ${
            selectedComponent.version
          }`,
        );
        spinner.start();
        new Component(selectedComponent)
          .release()
          .then((data: any) => {
            debug(data);

            const { code } = data;
            if (code === 0) {
              spinner.succeed(
                `组件 ${selectedComponent.name} 发布成功，版本号 ${
                  selectedComponent.version
                }`,
              );
            } else {
              spinner
                .fail(
                  `组件 ${selectedComponent.name} 发布失败，版本号 ${
                    selectedComponent.version
                  }`,
                )
                .stopAndPersist({ text: `Code: ${code}`, symbol: "✖" });
            }
          })
          .catch((msg) => {
            spinner
              .fail(
                `组件 ${selectedComponent.name} 发布失败，版本号 ${
                  selectedComponent.version
                }`,
              )
              .stopAndPersist({ text: "请求失败，服务器错误", symbol: "✖" });
          });
      },
    );
  },
} as CommandModule;
