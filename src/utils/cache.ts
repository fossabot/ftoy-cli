import { resolve } from "path";
import { COMPONENT_GIT_URL, PROJECT_GIT_URL, TMP_COMPONENT_DIR, TMP_PROJECT_DIR, TMP_ROOT } from "../const";
import { Directory } from "./directory";
import { Git } from "./git";

export async function cacheProjects() {
  Directory.delete(TMP_PROJECT_DIR);
  await Git.clone({
    dist: TMP_PROJECT_DIR,
    url: PROJECT_GIT_URL,
  });
  Directory.delete(resolve(TMP_PROJECT_DIR, ".git"));
}

export async function cacheComponents() {
  Directory.delete(TMP_COMPONENT_DIR);
  await Git.clone({
    dist: TMP_COMPONENT_DIR,
    url: COMPONENT_GIT_URL,
  });
  Directory.delete(resolve(TMP_COMPONENT_DIR, ".git"));
}

export function cleanCache() {
  Directory.delete(TMP_ROOT);
}
