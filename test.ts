import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { Command } from "./src/utils/command";
import { Git } from "./src/utils/git";
(async () => {
  const options: ExecSyncOptionsWithStringEncoding = {
    encoding: "utf8",
    cwd: "temp",
  };
  Command.exec("git add .", options);
  Command.exec("git reset --hard", options);
  return await Git.commit("Run for jest. [EMPTY]", options);
})();
