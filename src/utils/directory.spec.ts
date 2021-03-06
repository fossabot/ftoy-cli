import { readdirSync } from "fs";
import { join, resolve } from "path";
import { echo, mkdir } from "shelljs";
import { Directory } from "./directory";

const TEMP_DIR = join("temp", "__directory__");

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

  test("[SUCCESS] readAllSync", () => {
    const dir = resolve(TEMP_DIR);
    const subDir = resolve(dir, "__sub__");
    mkdir("-p", dir, subDir);
    const file = resolve(dir, ".cache");
    const subFile = resolve(subDir, ".cache");
    echo("-n", "__read_test__").to(file);
    echo("-n", "__read_test__").to(subFile);

    const res = Directory.readAllSync(dir);
    expect(res).toContainEqual(file);
    expect(res).toContainEqual(subFile);
  });
});
