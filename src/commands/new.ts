import { ExecSyncOptionsWithStringEncoding } from "child_process";
import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
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
    const { gitName = "" }: any = await prompt({
      message: "请输入项目名称：",
      name: "gitName",
      validate: async (name) => {
        if (!name) {
          return "项目名称不能为空哦";
        } else {
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
    const options: ExecSyncOptionsWithStringEncoding = {
      encoding: "utf8" as BufferEncoding,
      cwd: gitName as string,
      stdio: [null, null, null],
    };
    try {
      spinner.start("正在创建仓库...");
      const { ssh_url_to_repo }: any = await Git.create(gitName);

      spinner.start("正在克隆仓库...");
      if (!Directory.exist(TMP_PROJECT_DIR)) {
        cacheProjects();
      }
      Directory.copy(TMP_PROJECT_DIR, gitName);

      spinner.start("正在初始化信息...");
      Git.init(options);
      Git.commit("Commit via ftoy-cli", options);
      if (ssh_url_to_repo) {
        spinner.start("正在推送代码...");
        Git.setRemoteUrl(ssh_url_to_repo, options);
        Git.push({ options });
      }

      spinner.succeed(`成功创建项目 ${gitName}\n`);

      spinner.stopAndPersist({
        symbol: "😎",
        text: "开始你的组件开发吧！\n",
      });
      const commands = [`cd ${gitName}`, `npm i`, `ftoy generate`];
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
