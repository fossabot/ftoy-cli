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
const directory_1 = require("../utils/directory");
const git_1 = require("../utils/git");
const debug = Debug("[command] new");
module.exports = {
    aliases: ["n"],
    command: "new",
    describe: "创建新组件项目",
    handler: (argv) => __awaiter(this, void 0, void 0, function* () {
        const namespace = "ftoy-cli";
        const spinner = ora();
        const { gitName = "" } = yield inquirer_1.prompt({
            message: "新建仓库名",
            name: "gitName",
        });
        const options = {
            encoding: "utf8",
            cwd: gitName,
        };
        try {
            spinner.start("Creating repository...");
            const { ssh_url_to_repo } = yield git_1.Git.create(gitName);
            spinner.start("Cloning repository...");
            if (directory_1.Directory.exist(gitName, { type: "dir" })) {
                spinner.stop();
                const { canDelete } = yield inquirer_1.prompt({
                    type: "list",
                    message: `当前目录下文件夹 ${gitName} 已存在，是否删除该文件夹？`,
                    name: "canDelete",
                    choices: [
                        {
                            value: true,
                            name: "确定删除",
                        },
                        {
                            value: false,
                            name: "考虑一下（将终止本次创建操作）",
                        },
                    ],
                });
                if (canDelete) {
                    command_1.Command.exec(`rm -rf ${gitName}`);
                }
                else {
                    throw Error(`请删除文件夹 ${gitName} 后重新执行该命令`);
                }
            }
            yield git_1.Git.clone({
                dist: gitName,
                url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
            });
            spinner.start("Updating information...");
            yield git_1.Git.init(options);
            yield git_1.Git.setRemoteUrl(ssh_url_to_repo, options);
            spinner.start("Pushing code...");
            yield git_1.Git.push({ options });
            spinner.succeed("Init successfully!");
        }
        catch (msg) {
            spinner.fail().stopAndPersist({ text: msg, symbol: "✖" });
            debug(msg);
            process.exit();
        }
    }),
};
//# sourceMappingURL=new.js.map