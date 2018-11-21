import * as Debug from "debug";
import { resolve } from "path";
import * as yargs from "yargs";
import { checkUpdate } from "./process/update.process";
import { Version } from "./utils/version";

class Register {
  public commandDir: string;

  constructor({ commandDir = resolve(__dirname, "./commands") } = {}) {
    this.commandDir = commandDir;
  }

  public bootstrap() {
    const cli: yargs.Argv = yargs
      .commandDir(this.commandDir)
      .strict()
      .version()
      .help()
      .showHelpOnFail(true)
      .epilogue(
        "了解更多信息，请前往 https://github.com/ChenShihao/ftoy-cli.git",
      );
    Object.assign(cli, {
      $0: "ftoy",
    });
    if (!cli.argv._.length) {
      cli.showHelp();
    }
  }
}
(async () => {
  const register = new Register();
  const debug = Debug("[Register] Bootstrap");

  try {
    if (Version.shouldCheck) {
      await checkUpdate();
    }
  } catch (msg) {
    debug(msg);
  } finally {
    register.bootstrap();
  }
})();
