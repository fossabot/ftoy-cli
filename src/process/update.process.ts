import Axios, { AxiosError, AxiosResponse } from "axios";
import { writeFileSync } from "fs";
import { prompt } from "inquirer";
import * as ora from "ora";
import { resolve } from "path";
import { CHECK_UPDATE_CACHE_FILE, CHECK_VERSION_API } from "../const";
import { Command } from "../utils/command";
import { NodePackageManager } from "../utils/npm";
import { Version } from "../utils/version";

const { version }: any = require(resolve(__dirname, "../../package.json"));

export async function checkUpdate() {
  const spinner = ora();
  spinner.start(`正在检查更新...`);
  const { data: latestVersion } = await Axios.get(CHECK_VERSION_API)
    .then((res: AxiosResponse) => res.data)
    .catch((err: AxiosError) => {
      spinner.fail(`检查更新失败`);
      return Promise.reject(err.message);
    });
  if (
    latestVersion &&
    Version.compare(latestVersion.split("."), version.split(".")).result === 1
  ) {
    spinner.info(`发现新版本 v${latestVersion}`);
    const { manager }: any = await prompt({
      message: "请选择使用以下一种包管理器进行更新",
      name: "manager",
      type: "list",
      choices: NodePackageManager.managersCanUse.map((e) => ({
        name: e.name,
        value: e,
      })),
      validate: async (choice) => choice.length > 0 || "请选择你想用的包管理器",
    });
    Command.execSync(`${manager.name} ${manager.global} ${manager.install} ftoy-cli`, {
      stdio: [0, 1, 2],
      encoding: "utf8",
    });
    spinner.succeed(`通过 ${manager.name} 更新完成`);

    process.exit();
  } else {
    writeFileSync(CHECK_UPDATE_CACHE_FILE, Date.now(), {
      encoding: "UTF-8",
    });
    spinner.info("已是最新版本");
  }
}
