import * as Debug from "debug";
import { CommandModule } from "yargs";
import { release } from "../process/release.process";

const debug = Debug("[Command] release");

module.exports = {
  aliases: ["rl"],
  command: "release",
  describe: "发布组件",
  handler: () => release("online", debug),
} as CommandModule;
