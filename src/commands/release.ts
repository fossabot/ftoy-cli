import { CommandModule } from "yargs";
import { release } from "../process/release.process";

module.exports = {
  aliases: ["r"],
  command: "release",
  describe: "发布组件（正式）",
  handler: () => release("online"),
} as CommandModule;
