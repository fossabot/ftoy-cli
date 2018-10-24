"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class Directory {
    static exist(name, { dir = ".", type = "all" } = {}) {
        if (!name) {
            throw Error("The argument `name` is required.");
        }
        else {
            let files = fs_1.readdirSync(dir, { encoding: "utf8" });
            switch (type) {
                case "file":
                    files = files.filter((file) => fs_1.statSync(file).isFile());
                    break;
                case "dir":
                    files = files.filter((file) => fs_1.statSync(file).isDirectory());
                    break;
            }
            return files.includes(name);
        }
    }
}
exports.Directory = Directory;
//# sourceMappingURL=directory.js.map