import Axios from "axios";
import { ExecSyncOptionsWithStringEncoding } from "child_process";
import { readdirSync } from "fs";
import { Command } from "./command";
import { Git } from "./git";

jest.mock("axios");

describe("[utils] Git", () => {
  test("[SUCCESS] isExisted", () => {
    expect(Git.isExisted).toBe(true);
  });

  test("[ERROR] clone", () => {
    expect(() => Git.clone()).toThrowError(/required/);
  });

  test("[SUCCESS] clone", () => {
    expect(
      (async () => {
        const TEMP_DIR = "temp";
        await Command.exec(`rm -rf ${TEMP_DIR}`);
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

  test("[ERROR] create", () => {
    expect(() => Git.create("")).toThrowError();
  });

  test("[SUCCESS] create", () => {
    const MOCK_DATA = {
      id: 21266,
      description: null,
      name: "test",
      name_with_namespace: "ftoy-cli / test",
      path: "test",
      path_with_namespace: "ftoy-cli/test",
      created_at: "2018-10-22T21:03:04.912+08:00",
      default_branch: null,
      tag_list: [],
      ssh_url_to_repo: "git@igit.58corp.com:ftoy-cli/test.git",
      http_url_to_repo: "http://igit.58corp.com/ftoy-cli/test.git",
      web_url: "http://igit.58corp.com/ftoy-cli/test",
      avatar_url: null,
      star_count: 0,
      forks_count: 0,
      last_activity_at: "2018-10-22T21:03:04.912+08:00",
      _links: {
        self: "http://igit.58corp.com/api/v4/projects/21266",
        issues: "http://igit.58corp.com/api/v4/projects/21266/issues",
        merge_requests:
          "http://igit.58corp.com/api/v4/projects/21266/merge_requests",
        repo_branches:
          "http://igit.58corp.com/api/v4/projects/21266/repository/branches",
        labels: "http://igit.58corp.com/api/v4/projects/21266/labels",
        events: "http://igit.58corp.com/api/v4/projects/21266/events",
        members: "http://igit.58corp.com/api/v4/projects/21266/members",
      },
      archived: false,
      visibility: "internal",
      resolve_outdated_diff_discussions: false,
      container_registry_enabled: true,
      issues_enabled: true,
      merge_requests_enabled: true,
      wiki_enabled: true,
      jobs_enabled: true,
      snippets_enabled: true,
      shared_runners_enabled: true,
      lfs_enabled: true,
      creator_id: 11177,
      namespace: {
        id: 14777,
        name: "ftoy-cli",
        path: "ftoy-cli",
        kind: "group",
        full_path: "ftoy-cli",
        parent_id: null,
      },
      import_status: "none",
      import_error: null,
      open_issues_count: 0,
      runners_token: "3Qysd3tSDPc612AN2Y5a",
      public_jobs: true,
      ci_config_path: null,
      shared_with_groups: [],
      only_allow_merge_if_pipeline_succeeds: false,
      request_access_enabled: false,
      only_allow_merge_if_all_discussions_are_resolved: false,
      printing_merge_request_link_enabled: true,
      merge_method: "merge",
    };
    (Axios as any).mockClear();
    (Axios.post as any).mockResolvedValue({
      data: MOCK_DATA,
    });
    expect(Git.create("test")).resolves.toEqual(MOCK_DATA);
  });

  test("[FAILED] create", () => {
    const MOCK_MESSAGE = "TEST";
    (Axios as any).mockClear();
    (Axios.post as jest.Mock<any>).mockRejectedValueOnce({
      message: MOCK_MESSAGE,
    });
    expect(Git.create("test")).rejects.toEqual(MOCK_MESSAGE);
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

        await Command.execp("echo jest > jest.md", {
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
});
