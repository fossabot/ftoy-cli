import * as Debug from "debug";
import { prompt } from "inquirer";
import * as ora from "ora";
import { CommandModule } from "yargs";
import { Command } from "../utils/command";
import Git from "../utils/git";

const debug = Debug("[command] new");

module.exports = {
  aliases: ["n"],
  command: "new",
  describe: "创建新组件项目",
  handler: async () => {
    const { gitName }: any = await prompt({
      message: "新建仓库名",
      name: "gitName",
    });

    const createSpinner = ora("Creating repository...").start();
    const remoteRep = await Git.create(gitName).catch((msg) => {
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

    Command.execp(`git remote `);
  },
} as CommandModule;
