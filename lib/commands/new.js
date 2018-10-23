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
const Debug = require("debug");
const inquirer_1 = require("inquirer");
const ora = require("ora");
const git_1 = require("../utils/git");
const debug = Debug("[command] new");
module.exports = {
    aliases: ["n"],
    command: "new",
    describe: "创建新组件项目",
    handler: (argv) => __awaiter(this, void 0, void 0, function* () {
        const { gitName } = yield inquirer_1.prompt({
            message: "新建仓库名",
            name: "gitName",
        });
        const createSpinner = ora("Creating repository...").start();
        const { http_url_to_repo } = yield git_1.Git.create(gitName).catch((msg) => {
            createSpinner.fail("Create repository failed.");
            debug(msg);
            process.exit();
        });
        createSpinner.succeed("Create repository successfully.");
        const cloneSpinner = ora("Cloning repository...").start();
        yield git_1.Git.clone({
            dist: gitName,
            url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
        }).catch((msg) => {
            cloneSpinner.fail("Clone repository failed.");
            debug(msg);
            process.exit();
        });
        cloneSpinner.succeed("Clone repository successfully.");
        const remoteSpinner = ora("Updating remote information...").start();
        yield git_1.Git.setRemoteUrl(http_url_to_repo, {
            encoding: "utf8",
            cwd: gitName,
        }).catch((msg) => {
            remoteSpinner.fail("Update remote information failed.");
            debug(msg);
            process.exit();
        });
        remoteSpinner.succeed("Update remote information succefully.");
        const pushSpinner = ora("Pushing code...").start();
        yield git_1.Git.push({
            options: {
                encoding: "utf8",
                cwd: gitName,
            },
        }).catch((msg) => {
            pushSpinner.fail("Push code failed.");
            debug(msg);
            process.exit();
        });
        pushSpinner.succeed("Push code succefully.");
    }),
};
//# sourceMappingURL=new.js.map