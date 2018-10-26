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
const fs_1 = require("fs");
const inquirer_1 = require("inquirer");
const ora = require("ora");
const path_1 = require("path");
const git_1 = require("../utils/git");
const debug = Debug("[Command] release");
module.exports = {
    aliases: ["rl"],
    command: "release",
    describe: "发布组件",
    handler: () => __awaiter(this, void 0, void 0, function* () {
        const spinner = ora();
        try {
            spinner.start("正在获取信息...");
            const remoteUrl = yield git_1.Git.getRemoteUrl().catch(() => Promise.reject("找不到远程地址，请确保当前仓库存在 [origin] 信息。"));
            const repoName = yield git_1.Git.getRepoName().catch(() => Promise.reject("找不到项目名称，请确保当前仓库存在 [origin] 信息。"));
            const componentDir = path_1.resolve("src", "components");
            const allComponents = fs_1.readdirSync(componentDir)
                .filter((e) => fs_1.statSync(path_1.resolve(componentDir, e)).isDirectory())
                .map((component) => path_1.resolve(componentDir, component, "config.js"))
                .map((configJs) => require(configJs))
                .map((config) => {
                const versionFixed = config.version || "1.0.0";
                return Object.assign(config, {
                    _id: config.name,
                    version: versionFixed,
                    gitname: repoName,
                    regname: config.name + versionFixed.split(".").join("-"),
                    giturl: remoteUrl,
                    path: ["src", "components", config.name].join("/"),
                    attributes: config.props.attributes.default(),
                });
            });
            if (!allComponents || !allComponents.length) {
                spinner.info("当前项目中组件列表为空，请开发相应组件进行发布");
                process.exit();
            }
            spinner.stop();
            const { selectedComponents } = yield inquirer_1.prompt({
                type: "checkbox",
                name: "selectedComponents",
                message: "请选择你要发布的组件",
                choices: allComponents.map((component) => ({
                    name: `${component.name} v${component.version}`,
                    value: component,
                })),
                validate: (e) => e.length >= 1 || "至少选择一个组件",
            });
            spinner.start("正在发布组件...");
            const result = Promise.all(selectedComponents.map((selectedComponent) => __awaiter(this, void 0, void 0, function* () {
            })));
        }
        catch (msg) {
            spinner.fail().stopAndPersist({ text: msg || "出现错误", symbol: "✖" });
            debug(msg);
            process.exit();
        }
    }),
};
//# sourceMappingURL=release.js.map