import Axios, { AxiosError, AxiosResponse } from "axios";
import { execSync } from "child_process";
import { Command } from "./command";

export default class Git {
  /**
   * 判断 git 命令是否存在
   *
   * @readonly
   * @static
   * @memberof Git
   */
  public static get isExisted() {
    return Command.has("git");
  }

  /**
   * 从远程仓库克隆项目
   *
   * @static
   * @param {*} [{
   *     url = "",            复制仓库地址
   *     dist = "",           复制生成文件夹名称
   *     branch = "master",   复制分支名称
   * }={}]
   * @returns {Promise<any>}  返回结果
   * @memberof Git
   */
  public static async clone({
    url = "",
    dist = "",
    branch = "master",
  } = {}): Promise<any> {
    if (!url) {
      throw Error("The argument `url` is required.");
    } else if (!(await Git.isExisted)) {
      throw Error(
        "请确保 Git 已正确安装。了解更多信息前往 https://git-scm.com/",
      );
    } else {
      return new Promise((resolve, reject) => {
        const cmd = `git clone --depth 1 --single-branch -b ${branch} ${url} ${dist}`;
        try {
          const res = execSync(cmd, {
            encoding: "utf8",
            stdio: [null, null, 2],
          });
          resolve(res);
        } catch (err) {
          reject(err.message);
        }
      });
    }
  }

  /**
   * 创建远程仓库
   *
   * @static
   * @param {string} name 仓库名
   * @param {*} [{ namespace_id = 14777, visibility = "internal" }={}] 配置参数
   * @returns {Promise<void>}
   * @memberof Git
   */
  public static async create(
    name: string,
    { namespace_id = 14777, visibility = "internal" } = {},
  ): Promise<string | object> {
    if (!name) {
      throw Error("The argument `name` is required.");
    } else {
      return Axios.post(
        "http://igit.58corp.com/api/v4/projects",
        {
          name,
          namespace_id,
          visibility,
        },
        {
          headers: {
            "Private-Token": "qoHG4AJeyv9BGR8wC9VC",
          },
        },
      )
        .then((res: AxiosResponse) => res.data)
        .catch((res: AxiosError) => Promise.reject(res));
    }
  }
}
