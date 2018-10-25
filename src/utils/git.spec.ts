import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { readdirSync } from "fs";
import { Command } from "./command";
import { Git } from "./git";

describe("[utils] Git", () => {
  test("[ERROR] clone", () => {
    expect(() => Git.clone()).toThrowError(/required/);
  });

  test("[SUCCESS] clone", () => {
    expect(
      (async () => {
        const TEMP_DIR = "temp";
        Command.exec(`rm -rf ${TEMP_DIR}`);
        await Git.clone({
          dist: TEMP_DIR,
          url: "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git",
        });
        return readdirSync(TEMP_DIR, "utf8");
      })(),
    ).resolves.toContain("package.json");
  });

  test("[FAILED] clone", () => {
    expect(
      (async () => {
        const TEMP_DIR = "temp";
        await Git.clone({
          dist: TEMP_DIR,
          url: "",
        });
      })(),
    ).rejects.toBeTruthy();
  });

  test("[ERROR] info", () => {
    expect(() => Git.info("", "")).toThrowError();
    expect(() => Git.info("test", "")).toThrowError();
    expect(() => Git.info("", "test")).toThrowError();
  });

  test("[SUCCESS] info", () => {
    expect(Git.info("ftoy-cli", "test")).resolves.toHaveProperty("id");
  });

  test("[FAILED] info", () => {
    expect(Git.info("ftoy-cli", "test")).rejects.toBeTruthy();
  });

  test("[ERROR] commit", () => {
    expect(
      Git.commit("", {
        encoding: "utf8",
        cwd: "temp",
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  test("[EMPTY] commit", () => {
    expect(
      (async () => {
        const options: ExecSyncOptionsWithStringEncoding = {
          encoding: "utf8",
          cwd: "temp",
        };
        Command.exec("git add .", options);
        Command.exec("git reset --hard", options);
        return Git.commit("Run for jest. [EMPTY]", options);
      })(),
    ).resolves.toBe(false);
  });

  test("[SUCCESS] commit", () => {
    expect(
      (async () => {
        const TEMP_DIR = "temp";

        await Command.execp(`echo jest > jest.${Date.now()}.md`, {
          encoding: "utf8",
          cwd: TEMP_DIR,
        });
        return Git.commit("Run for jest. [SUCCESS]", {
          encoding: "utf8",
          cwd: TEMP_DIR,
        });
      })(),
    ).resolves.toBe(true);
  });

  test("[SUCCESS] getRepoName", () => {
    expect(Git.getRepoName()).resolves.toBe("ftoy-cli");
  });
});
