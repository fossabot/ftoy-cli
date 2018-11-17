import { resolve } from "path";
import * as yargs from "yargs";

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

const register = new Register();
register.bootstrap();
