import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";
import { Directory } from "../utils/directory";
import { Git } from "../utils/git";

const debug = Debug("[command] new");

module.exports = {
  aliases: ["n"],
  command: "new",
  describe: "创建新组件项目",
  handler: async (argv) => {
    const namespace = "ftoy-cli";
    const spinner = ora();
    const { gitName = "" }: any = await prompt({
      message: "新建仓库名",
      name: "gitName",
    });
    const options = {
      encoding: "utf8" as BufferEncoding,
      cwd: gitName as string,
    };
    try {
      spinner.start("Creating repository...");
      const { ssh_url_to_repo }: any = await Git.create(gitName);

      spinner.start("Cloning repository...");
      if (Directory.exist(gitName, { type: "dir" })) {
        spinner.stop();
        const { canDelete }: any = await prompt({
          type: "list",
          message: `当前目录下文件夹 ${gitName} 已存在，是否删除该文件夹？`,
          name: "canDelete",
          choices: [
            {
              value: true,
              name: "确定删除",
            },
            {
              value: false,
              name: "考虑一下（将终止本次创建操作）",
            },
          ],
        });
        if (canDelete) {
          Command.exec(`rm -rf ${gitName}`);
        } else {
          throw Error(`请删除文件夹 ${gitName} 后重新执行该命令`);
        }
      }
      await Git.clone({
        dist: gitName,
        url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
      });

      spinner.start("Updating information...");
      await Git.init(options);
      await Git.setRemoteUrl(ssh_url_to_repo, options);

      spinner.start("Pushing code...");
      await Git.push({ options });

      spinner.succeed("Init successfully!");
    } catch (msg) {
      spinner.fail().stopAndPersist({ text: msg, symbol: "✖" });
      debug(msg);
      process.exit();
    }
  },
} as CommandModule;
