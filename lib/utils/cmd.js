"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
class Command {
    check(cmd, { testArg = "--version" } = {}) {
        if (!cmd) {
            throw Error("The argument `cmd` is required.");
        }
        else {
            return util_1.promisify(child_process_1.exec)(`${cmd} ${testArg}`, { encoding: "utf8" });
        }
    }
}
exports.default = Command;
