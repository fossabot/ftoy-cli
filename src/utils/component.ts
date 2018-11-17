import Axios, { AxiosError, AxiosResponse } from "axios";
import { readdirSync, statSync } from "fs";
import { posix, resolve } from "path";
import { IComponent } from "../interface/IComponent";
import { IType } from "../interface/IType";
import { Command } from "./command";
import { Directory } from "./directory";
import { Git } from "./git";
import { Project } from "./project";

export class Component {
  public static async validateName(name: string): Promise<boolean> {
    const { data: isValid } = await Axios.post(
      "http://ftoy.58corp.com/cli/name/validate",
      {
        name,
      },
    ).then((res: AxiosResponse) => res.data);
    return isValid;
  }

  public static async getTypes(): Promise<IType[]> {
    const { data = [] } = await Axios.get(
      "http://ftoy.58corp.com/category/list",
    ).then((res: AxiosResponse) => res.data);
    return data;
  }

  public static async bundle() {
    const allComponents: IComponent[] = await Component.getAllComponents();

    if (!allComponents || !allComponents.length) {
      throw Error("当前项目中组件列表为空");
    } else {
      Command.exec(`npm run ${Project.buildScript}`);
    }
  }

  public static async getAllComponents(): Promise<IComponent[]> {
    const remoteUrl = await Git.getRemoteUrl().catch(() =>
      Promise.reject("找不到远程地址，请确保当前仓库存在 [origin] 信息。"),
    );
    const repoName = await Git.getRepoName().catch(() =>
      Promise.reject("找不到项目名称，请确保当前仓库存在 [origin] 信息。"),
    );
    const distDir = Project.distDir;
    const componentDir = Project.componentDir;
    const allComponents: IComponent[] = readdirSync(componentDir)
      .filter((e) => statSync(resolve(componentDir, e)).isDirectory())
      .filter((component) =>
        Directory.exist(resolve(componentDir, component, "config.js")),
      )
      .map((component) => {
        const configJs = resolve(componentDir, component, "config.js");
        delete require.cache[configJs];
        const config: IComponent = require(configJs);
        const versionFixed = config.version || "1.0.0";
        return Object.assign(config, {
          _id: config.name,
          version: versionFixed,
          gitname: repoName,
          regname: config.name + versionFixed.split(".").join("-"),
          giturl: remoteUrl,
          path: posix.join(distDir, component),
          attributes: config.props.attributes.default(),
        });
      });
    return allComponents;
  }

  public config: IComponent;

  constructor(config: IComponent) {
    this.config = config;
  }

  public release(env = "test" as "online" | "test") {
    if (!this.config) {
      throw new Error("The argument `config` is required.");
    } else {
      const map = {
        online: "http://ftoy.58corp.com/component/update",
        test: `http://${Project.testServer}/component/update`,
      };
      return Axios.post(map[env || "test"], {
        component: this.config,
      })
        .then((res: AxiosResponse) => res.data)
        .catch((err: AxiosError) => Promise.reject(err.message));
    }
  }
}
