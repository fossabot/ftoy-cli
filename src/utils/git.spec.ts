import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { join, resolve } from "path";
import { echo } from "shelljs";
import { Command } from "./command";
import { Directory } from "./directory";
import { Git } from "./git";

const TEMP_DIR = join("temp", "__git__");

const options = {
  encoding: "utf8" as BufferEncoding,
  cwd: TEMP_DIR,
};

describe("[utils] git", () => {
  describe("commit", () => {
    test("[EMPTY]", () => {
      Command.execSync("git init", options);
      Command.execSync("git add .", options);
      Command.execSync("git reset --hard", options);
      expect(Git.commit("[EMPTY]", options)).toBeUndefined();
    });

    test("[SUCCESS]", () => {
      echo("-n", `__git_test__ ${Date.now().toLocaleString()}`).to(
        resolve(TEMP_DIR, ".cache"),
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

    test("[EMPTY NO MATCH]", async () => {
      Directory.delete(resolve(TEMP_DIR, ".git"));
      Git.init(options);
      await Git.setRemoteUrl("git@remote_url_test", options);
      expect(Git.getRepoName(options)).rejects.toBe("");
      Directory.delete(resolve(TEMP_DIR, ".git"));
    });

    test("[EMPTY MATCH BUT NO URL]", async () => {
      Directory.delete(resolve(TEMP_DIR, ".git"));
      Git.init(options);
      await Git.setRemoteUrl("git@github.com/.git", options);
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

  describe("setRemoteUrl", () => {
    test("[SUCCESS ADD]", async () => {
      const remote = "git@__remote_test__.git";
      Git.init(options);
      await Git.setRemoteUrl(remote, options);
      expect(await Git.getRemoteUrl(options)).toEqual(remote);
      Directory.delete(resolve(TEMP_DIR, ".git"));
    });

    test("[SUCCESS SET-URL]", async () => {
      const remote = "git@__remote_test__.git";
      const remote2 = "git@__remote_test_2__.git";
      Git.init(options);
      await Git.setRemoteUrl(remote, options);
      await Git.setRemoteUrl(remote2, options);
      expect(await Git.getRemoteUrl(options)).toEqual(remote2);
      Directory.delete(resolve(TEMP_DIR, ".git"));
    });
  });

  describe("getUsername", () => {
    test("[SUCCESS]", () => {
      expect(typeof Git.username).toEqual("string");
    });
  });
});
