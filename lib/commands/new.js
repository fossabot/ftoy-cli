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
const debug = Debug("[Command] new");
module.exports = {
    aliases: ["n"],
    command: "new",
    describe: "创建新组件项目",
    handler: (argv) => __awaiter(this, void 0, void 0, function* () {
        const namespace = "ftoy-cli";
        const spinner = ora();
        const { gitName = "" } = yield inquirer_1.prompt({
            message: "请输入项目名称",
            name: "gitName",
            validate: (name) => !!name || "项目名称不能为空哦",
        });
        const options = {
            encoding: "utf8",
            cwd: gitName,
            stdio: [null, null, null],
        };
        let sshUrl = "";
        try {
            spinner.start("正在检查仓库...");
            const canCreate = yield git_1.Git.info(namespace, gitName).then(() => false, () => true);
            if (!canCreate) {
                spinner.stop();
                const { go } = yield inquirer_1.prompt({
                    type: "list",
                    message: `远程仓库中已存在 ${gitName} 项目，是否继续？`,
                    name: "go",
                    choices: [
                        {
                            value: true,
                            name: "跳过创建",
                        },
                        {
                            value: false,
                            name: "停止操作",
                        },
                    ],
                });
                if (!go) {
                    process.exit();
                }
            }
            else {
                spinner.start("正在创建仓库...");
                const { ssh_url_to_repo } = yield git_1.Git.create(gitName);
                sshUrl = ssh_url_to_repo;
            }
            spinner.start("正在克隆仓库...");
            if (directory_1.Directory.exist(gitName, { type: "dir" })) {
                spinner.stop();
                const { canDelete } = yield inquirer_1.prompt({
                    type: "list",
                    message: `当前目录下已存在 ${gitName} 文件夹，是否删除？`,
                    name: "canDelete",
                    choices: [
                        {
                            value: true,
                            name: "确定删除",
                        },
                        {
                            value: false,
                            name: "停止操作",
                        },
                    ],
                });
                if (canDelete) {
                    command_1.Command.exec(`rm -rf ${gitName}`);
                }
                else {
                    throw new Error(`请删除文件夹 ${gitName} 后重新执行该命令`);
                }
            }
            yield git_1.Git.clone({
                dist: gitName,
                url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
            });
            spinner.start("正在初始化信息...");
            yield git_1.Git.init(options);
            yield git_1.Git.commit("Commit via ftoy-cli", options);
            if (sshUrl) {
                spinner.start("正在推送代码...");
                yield git_1.Git.setRemoteUrl(sshUrl, options);
                yield git_1.Git.push({ options });
            }
            spinner.succeed(`项目创建成功！`);
        }
        catch (msg) {
            spinner.fail().stopAndPersist({ text: msg, symbol: "✖" });
            debug(msg);
            process.exit();
        }
    }),
};
//# sourceMappingURL=new.js.map