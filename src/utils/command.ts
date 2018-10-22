import { exec, ExecOptions } from "child_process";
import { promisify } from "util";

export class Command {
  public static async has(
    cmd: string,
    { testArg = "--version" } = {},
  ): Promise<boolean> {
    if (!cmd) {
      throw Error("The argument `cmd` is required.");
    } else {
      return await promisify(exec)(`${cmd} ${testArg}`, { encoding: "utf8" })
        .then(() => true)
        .catch(() => false);
    }
  }

  public static async execp(cmd: string, config: ExecOptions = {}) {
    if (!cmd) {
      throw Error("The argument `cmd` is required.");
    } else {
      return await promisify(exec)(
        cmd,
        Object.assign({ encoding: "utf8" }, config),
      );
    }
  }
}
