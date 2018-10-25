import Axios, { AxiosError, AxiosResponse } from "axios";
import { IComponent } from "../interface/IComponent";

export class Component {
  public config: IComponent;

  constructor(config: IComponent) {
    this.config = config;
  }

  public release() {
    if (!this.config) {
      throw new Error("The argument `config` is required.");
    } else {
      return Axios.post("http://ftoy.58corp.com/component/update", {
        component: this.config,
      })
        .then((res: AxiosResponse) => res.data)
        .catch((err: AxiosError) => Promise.reject(err.message));
    }
  }
}
