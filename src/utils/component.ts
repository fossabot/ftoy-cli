import Axios, { AxiosError, AxiosResponse } from "axios";
import { IComponent } from "../interface/IComponent";
import { IType } from "../interface/IType";
import { Command } from "./command";
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
    const { data } = await Axios.get(
      "http://ftoy.58corp.com/category/list",
    ).then((res: AxiosResponse) => res.data);
    return data;
  }

  public static bundle() {
    Command.exec(`npm run ${Project.buildScript}`);
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
