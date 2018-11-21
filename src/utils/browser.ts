import { platform } from "os";
import { Command } from "./command";

export class Browser {
  public static open(url: string): void {
    switch (platform()) {
      case "win32":
        Command.execSync(`start '${url}'`);
        break;
      default:
        Command.execSync(`open '${url}'`);
        break;
    }
  }
}
