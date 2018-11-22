import { ExecSyncOptionsWithStringEncoding } from "child_process";
import * as Debug from "debug";
import { readFileSync, writeFileSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { resolve } from "path";
import { pwd } from "shelljs";
import { CommandModule } from "yargs";
import { TMP_PROJECT_DIR } from "../const";
import { cacheProjects } from "../utils/cache";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";

const debug = Debug("[Command] new");

module.exports = {
  aliases: ["n"],
  command: "new",
  describe: "创建项目",
  handler: async () => {
    const namespace = "ftoy-cli";
    const spinner = ora();
    try {
      const prefix = "toy-components-";
      let { projectName = "" as string }: any = await prompt({
        message: "请输入项目名称：",
        name: "projectName",
        suffix: prefix,
        validate: async (name) => {
          if (!name) {
            return "项目名称不能为空哦";
          } else {
            name = prefix + name;
            const canCreate: boolean = await Git.info(namespace, name).then(
              () => false,
              () => true,
            );
            if (!canCreate) {
              return `远程仓库中已存在 ${name} 项目`;
            } else if (Directory.exist(name, "dir")) {
              return `当前目录 ${pwd()} 下已存在 ${name} 文件夹`;
            } else {
              return true;
            }
          }
        },
      });
      projectName = prefix + projectName;

      const { description = "" }: any = await prompt({
        message: "请输入项目概述：",
        name: "description",
        validate: async (name) => !!name || "项目概述不能为空哦",
      });

      const options: ExecSyncOptionsWithStringEncoding = {
        encoding: "utf8",
        cwd: projectName,
        stdio: [null, null, null],
      };
      spinner.start("正在创建仓库...");
      const { ssh_url_to_repo }: any = await Git.create(projectName, {
        description,
      });

      spinner.start("正在克隆仓库...");
      if (!Directory.exist(TMP_PROJECT_DIR)) {
        await cacheProjects();
      }
      Directory.copy(TMP_PROJECT_DIR, projectName);

      spinner.start("正在更新信息...");
      const configPath = resolve(projectName, "package.json");
      const config = JSON.parse(readFileSync(configPath, "utf8"));
      Object.assign(config, {
        name: projectName,
        description,
        repository: {
          type: "git",
          url: ssh_url_to_repo || "",
        },
      });
      writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");

      spinner.start("正在初始化仓库...");
      Git.init(options);
      Git.commit("Commit via ftoy-cli", options);
      if (ssh_url_to_repo) {
        spinner.start("正在推送代码...");
        await Git.setRemoteUrl(ssh_url_to_repo, options);
        Git.push({ options });
      }

      spinner.succeed(`成功创建项目 ${projectName}\n`);

      spinner.stopAndPersist({
        symbol: "😎",
        text: "开始你的组件开发吧！\n",
      });
      const commands = [`cd ${projectName}`, `npm i`, `ftoy generate`];
      commands.forEach((text) => {
        spinner.stopAndPersist({
          symbol: "$",
          text,
        });
      });
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
