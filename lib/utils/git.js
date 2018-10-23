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
const command_1 = require("./command");
class Git {
    static get isExisted() {
        return command_1.Command.has("git");
    }
    static clone({ url = "", dist = "", branch = "master" } = {}) {
        if (!url) {
            throw Error("The argument `url` is required.");
        }
        if (!Git.isExisted) {
            throw Error("请确保 Git 已正确安装。了解更多信息前往 https://git-scm.com/");
        }
        else {
            return command_1.Command.execp(`git clone --depth 1 --single-branch -b ${branch} ${url} ${dist}`, {
                encoding: "utf8",
                stdio: [null, null, null],
            });
        }
    }
    static create(name, { namespace_id = 14777, visibility = "internal" } = {}) {
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
                .catch((err) => Promise.reject(err.message));
        }
    }
    static commit(message = "", options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message) {
                throw Error("The argument `message` is required.");
            }
            if (!Git.isClean(options)) {
                yield command_1.Command.execp(`git add .`, options);
                yield command_1.Command.execp(`git commit -a -m "${message}"`, options);
                return true;
            }
            else {
                return false;
            }
        });
    }
    static push({ origin = "origin", branch = "master", options = {}, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Git.commit("Auto commit by ftoy-cli.", options);
            return command_1.Command.execp(`git push ${origin} ${branch}`, options);
        });
    }
    static isClean(options = {}) {
        try {
            console.log(command_1.Command.exec("git status -s", options));
            return !!command_1.Command.exec("git status -s", options).split(/\s/).join();
        }
        catch (e) {
            return true;
        }
    }
    static setRemoteUrl(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!url) {
                throw Error("The argument `url` is required.");
            }
            return command_1.Command.execp(`git remote set-url origin ${url}`, options);
        });
    }
}
exports.Git = Git;
Git.commit("Run for jest.", {
    encoding: "utf8",
    cwd: "temp",
});
//# sourceMappingURL=git.js.map