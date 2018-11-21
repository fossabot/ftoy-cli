import * as Debug from "debug";
import { resolve } from "path";
import { generateTable } from "./utils/table";

const debug = Debug("[Const]");

export const CONFIG_FILE_PATH = resolve(".ftoy-cli.json");

debug(
  generateTable([["CONST", "VALUE"], ["CONFIG_FILE_PATH", CONFIG_FILE_PATH]]),
);
