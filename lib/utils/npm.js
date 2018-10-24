"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("./command");
class NodePackageManager {
    static get managersCanUse() {
        return NodePackageManager.MANAGERS.filter((cmd) => command_1.Command.has(cmd));
    }
}
NodePackageManager.MANAGERS = ["yarn", "cnpm", "npm"];
exports.NodePackageManager = NodePackageManager;
//# sourceMappingURL=npm.js.map