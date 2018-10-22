"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
class Command {
    static has(cmd, { testArg = "--version" } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cmd) {
                throw Error("The argument `cmd` is required.");
            }
            else {
                return yield util_1.promisify(child_process_1.exec)(`${cmd} ${testArg}`, { encoding: "utf8" })
                    .then(() => true)
                    .catch(() => false);
            }
        });
    }
    static execp(cmd, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cmd) {
                throw Error("The argument `cmd` is required.");
            }
            else {
                return yield util_1.promisify(child_process_1.exec)(cmd, Object.assign({ encoding: "utf8" }, config));
            }
        });
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map