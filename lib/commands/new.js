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
const command_1 = require("../utils/command");
const git_1 = require("../utils/git");
const debug = Debug("[command] new");
module.exports = {
    aliases: ["n"],
    command: "new",
    describe: "创建新组件项目",
    handler: () => __awaiter(this, void 0, void 0, function* () {
        const { gitName } = yield inquirer_1.prompt({
            message: "新建仓库名",
            name: "gitName",
        });
        const createSpinner = ora("Creating repository...").start();
        const remoteRep = yield git_1.default.create(gitName).catch((msg) => {
            createSpinner.fail("Create repository failed.");
            debug(msg);
            process.exit();
        });
        createSpinner.succeed("Create repository successfully.");
        const cloneSpinner = ora("Cloning repository...").start();
        yield git_1.default.clone({
            dist: gitName,
            url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
        }).catch((msg) => {
            cloneSpinner.fail("Clone repository failed.");
            debug(msg);
            process.exit();
        });
        cloneSpinner.succeed("Clone repository successfully.");
        command_1.Command.execp(`git remote `);
    }),
};
//# sourceMappingURL=new.js.map