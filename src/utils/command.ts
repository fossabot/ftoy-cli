import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";

export class Command {
  public static execSync(
    command: string,
    config = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): string {
    if (!command) {
      throw Error("The argument `command` is required.");
    } else {
      return execSync(command, config);
    }
  }

  public static execp(
    command: string,
    config = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): Promise<string> {
    if (!command) {
      throw Error("The argument `command` is required.");
    } else {
      return new Promise((resovle, reject) => {
        try {
          const res = Command.execSync(command, config);
          resovle(res);
        } catch (err) {
          reject(err.message);
        }
      });
    }
  }
}
