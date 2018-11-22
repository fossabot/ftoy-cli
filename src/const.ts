import * as Debug from "debug";
import { resolve } from "path";
import { tempdir } from "shelljs";
import { Project } from "./utils/project";
import { generateTable } from "./utils/table";

const debug = Debug("[Const]");

export const NAMESPACE_ID = 13900;

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

export const CHECK_VERSION_API = "http://ftoy.58corp.com/cli/version";

export const CHECK_GAP = 24 * 60 * 60 * 1000;

export const PRIVATE_TOKEN_API = "http://ftoy.58corp.com/cli/token";

export const TYPE_LIST_API = "http://ftoy.58corp.com/category/list";

export const VALIDATE_COMPONENT_NAME_API =
  "http://ftoy.58corp.com/cli/name/validate";

export const UPDATE_COMPONENT_API_ONLINE =
  "http://ftoy.58corp.com/component/update";

export const UPDATE_COMPONENT_API_TEST = `http://${
  Project.testServer
}/component/update`;

debug(
  generateTable([
    ["CONST", "VALUE"],
    ["CHECK_GAP", CHECK_GAP],
    ["CHECK_UPDATE_CACHE_FILE", CHECK_UPDATE_CACHE_FILE],
    ["CHECK_VERSION_API", CHECK_VERSION_API],
    ["COMPONENT_GIT_URL", COMPONENT_GIT_URL],
    ["PRIVATE_TOKEN_API", PRIVATE_TOKEN_API],
    ["PROJECT_GIT_URL", PROJECT_GIT_URL],
    ["TMP_COMPONENT_DIR", TMP_COMPONENT_DIR],
    ["TMP_PROJECT_DIR", TMP_PROJECT_DIR],
    ["TMP_ROOT", TMP_ROOT],
    ["TYPE_LIST_API", TYPE_LIST_API],
    ["UPDATE_COMPONENT_API_ONLINE", UPDATE_COMPONENT_API_ONLINE],
    ["UPDATE_COMPONENT_API_TEST", UPDATE_COMPONENT_API_TEST],
    ["VALIDATE_COMPONENT_NAME_API", VALIDATE_COMPONENT_NAME_API],
  ]),
);
