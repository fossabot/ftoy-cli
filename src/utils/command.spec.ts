import { Command } from "./command";

describe("[utils] Command", () => {
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
