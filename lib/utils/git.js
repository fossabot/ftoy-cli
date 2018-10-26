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
    static init(options = { encoding: "utf8" }) {
        command_1.Command.exec("rm -rf .git", options);
        command_1.Command.exec("git init", options);
        return true;
    }
    static clone({ url = "", dist = "", branch = "master" } = {}) {
        if (!url) {
            throw Error("The argument `url` is required.");
        }
        return command_1.Command.execp(`git clone --depth 1 --single-branch -b ${branch} ${url} ${dist}`, {
            encoding: "utf8",
            stdio: [null, null, null],
        });
    }
    static create(name, { namespace_id = 14777, visibility = "private", } = {}) {
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
    static info(namespace, name) {
        if (!name) {
            throw Error("The argument `name` is required.");
        }
        else if (!namespace) {
            throw Error("The argument `namespace` is required.");
        }
        else {
            const project = encodeURIComponent([namespace, name].join("/"));
            return axios_1.default.get(`http://igit.58corp.com/api/v4/projects/${project}`, {
                headers: {
                    "Private-Token": "qoHG4AJeyv9BGR8wC9VC",
                },
            })
                .then((res) => res.data)
                .catch((err) => Promise.reject(err.message));
        }
    }
    static commit(message = "", options = {}) {
        if (!message) {
            throw Error("The argument `message` is required.");
        }
        if (!Git.isClean(options)) {
            command_1.Command.exec(`git add .`, options);
            command_1.Command.exec(`git commit -a -m "${message}"`, options);
            return true;
        }
        else {
            return false;
        }
    }
    static push({ origin = "origin", branch = "master", options = {}, } = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Git.commit("Commit via ftoy-cli", options);
            return command_1.Command.execp(`git push ${origin} ${branch}`, options);
        });
    }
    static isClean(options = {}) {
        try {
            const res = command_1.Command.exec("git status -s", options);
            return !res;
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
            return command_1.Command.execp(`git remote add origin ${url}`, options);
        });
    }
    static getRemoteUrl(options = { encoding: "utf8" }) {
        return command_1.Command.execp("git remote -v", options).then((stdout) => {
            const res = stdout
                .split(/[\r\n]/)
                .filter((e) => e && e.includes("origin"))
                .map((e) => e
                .split(/\s/)
                .filter((c) => /(http|git@)/.test(c))
                .pop());
            return Array.from(new Set(res)).pop() || Promise.reject("");
        }, () => Promise.reject(""));
    }
    static getRepoName(options = {
        encoding: "utf8",
        stdio: [null, null, null],
    }) {
        return Git.getRemoteUrl(options).then((remoteUrl) => {
            const reg = /(?:\/)(.*?)(?:\.git)?$/;
            if (remoteUrl.match(reg)) {
                return RegExp.$1.split("/").pop() || Promise.reject("");
            }
            else {
                return Promise.reject("");
            }
        }, () => Promise.reject(""));
    }
}
exports.Git = Git;
//# sourceMappingURL=git.js.map