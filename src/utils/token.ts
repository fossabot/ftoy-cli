import Axios, { AxiosResponse } from "axios";
import { PRIVATE_TOKEN_API } from "../const";

export class Token {
  public static async getValue() {
    return Axios.get(PRIVATE_TOKEN_API)
      .then((res: AxiosResponse) => res.data)
      .then(({ data }) => data);
  }
}
