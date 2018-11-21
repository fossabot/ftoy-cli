import { CommandModule } from "yargs";
import { release } from "../process/release.process";

module.exports = {
  aliases: ["t"],
  command: "test",
  describe: "发布组件（测试）",
  handler: () => release("test"),
} as CommandModule;
