import { ExecSyncOptionsWithStringEncoding } from "child_process";
import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";

const debug = Debug("[Command] new");

module.exports = {
  aliases: ["n"],
  command: "new",
  describe: "创建新组件项目",
  handler: async (argv) => {
    const namespace = "ftoy-cli";
    const spinner = ora();
    const { gitName = "" }: any = await prompt({
      message: "请输入项目名称",
      name: "gitName",
      validate: (name) => !!name || "项目名称不能为空哦",
    });
    const options: ExecSyncOptionsWithStringEncoding = {
      encoding: "utf8" as BufferEncoding,
      cwd: gitName as string,
      stdio: [null, null, null],
    };
    let sshUrl = "";
    try {
      spinner.start("正在检查仓库...");
      const canCreate: boolean = await Git.info(namespace, gitName).then(
        () => false,
        () => true,
      );

      if (!canCreate) {
        spinner.stop();
        const { go }: any = await prompt({
          type: "list",
          message: `远程仓库中已存在 ${gitName} 项目，是否继续？`,
          name: "go",
          choices: [
            {
              value: true,
              name: "跳过创建",
            },
            {
              value: false,
              name: "停止操作",
            },
          ],
        });
        if (!go) {
          process.exit();
        }
      } else {
        spinner.start("正在创建仓库...");
        const { ssh_url_to_repo }: any = await Git.create(gitName);
        sshUrl = ssh_url_to_repo;
      }

      spinner.start("正在克隆仓库...");
      if (Directory.exist(gitName, { type: "dir" })) {
        spinner.stop();
        const { canDelete }: any = await prompt({
          type: "list",
          message: `当前目录下已存在 ${gitName} 文件夹，是否删除？`,
          name: "canDelete",
          choices: [
            {
              value: true,
              name: "确定删除",
            },
            {
              value: false,
              name: "停止操作",
            },
          ],
        });
        if (canDelete) {
          Command.exec(`rm -rf ${gitName}`);
        } else {
          throw new Error(`请删除文件夹 ${gitName} 后重新执行该命令`);
        }
      }
      await Git.clone({
        dist: gitName,
        url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
      });

      spinner.start("正在初始化信息...");
      await Git.init(options);
      await Git.commit("Commit via ftoy-cli", options);
      if (sshUrl) {
        spinner.start("正在推送代码...");
        await Git.setRemoteUrl(sshUrl, options);
        await Git.push({ options });
      }

      spinner.succeed(`项目创建成功！`);
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg, symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
