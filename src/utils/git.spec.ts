import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { join, resolve } from "path";
import { Command } from "./command";
import { Directory } from "./directory";
import { Git } from "./git";

const TEMP_DIR = join("temp", "__git__");

describe("[utils] git", () => {
  describe("commit", () => {
    test("[EMPTY]", () => {
      const options: ExecSyncOptionsWithStringEncoding = {
        encoding: "utf8",
        cwd: TEMP_DIR,
      };
      Command.execSync("git init", options);
      Command.execSync("git add .", options);
      Command.execSync("git reset --hard", options);
      expect(Git.commit("[EMPTY]", options)).toBeUndefined();
    });

    test("[SUCCESS]", () => {
      const options: ExecSyncOptionsWithStringEncoding = {
        encoding: "utf8",
        cwd: TEMP_DIR,
      };
      Command.execSync(
        `echo "${Date.now().toLocaleString()} \t Jest test." >> README.md`,
        options,
      );
      const result = Git.commit("Commit via Jest", options);
      expect(result).toBeUndefined();
    });
  });

  describe("getRepoName", () => {
    test("[SUCCESS]", async () => {
      const result = await Git.getRepoName();
      expect(result).toBe("ftoy-cli");
    });

    test("[EMPTY NO MATCH]", () => {
      Directory.delete(resolve(TEMP_DIR, ".git"));
      const options = {
        cwd: TEMP_DIR,
        encoding: "utf8" as BufferEncoding,
      };
      Git.init(options);
      Git.setRemoteUrl("git@remote_url_test", options);
      expect(Git.getRepoName(options)).rejects.toBe("");
      Directory.delete(resolve(TEMP_DIR, ".git"));
    });

    test("[EMPTY MATCH BUT NO URL]", () => {
      Directory.delete(resolve(TEMP_DIR, ".git"));
      const options = {
        cwd: TEMP_DIR,
        encoding: "utf8" as BufferEncoding,
      };
      Git.init(options);
      Git.setRemoteUrl("git@github.com/.git", options);
      expect(Git.getRepoName(options)).rejects.toBe("");
      Directory.delete(resolve(TEMP_DIR, ".git"));
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
      expect(result).toContain("ftoy-cli.git");
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
