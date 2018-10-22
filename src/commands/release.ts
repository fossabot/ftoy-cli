import { prompt } from "inquirer";
import { CommandModule } from "yargs";

module.exports = {
  aliases: ["rl"],
  command: "release",
  describe: "发布组件",
  handler: () => {
    // TODO 复用 release.js，解耦
  },
} as CommandModule;
