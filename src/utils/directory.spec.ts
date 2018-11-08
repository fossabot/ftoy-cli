import { Directory } from "./directory";

describe("[utils] directory", () => {
  test("[ERROR] exist", () => {
    expect(() => Directory.exist("")).toThrowError();
  });

  test("[SUCCESS] exist", () => {
    expect(Directory.exist("package.json")).toBe(true);
    expect(Directory.exist("__package.json")).toBe(false);
    expect(Directory.exist("package.json", "file")).toBe(true);
    expect(Directory.exist("package.json", "dir")).toBe(false);
  });
});
