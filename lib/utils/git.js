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
const axios_1 = require("axios");
const child_process_1 = require("child_process");
const command_1 = require("./command");
class Git {
    static get isExisted() {
        return command_1.Command.has("git");
    }
    static clone({ url = "", dist = "", branch = "master", } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                throw Error("The argument `url` is required.");
            }
            else if (!(yield Git.isExisted)) {
                throw Error("请确保 Git 已正确安装。了解更多信息前往 https://git-scm.com/");
            }
            else {
                return new Promise((resolve, reject) => {
                    const cmd = `git clone --depth 1 --single-branch -b ${branch} ${url} ${dist}`;
                    try {
                        const res = child_process_1.execSync(cmd, {
                            encoding: "utf8",
                            stdio: [null, null, 2],
                        });
                        resolve(res);
                    }
                    catch (err) {
                        reject(err.message);
                    }
                });
            }
        });
    }
    static create(name, { namespace_id = 14777, visibility = "internal" } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name) {
                throw Error("The argument `name` is required.");
            }
            else {
                return axios_1.default.post("http://igit.58corp.com/api/v4/projects", {
                    name,
                    namespace_id,
                    visibility,
                }, {
                    headers: {
                        "Private-Token": "qoHG4AJeyv9BGR8wC9VC",
                    },
                })
                    .then((res) => res.data)
                    .catch((res) => Promise.reject(res));
            }
        });
    }
}
exports.default = Git;
//# sourceMappingURL=git.js.map