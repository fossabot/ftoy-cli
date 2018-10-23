import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";
import { Git } from "../utils/git";

const debug = Debug("[command] new");

module.exports = {
  aliases: ["n"],
  command: "new",
  describe: "创建新组件项目",
  handler: async (argv) => {
    const { gitName }: any = await prompt({
      message: "新建仓库名",
      name: "gitName",
    });

    const createSpinner = ora("Creating repository...").start();
    const { http_url_to_repo }: any = await Git.create(gitName).catch((msg) => {
      createSpinner.fail("Create repository failed.");
      debug(msg);
      process.exit();
    });
    createSpinner.succeed("Create repository successfully.");

    const cloneSpinner = ora("Cloning repository...").start();
    await Git.clone({
      dist: gitName,
      url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
    }).catch((msg) => {
      cloneSpinner.fail("Clone repository failed.");
      debug(msg);
      process.exit();
    });
    cloneSpinner.succeed("Clone repository successfully.");

    const remoteSpinner = ora("Updating remote information...").start();
    await Git.setRemoteUrl(http_url_to_repo, {
      encoding: "utf8",
      cwd: gitName,
    }).catch((msg) => {
      remoteSpinner.fail("Update remote information failed.");
      debug(msg);
      process.exit();
    });
    remoteSpinner.succeed("Update remote information succefully.");

    const pushSpinner = ora("Pushing code...").start();
    await Git.push({
      options: {
        encoding: "utf8",
        cwd: gitName,
      },
    }).catch((msg) => {
      pushSpinner.fail("Push code failed.");
      debug(msg);
      process.exit();
    });
    pushSpinner.succeed("Push code succefully.");
  },
} as CommandModule;
