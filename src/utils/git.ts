import Axios, { AxiosError, AxiosResponse } from "axios";
import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { NAMESPACE_ID } from "../const";
import { Command } from "./command";
import { Token } from "./token";

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
    options = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): void {
    Command.execSync("git init", options);
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
  public static clone(
    { url = "", dist = "", branch = "master" } = {} as {
      url: string;
      dist?: string;
      branch?: string;
    },
  ): Promise<string> {
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
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static async create(
    name: string,
    {
      namespace_id = NAMESPACE_ID,
      description = "Create via ftoy-cli.",
      visibility = "internal" as "private" | "internal" | "public",
    } = {},
  ): Promise<string> {
    const token = await Token.getValue();
    return Axios.post(
      "http://igit.58corp.com/api/v4/projects",
      {
        name,
        namespace_id,
        visibility,
        description,
      },
      {
        headers: {
          "Private-Token": token,
        },
      },
    )
      .then((res: AxiosResponse) => res.data)
      .catch((err: AxiosError) => Promise.reject(err.message));
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
  public static async info(
    namespace: string,
    name: string,
  ): Promise<string | object> {
    const project = [namespace, name].map((e) => encodeURIComponent(e)).join("/");
    return Axios.get(`http://igit.58corp.com/api/v4/projects/${project}`, {
      headers: {
        "Private-Token": await Token.getValue(),
      },
    }).then((res: AxiosResponse) => res.data);
  }

  /**
   * 提交代码
   *
   * @static
   * @param {string} [message=""] 提交信息
   * @param {*} [options = {
   *   stdio: [null, null, null],
   *   encoding: "utf8",
   * } as ExecSyncOptionsWithStringEncoding] 执行参数
   * @returns {Promise<boolean>}
   * @memberof Git
   */
  public static commit(
    message = "",
    options = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): void {
    if (!Git.isClean(options)) {
      Command.execSync(`git add .`, options);
      Command.execSync(`git commit -a -m "${message}"`, options);
    }
  }

  /**
   * 推送远程代码
   *
   * @static
   * @param {*} [{
   *   origin = "origin",
   *   branch = "master",
   *   options = {
   *     stdio: [null, null, null],
   *     encoding: "utf8",
   *   } as ExecSyncOptionsWithStringEncoding,
   * } = {}]
   * @returns {Promise<string>}
   * @memberof Git
   */
  public static push({
    origin = "origin",
    branch = "master",
    options = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  } = {}): void {
    Git.commit("Commit via ftoy-cli", options);
    Command.execSync(`git push ${origin} ${branch}`, options);
  }

  /**
   * 判断工作区是否干净
   *
   * @static
   * @param {*} [options = {
   *  stdio: [null, null, null],
   *  encoding: "utf8",
   * } as ExecSyncOptionsWithStringEncoding]
   * @returns {boolean}
   * @memberof Git
   */
  public static isClean(
    options = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): boolean {
    const res = Command.execSync("git status -s", options);
    return !res;
  }

  /**
   * 设置远程仓库地址
   *
   * @static
   * @param {string} url
   * @param {*} [options = {
   *  stdio: [null, null, null],
   *  encoding: "utf8",
   * } as ExecSyncOptionsWithStringEncoding]
   * @returns
   * @memberof Git
   */
  public static async setRemoteUrl(
    url: string,
    options = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): Promise<void> {
    if (await Git.getRemoteUrl(options).catch(() => "")) {
      Command.execSync(`git remote set-url origin ${url}`, options);
    } else {
      Command.execSync(`git remote add origin ${url}`, options);
    }
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
    options = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
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

  public static get username() {
    const res = Command.execSync("git config --get user.name");
    return res.trim();
  }
}
