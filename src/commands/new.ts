import { ExecSyncOptionsWithStringEncoding } from "child_process";
import * as Debug from "debug";
import { readFileSync, writeFileSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { resolve } from "path";
import { pwd } from "shelljs";
import { CommandModule } from "yargs";
import { NAMESPACE, TMP_PROJECT_DIR } from "../const";
import { cacheProjects } from "../utils/cache";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";

const debug = Debug("[Command] new");
const projectNamePrefix = "toy-components-";

function askForProjectName(): Promise<string> {
  return prompt({
    message: "请输入项目名称：",
    name: "projectName",
    suffix: projectNamePrefix,
    validate: async (name) => {
      if (!name) {
        return "项目名称不能为空哦";
      } else {
        name = projectNamePrefix + name;
        const canCreate: boolean = await Git.info(NAMESPACE, name).then(
          () => false,
          () => true,
        );
        if (!canCreate) {
          return `远程仓库 ${NAMESPACE} 中已存在 ${name} 项目`;
        } else if (Directory.exist(name, "dir")) {
          return `当前目录 ${pwd()} 下已存在 ${name} 文件夹`;
        } else {
          return true;
        }
      }
    },
  }).then(({ projectName }: any) => projectName);
}

function askForDescription(): Promise<string> {
  return prompt({
    message: "请输入项目概述：",
    name: "description",
    default: "Create via ftoy-cli.",
    validate: async (name) => !!name || "项目概述不能为空哦",
  }).then(({ description }: any) => description);
}

function updatePackageInfo({
  projectName,
  ssh_url_to_repo,
  description,
}: {
  projectName: string;
  ssh_url_to_repo: string;
  description: string;
}) {
  const configPath = resolve(projectName, "package.json");
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  Object.assign(config, {
    name: projectName,
    description,
    repository: {
      type: "git",
      url: ssh_url_to_repo || "",
    },
    author: {
      name: Git.username || "",
      email: Git.useremail || "",
    },
  });
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
}

async function initGitInfo({
  spinner,
  options,
  ssh_url_to_repo,
}: {
  spinner: any;
  options: ExecSyncOptionsWithStringEncoding;
  ssh_url_to_repo: string;
}) {
  Git.init(options);
  Git.commit("Commit via ftoy-cli", options);
  if (ssh_url_to_repo) {
    spinner.start("正在推送代码...");
    await Git.setRemoteUrl(ssh_url_to_repo, options);
    await Git.push({ options }).catch(() => {
      spinner.info("推送代码失败，跳过该步骤，请手动推送代码");
    });
  }
}

module.exports = {
  aliases: ["n"],
  command: "new",
  describe: "创建项目",
  handler: async () => {
    const spinner = ora();
    try {
      const projectName = projectNamePrefix + (await askForProjectName());
      const description = await askForDescription();

      const options: ExecSyncOptionsWithStringEncoding = {
        encoding: "utf8",
        cwd: projectName,
        stdio: [null, null, null],
      };

      spinner.start("正在创建仓库...");
      const { ssh_url_to_repo = "" }: any = await Git.create(projectName, {
        description,
      }).catch(() =>
        spinner.info("创建仓库失败，跳过该步骤，请手动创建远程仓库"),
      );

      spinner.start("正在克隆仓库...");
      if (!Directory.exist(TMP_PROJECT_DIR)) {
        await cacheProjects();
      }
      Directory.copy(TMP_PROJECT_DIR, projectName);

      spinner.start("正在更新信息...");
      updatePackageInfo({
        projectName,
        ssh_url_to_repo,
        description,
      });

      spinner.start("正在初始化仓库...");
      await initGitInfo({
        options,
        ssh_url_to_repo,
        spinner,
      });

      spinner.succeed(`成功创建项目 ${projectName}\n`);

      spinner.stopAndPersist({
        symbol: "😎",
        text: "开始你的组件开发吧！\n",
      });

      const commands = [`cd ${projectName}`, `npm i`, `ftoy generate`];
      commands.forEach((text) =>
        spinner.stopAndPersist({
          symbol: "$",
          text,
        }),
      );
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
