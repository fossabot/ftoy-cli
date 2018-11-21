import { execSync, ExecSyncOptionsWithStringEncoding } from "child_process";

export class Command {
  public static execSync(
    command: string,
    config = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): string {
    return "";
  }

  public static execp(
    command: string,
    config = {
      stdio: [null, null, null],
      encoding: "utf8",
    } as ExecSyncOptionsWithStringEncoding,
  ): Promise<string> {
    return Promise.resolve("");
  }
}
