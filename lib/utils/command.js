"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
class Command {
    static has(command, { testArg = "--version" } = {}) {
        if (!command) {
            throw Error("The argument `command` is required.");
        }
        else {
            try {
                child_process_1.execSync(`${command} ${testArg}`, { encoding: "utf8" });
                return true;
            }
            catch (e) {
                return false;
            }
        }
    }
    static exec(command, config = {}) {
        if (!command) {
            throw Error("The argument `command` is required.");
        }
        else {
            return child_process_1.execSync(command, config);
        }
    }
    static execp(command, config = {}) {
        if (!command) {
            throw Error("The argument `command` is required.");
        }
        else {
            return new Promise((resovle, reject) => {
                try {
                    const res = Command.exec(command, config);
                    resovle(res);
                }
                catch (err) {
                    reject(err.message);
                }
            });
        }
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map