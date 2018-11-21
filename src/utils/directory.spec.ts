import { readdirSync } from "fs";
import { resolve } from "path";
import { mkdir } from "shelljs";
import { Directory } from "./directory";
const TEMP_DIR = "temp";
describe("[utils] directory", () => {
  test("[SUCCESS] exist", () => {
    expect(Directory.exist("package.json")).toBe(true);
    expect(Directory.exist("__package.json")).toBe(false);
    expect(Directory.exist("package.json", "file")).toBe(true);
    expect(Directory.exist("package.json", "dir")).toBe(false);
  });

  test("[SUCCESS] delete", () => {
    const folder = "__delete__";
    const dir = resolve(TEMP_DIR, folder);
    mkdir(dir);
    expect(readdirSync(TEMP_DIR).includes(folder)).toBe(true);
    Directory.delete(dir);
    expect(readdirSync(TEMP_DIR).includes(folder)).toBe(false);
  });

  test("[SUCCESS] copy", () => {
    const folderFrom = "__copy__";
    const folderTo = "__copy_to__";
    const dirFrom = resolve(TEMP_DIR, folderFrom);
    const dirTo = resolve(TEMP_DIR, folderTo);
    mkdir(dirFrom);
    expect(readdirSync(TEMP_DIR).includes(folderFrom)).toBe(true);
    Directory.copy(dirFrom, dirTo);
    expect(readdirSync(TEMP_DIR).includes(folderTo)).toBe(true);
    Directory.delete(dirFrom);
    Directory.delete(dirTo);
  });
});
