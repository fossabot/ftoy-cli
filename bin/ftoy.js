#!/usr/bin/env node

"use strict";

try {
    process.title = Array.from(process.argv).join(" ");
} catch (_) {
    process.title = "ftoy-cli";
}

const [v1, v2, v3] = process.version.substr(1).split(".");

if (Number(v1) < 8) {
    process.stderr.write(
        `当前 Node.js 版本 ${process.version} 不受支持, 请升级至 >=8.0 \n`
    );
    process.exit();
} else {
    require("../lib/register");
}