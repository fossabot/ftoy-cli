"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Directory {
    static exist(dir, name) {
        if (!name) {
            throw Error("The argument `command` is required.");
        }
        else {
            const files = fs_1.readdirSync(dir, { encoding: "utf8" });
            return files.includes(name);
        }
    }
}
exports.Directory = Directory;
//# sourceMappingURL=dir.js.map