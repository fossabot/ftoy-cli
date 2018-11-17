import { platform } from "os";
import { Command } from "./command";

export class Browser {
  public static open(url: string): void {
    switch (platform()) {
      case "win32":
        Command.exec(`start '${url}'`);
        break;
      default:
        Command.exec(`open '${url}'`);
        break;
    }
  }
}
