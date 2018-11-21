import Axios, { AxiosError, AxiosResponse } from "axios";
import { readdirSync, statSync } from "fs";
import { posix, resolve } from "path";
import {
  TYPE_LIST_API,
  UPDATE_COMPONENT_API_ONLINE,
  UPDATE_COMPONENT_API_TEST,
  VALIDATE_COMPONENT_NAME_API,
} from "../const";
import { IComponent } from "../interface/IComponent";
import { IType } from "../interface/IType";
import { Command } from "./command";
import { Directory } from "./directory";
import { Git } from "./git";
import { Project } from "./project";

export class Component {
  public static async validateName(name: string): Promise<boolean> {
    const { data: isValid } = await Axios.post(VALIDATE_COMPONENT_NAME_API, {
      name,
    }).then((res: AxiosResponse) => res.data);
    return isValid;
  }

  public static async getTypes(): Promise<IType[]> {
    const { data = [] } = await Axios.get(TYPE_LIST_API).then(
      (res: AxiosResponse) => res.data,
    );
    return data;
  }

  public static async bundle(): Promise<void> {
    const allComponents: IComponent[] = await Component.getAllComponents();

    if (!allComponents || !allComponents.length) {
      throw Error("当前项目中组件列表为空");
    } else {
      Command.execSync(`npm run ${Project.buildScript}`);
    }
  }

  public static async getAllComponents(): Promise<IComponent[]> {
    const remoteUrl = await Git.getRemoteUrl().catch(() =>
      Promise.reject("找不到远程地址，请确保当前仓库存在 [origin] 信息。"),
    );
    const repoName = await Git.getRepoName().catch(() =>
      Promise.reject("找不到远程地址，请确保当前仓库存在 [origin] 信息。"),
    );
    const distDir = Project.distDir;
    const componentDir = Project.componentDir;
    if (Directory.exist(componentDir)) {
      const allComponents: IComponent[] = readdirSync(componentDir)
        .filter((e) => statSync(resolve(componentDir, e)).isDirectory())
        .filter((component) =>
          Directory.exist(resolve(componentDir, component, "config.js")),
        )
        .map((component) => {
          const configJs = resolve(componentDir, component, "config.js");
          delete require.cache[configJs];
          const config: IComponent = require(configJs);
          const versionFixed = config.version;
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
    } else {
      return [];
    }
  }

  public config: IComponent;

  constructor(config: IComponent) {
    this.config = config;
  }

  public release(env = "test" as "online" | "test") {
    const map = {
      online: UPDATE_COMPONENT_API_ONLINE,
      test: UPDATE_COMPONENT_API_TEST,
    };
    return Axios.post(map[env], {
      component: this.config,
    }).then((res: AxiosResponse) => res.data);
  }
}
