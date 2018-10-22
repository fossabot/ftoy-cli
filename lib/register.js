"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const yargs = require("yargs");
class Register {
    constructor({ commandDir = path_1.resolve(__dirname, "./commands") } = {}) {
        this.commandDir = commandDir;
    }
    bootstrap() {
        const cli = yargs
            .commandDir(this.commandDir)
            .strict()
            .version()
            .help()
            .showHelpOnFail(false, "可使用 help 选项查看帮助")
            .epilogue("了解更多信息，请前往 https://github.com/ChenShihao/ftoy-cli.git");
        if (!cli.argv._.length) {
            cli.showHelp();
        }
    }
}
const register = new Register();
register.bootstrap();
//# sourceMappingURL=register.js.map