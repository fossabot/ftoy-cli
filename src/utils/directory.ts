import { readdirSync, statSync } from "fs";

export class Directory {
  public static exist(
    name: string,
    { dir = "." as string, type = "all" as "file" | "dir" | "all" } = {},
  ) {
    if (!name) {
      throw Error("The argument `name` is required.");
    } else {
      let files = readdirSync(dir, { encoding: "utf8" });
      switch (type) {
        case "file":
          files = files.filter((file) => statSync(file).isFile());
          break;
        case "dir":
          files = files.filter((file) => statSync(file).isDirectory());
          break;
      }
      return files.includes(name);
    }
  }
}
