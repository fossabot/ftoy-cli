import { resolve } from "path";
import { mv } from "shelljs";
import { Component } from "../utils/component";

jest.mock("./project");

function moveOut() {
  mv(
    resolve(TEMP_DIR, "__components__"),
    resolve(TEMP_DIR, "__no_components__"),
  );
}

function moveIn() {
  mv(
    resolve(TEMP_DIR, "__no_components__"),
    resolve(TEMP_DIR, "__components__"),
  );
}

const TEMP_DIR = "temp";

describe("[utils] component", () => {
  test("Get All Components", async () => {
    const components = await Component.getAllComponents();
    expect(components).toHaveLength(1);
  });

  test("Get All Components [EMPTY]", async () => {
    moveOut();
    const components = await Component.getAllComponents();
    expect(components).toHaveLength(0);
    moveIn();
  });

  test("Get All Components [NO DIR]", async () => {
    moveOut();
    const components = await Component.getAllComponents();
    expect(components).toHaveLength(0);
    moveIn();
  });

  test("Bundle", async () => {
    expect(await Component.bundle()).toBeUndefined();
  });

  test("Bundle [EMPTY]", async () => {
    moveOut();
    const error = await Component.bundle().catch((e) => e);
    expect(error).toBeDefined();
    moveIn();
  });
});
