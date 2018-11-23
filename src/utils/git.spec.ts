import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { join, resolve } from "path";
import { echo } from "shelljs";
import { Command } from "./command";
import { Directory } from "./directory";
import { Git } from "./git";

const TEMP_DIR = join("temp", "__git__");

const OPTIONS = {
  encoding: "utf8" as BufferEncoding,
  cwd: TEMP_DIR,
};

const NO_GIT_OPTIONS = {
  cwd: "..",
  encoding: "utf8" as BufferEncoding,
  stdio: [null, null, null],
};

describe("[utils] git", () => {
  describe("commit", () => {
    test("[EMPTY]", () => {
      Command.execSync("git init", OPTIONS);
      Command.execSync("git add .", OPTIONS);
      Command.execSync("git reset --hard", OPTIONS);
      expect(Git.commit("[EMPTY]", OPTIONS)).toBeUndefined();
    });

    test("[SUCCESS]", () => {
      const file = resolve(TEMP_DIR, ".cache");
      echo("-n", `__git_test__ ${Date.now().toLocaleString()}`).to(file);
      const result = Git.commit("Commit via Jest", OPTIONS);
      expect(result).toBeUndefined();
      Directory.delete(file);
    });
  });

  describe("getRepoName", () => {
    test("[SUCCESS]", async () => {
      const result = await Git.getRepoName();
      expect(result).toBe("ftoy-cli");
    });

    async function getRepoNameProcess(url) {
      Directory.delete(resolve(TEMP_DIR, ".git"));
      Git.init(OPTIONS);
      await Git.setRemoteUrl(url, OPTIONS);
      expect(Git.getRepoName(OPTIONS)).rejects.toBe("");
      Directory.delete(resolve(TEMP_DIR, ".git"));
    }

    test("[EMPTY NO MATCH]", async () => {
      await getRepoNameProcess("git@remote_url_test");
    });

    test("[EMPTY MATCH BUT NO URL]", async () => {
      await getRepoNameProcess("git@github.com/.git");
    });

    test("[FAILED]", () => {
      const result = Git.getRepoName(NO_GIT_OPTIONS);
      expect(result).rejects.toBe("");
    });
  });

  describe("getRemoteUrl", () => {
    test("[SUCCESS]", async () => {
      const result = await Git.getRemoteUrl();
      expect(result).toContain("ftoy-cli.git");
    });

    test("[FAILED]", () => {
      const result = Git.getRemoteUrl(NO_GIT_OPTIONS);
      expect(result).rejects.toBe("");
    });
  });

  describe("setRemoteUrl", () => {
    test("[SUCCESS ADD]", async () => {
      const remote = "git@__remote_test__.git";
      Git.init(OPTIONS);
      await Git.setRemoteUrl(remote, OPTIONS);
      expect(await Git.getRemoteUrl(OPTIONS)).toEqual(remote);
      Directory.delete(resolve(TEMP_DIR, ".git"));
    });

    test("[SUCCESS SET-URL]", async () => {
      const remote = "git@__remote_test__.git";
      const remote2 = "git@__remote_test_2__.git";
      Git.init(OPTIONS);
      await Git.setRemoteUrl(remote, OPTIONS);
      await Git.setRemoteUrl(remote2, OPTIONS);
      expect(await Git.getRemoteUrl(OPTIONS)).toEqual(remote2);
      Directory.delete(resolve(TEMP_DIR, ".git"));
    });
  });

  describe("getUsername", () => {
    test("[SUCCESS]", () => {
      expect(typeof Git.username).toEqual("string");
    });
  });

  describe("getUserEmail", () => {
    test("[SUCCESS]", () => {
      expect(typeof Git.useremail).toEqual("string");
    });
  });
});
