import { Command } from "./command";

describe("[utils] Command", () => {
  test("[ERROR] has", async () => {
    expect(() => Command.has("")).toThrowError(/required/);
  });
  test("[SUCCESS] has", async () => {
    expect(await Command.has("node")).toBe(true);
  });
  test("[FAILED] has", async () => {
    expect(await Command.has("edon")).toBe(false);
  });

  test("[ERROR] execp", async () => {
    expect(() => Command.execp("")).toThrowError(/required/);
  });
  test("[SUCCESS] execp", async () => {
    expect(Command.execp("node --version")).toBeTruthy();
  });
  test("[FAILED] execp", async () => {
    expect(Command.execp("edon")).rejects.toBeTruthy();
  });

  test("[ERROR] exec", async () => {
    expect(() => Command.exec("")).toThrowError(/required/);
  });
  test("[SUCCESS] exec", async () => {
    expect(Command.exec("node --version")).toBeTruthy();
  });
  test("[FAILED] exec", async () => {
    expect(() => Command.exec("edon")).toThrowError();
  });
});
