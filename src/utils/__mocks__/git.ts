export class Git {
  public static getRemoteUrl() {
    return Promise.resolve("git@github.com/.git");
  }

  public static getRepoName() {
    return Promise.reject("");
  }
}
