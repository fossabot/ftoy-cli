import { Command } from "../utils/command";
import { Project } from "../utils/project";

Command.execSync(`npm run ${Project.buildWatchScript}`, {
  stdio: "inherit",
  encoding: "utf8",
});
