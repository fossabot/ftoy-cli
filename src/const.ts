import { resolve } from "path";
import { tempdir } from "shelljs";
import { Project } from "./utils/project";

export const TMP_ROOT = resolve(tempdir(), "__ftoy-cli");

export const TMP_PROJECT_DIR = resolve(TMP_ROOT, "project");

export const TMP_COMPONENT_DIR = resolve(TMP_ROOT, "component");

export const PROJECT_GIT_URL =
  "http://igit.58corp.com/ftoy-cli/toy-starter-normal.git";

export const COMPONENT_GIT_URL =
  "http://igit.58corp.com/ftoy-cli/toy-component-normal.git";

export const CHECK_UPDATE_CACHE_FILE = resolve(
  tempdir(),
  "__ftoy-cli.update.cache",
);

export const CHECK_VERSION_API = "http://localhost:7112/version";

export const CHECK_GAP = 24 * 60 * 60 * 1000;

export const PRIVATE_TOKEN_API = "http://localhost:7112/token";

export const TYPE_LIST_API = "http://ftoy.58corp.com/category/list";

export const VALIDATE_COMPONENT_NAME_API =
  "http://ftoy.58corp.com/cli/name/validate";

export const UPDATE_COMPONENT_API_ONLINE =
  "http://ftoy.58corp.com/component/update";

export const UPDATE_COMPONENT_API_TEST = `http://${
  Project.testServer
}/component/update`;
