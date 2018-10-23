import Axios, { AxiosError, AxiosResponse } from "axios";
import { ExecOptions, ExecSyncOptionsWithStringEncoding } from "child_process";
import { Command } from "./command";

export class Git {
  /**
   * 判断 git 命令是否存在
   *
   * @readonly
   * @static
   * @returns {boolean}
   * @memberof Git
   */
  public static get isExisted(): boolean {
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
   * @returns {Promise<string>}  返回结果
   * @memberof Git
   */
  public static clone({ url = "", dist = "", branch = "master" } = {}): Promise<
    string
  > {
    if (!url) {
      throw Error("The argument `url` is required.");
    }

    if (!Git.isExisted) {
      throw Error(
        "请确保 Git 已正确安装。了解更多信息前往 https://git-scm.com/",
      );
    } else {
      return Command.execp(
        `git clone --depth 1 --single-branch -b ${branch} ${url} ${dist}`,
        {
          encoding: "utf8",
          stdio: [null, null, null],
        },
      );
    }
  }

  /**
   * 创建远程仓库
   *
   * @static
   * @param {string} name 仓库名
   * @param {*} [{ namespace_id = 14777, visibility = "internal" }={}] 配置参数
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static create(
    name: string,
    { namespace_id = 14777, visibility = "internal" } = {},
  ): Promise<string> {
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
        .catch((err: AxiosError) => Promise.reject(err.message));
    }
  }

  public static async commit(
    message = "",
    options = {} as ExecSyncOptionsWithStringEncoding,
  ): Promise<boolean> {
    if (!message) {
      throw Error("The argument `message` is required.");
    }

    if (!Git.isClean(options)) {
      await Command.execp(`git add .`, options);
      await Command.execp(`git commit -a -m "${message}"`, options);
      return true;
    } else {
      return false;
    }
  }

  public static async push({
    origin = "origin",
    branch = "master",
    options = {} as ExecSyncOptionsWithStringEncoding,
  } = {}): Promise<string> {
    await Git.commit("Auto commit by ftoy-cli.", options);
    return Command.execp(`git push ${origin} ${branch}`, options);
  }

  public static isClean(
    options = {} as ExecSyncOptionsWithStringEncoding,
  ): boolean {
    try {
      const res = Command.exec("git status -s", options);
      return !res;
    } catch (e) {
      return true;
    }
  }

  public static async setRemoteUrl(
    url: string,
    options = {} as ExecSyncOptionsWithStringEncoding,
  ) {
    if (!url) {
      throw Error("The argument `url` is required.");
    }
    return Command.execp(`git remote set-url origin ${url}`, options);
  }
}
