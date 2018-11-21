import { Command } from "./command";

describe("[utils] command", () => {
  test("[ERROR] execp", async () => {
    expect(() => Command.execp("")).toThrowError(/required/);
  });
  test("[SUCCESS] execp", async () => {
    expect(Command.execp("cd")).resolves.toBe("");
  });
  test("[FAILED] execp", async () => {
    expect(Command.execp("edon")).rejects.toBeTruthy();
  });

  test("[ERROR] exec", async () => {
    expect(() => Command.execSync("")).toThrowError(/required/);
  });

  test("[SUCCESS] exec", async () => {
    expect(Command.execSync("cd")).toBe("");
  });

  test("[FAILED] exec", async () => {
    expect(() => Command.execSync("edon")).toThrowError();
  });
});
