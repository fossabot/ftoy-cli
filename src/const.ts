import { resolve } from "path";
import { tempdir } from "shelljs";

export const TMP_ROOT = resolve(tempdir(), "__ftoy-cli");

export const TMP_PROJECT_DIR = resolve(TMP_ROOT, "project");

export const TMP_COMPONENT_DIR = resolve(TMP_ROOT, "component");

export const PROJECT_GIT_URL =
  "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git";

export const COMPONENT_GIT_URL =
  "http://igit.58corp.com/ftoy-cli/toy-component-normal.git";
