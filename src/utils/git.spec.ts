import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { readdirSync } from "fs";
import { Command } from "./command";
import { Directory } from "./directory";
import { Git } from "./git";

const TEMP_DIR = "temp";

describe("[utils] Git", () => {
  describe("clone", () => {
    test("[ERROR]", () => {
      expect(() => Git.clone()).toThrowError(/required/);
    });

    test("[SUCCESS]", async () => {
      Directory.rm(TEMP_DIR);
      const action = Git.clone({
        dist: TEMP_DIR,
        url: "https://github.com/ChenShihao/ftoy-cli-test.git",
      });
      expect(action).resolves.toBeDefined();

      const result = readdirSync(TEMP_DIR, "utf8");
      expect(result).toContain("README.md");
    });

    test("[FAILED]", () => {
      Command.exec(`mkdir -p ${TEMP_DIR}`);
      const result = Git.clone({
        dist: TEMP_DIR,
        url: "https://github.com/ChenShihao/ftoy-cli-test.git",
      });
      expect(result).rejects.toBeDefined();
    });
  });

  describe("init", () => {
    test("[SUCCESS]", async () => {
      const result = Git.init({
        cwd: TEMP_DIR,
        encoding: "utf8",
      });
      expect(result).toBe(true);
    });
  });

  describe("info", () => {
    test("[ERROR]", () => {
      expect(() => Git.info("", "")).toThrowError();
      expect(() => Git.info("test", "")).toThrowError();
      expect(() => Git.info("", "test")).toThrowError();
    });

    test("[SUCCESS]", () => {
      const result = Git.info("ftoy-cli", "test");
      expect(result).resolves.toHaveProperty("id");
    });

    test("[FAILED]", () => {
      const result = Git.info("ftoy-cli", "_____");
      expect(result).rejects.toBeTruthy();
    });
  });

  describe("commit", () => {
    test("[ERROR]", () => {
      expect(() => Git.commit("")).toThrowError();
    });

    test("[EMPTY]", () => {
      const options: ExecSyncOptionsWithStringEncoding = {
        encoding: "utf8",
        cwd: TEMP_DIR,
      };
      Command.exec("git add .", options);
      Command.exec("git reset --hard", options);
      const result = Git.commit("[EMPTY]", options);
      expect(result).toBeUndefined();
    });

    test("[SUCCESS]", () => {
      const options: ExecSyncOptionsWithStringEncoding = {
        encoding: "utf8",
        cwd: TEMP_DIR,
      };
      Command.exec(
        `echo "${Date.now().toLocaleString()} \t Jest test." >> README.md`,
        options,
      );
      const result = Git.commit("Commit via Jest", options);
      expect(result).toBeUndefined();
    });
  });

  describe("getRepoName", () => {
    test("[SUCCESS] ", async () => {
      const result = await Git.getRepoName();
      expect(result).toBe("ftoy-cli");
    });

    test("[FAILED]", () => {
      const result = Git.getRepoName({
        cwd: "..",
        encoding: "utf8",
        stdio: [null, null, null],
      });
      expect(result).rejects.toBe("");
    });
  });

  describe("getRemoteUrl", () => {
    test("[SUCCESS]", async () => {
      const result = await Git.getRemoteUrl();
      expect(result).toBe("git@github.com:ChenShihao/ftoy-cli.git");
    });

    test("[FAILED]", () => {
      const result = Git.getRemoteUrl({
        cwd: "..",
        encoding: "utf8",
        stdio: [null, null, null],
      });
      expect(result).rejects.toBe("");
    });
  });
});
