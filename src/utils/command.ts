import {
  execSync,
  ExecSyncOptions,
  ExecSyncOptionsWithStringEncoding,
} from "child_process";

export class Command {
  public static has(command: string, { testArg = "--version" } = {}): boolean {
    if (!command) {
      throw Error("The argument `command` is required.");
    } else {
      try {
        execSync(`${command} ${testArg}`, { encoding: "utf8" });
        return true;
      } catch (e) {
        return false;
      }
    }
  }

  public static exec(
    command: string,
    config = {} as ExecSyncOptionsWithStringEncoding,
  ): string {
    if (!command) {
      throw Error("The argument `command` is required.");
    } else {
      return execSync(command, config);
    }
  }

  public static execp(
    command: string,
    config = {} as ExecSyncOptionsWithStringEncoding,
  ): Promise<string> {
    if (!command) {
      throw Error("The argument `command` is required.");
    } else {
      return new Promise((resovle, reject) => {
        try {
          const res = Command.exec(command, config);
          resovle(res);
        } catch (err) {
          reject(err.message);
        }
      });
    }
  }
}
