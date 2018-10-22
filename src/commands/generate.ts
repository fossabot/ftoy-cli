import { prompt } from "inquirer";
import { CommandModule } from "yargs";

module.exports = {
  aliases: ["g"],
  command: "generate",
  describe: "发布组件",
  handler: () => {
    // TODO
  },
} as CommandModule;
