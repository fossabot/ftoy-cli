import Axios, { AxiosError, AxiosResponse } from "axios";
import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { Command } from "./command";

export class Git {
  /**
   * 初始化项目
   *
   * @static
   * @param {ExecSyncOptionsWithStringEncoding} [options={ encoding: "utf8" }]
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static init(
    options: ExecSyncOptionsWithStringEncoding = { encoding: "utf8" },
  ): boolean {
    Command.exec("rm -rf .git", options);
    Command.exec("git init", options);
    return true;
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

    return Command.execp(
      `git clone --depth 1 --single-branch -b ${branch} ${url} ${dist}`,
      {
        encoding: "utf8",
        stdio: [null, null, null],
      },
    );
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
    {
      namespace_id = 14777, // TODO
      visibility = "private" as "private" | "internal" | "public",
    } = {},
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

  /**
   * 获取项目信息
   *
   * @static
   * @param {string} namespace 群组名称
   * @param {string} name 项目名称
   * @returns {(Promise<string | object>)}
   * @memberof Git
   */
  public static info(
    namespace: string,
    name: string,
  ): Promise<string | object> {
    if (!name) {
      throw Error("The argument `name` is required.");
    } else if (!namespace) {
      throw Error("The argument `namespace` is required.");
    } else {
      const project = encodeURIComponent([namespace, name].join("/"));
      return Axios.get(`http://igit.58corp.com/api/v4/projects/${project}`, {
        headers: {
          "Private-Token": "qoHG4AJeyv9BGR8wC9VC",
        },
      })
        .then((res: AxiosResponse) => res.data)
        .catch((err: AxiosError) => Promise.reject(err.message));
    }
  }

  /**
   * 提交代码
   *
   * @static
   * @param {string} [message=""] 提交信息
   * @param {*} [options={} as ExecSyncOptionsWithStringEncoding] 执行参数
   * @returns {Promise<boolean>}
   * @memberof Git
   */
  public static commit(
    message = "",
    options = {} as ExecSyncOptionsWithStringEncoding,
  ): boolean {
    if (!message) {
      throw Error("The argument `message` is required.");
    }

    if (!Git.isClean(options)) {
      Command.exec(`git add .`, options);
      Command.exec(`git commit -a -m "${message}"`, options);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 推送远程代码
   *
   * @static
   * @param {*} [{
   *     origin = "origin",
   *     branch = "master",
   *     options = {} as ExecSyncOptionsWithStringEncoding,
   *   }={}]
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static async push({
    origin = "origin",
    branch = "master",
    options = {} as ExecSyncOptionsWithStringEncoding,
  } = {}): Promise<string> {
    await Git.commit("Commit via ftoy-cli", options);
    return Command.execp(`git push ${origin} ${branch}`, options);
  }

  /**
   * 判断工作区是否干净
   *
   * @static
   * @param {*} [options={} as ExecSyncOptionsWithStringEncoding]
   * @returns {boolean}
   * @memberof Git
   */
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

  /**
   * 设置远程仓库地址
   *
   * @static
   * @param {string} url
   * @param {*} [options={} as ExecSyncOptionsWithStringEncoding]
   * @returns
   * @memberof Git
   */
  public static async setRemoteUrl(
    url: string,
    options = {} as ExecSyncOptionsWithStringEncoding,
  ) {
    if (!url) {
      throw Error("The argument `url` is required.");
    }
    return Command.execp(`git remote add origin ${url}`, options);
  }

  /**
   * 获取远程仓库 URL
   *
   * @static
   * @param {string} [options={ encoding: "utf8" } as ExecSyncOptionsWithStringEncoding]
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static getRemoteUrl(
    options = { encoding: "utf8" } as ExecSyncOptionsWithStringEncoding,
  ): Promise<string> {
    return Command.execp("git remote -v", options).then(
      (stdout) => {
        const res: any[] = stdout
          .split(/[\r\n]/)
          .filter((e) => e && e.includes("origin"))
          .map((e) =>
            e
              .split(/\s/)
              .filter((c) => /(http|git@)/.test(c))
              .pop(),
          );

        return Array.from(new Set(res)).pop() || Promise.reject("");
      },
      () => Promise.reject(""),
    );
  }

  /**
   * 获取仓库名称
   *
   * @static
   * @param {string} [options={ encoding: "utf8" } as ExecSyncOptionsWithStringEncoding]
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static getRepoName(
    options = {
      encoding: "utf8",
      stdio: [null, null, null],
    } as ExecSyncOptionsWithStringEncoding,
  ): Promise<string> {
    return Git.getRemoteUrl(options).then<string>(
      (remoteUrl) => {
        const reg = /(?:\/)(.*?)(?:\.git)?$/;
        if (remoteUrl.match(reg)) {
          return RegExp.$1.split("/").pop() || Promise.reject("");
        } else {
          return Promise.reject("");
        }
      },
      () => Promise.reject(""),
    );
  }
}
