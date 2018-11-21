import { Component } from "./component";

jest.mock("./project");
jest.mock("./git");

describe("[utils] component", () => {
  test("Get All Components [NO REPO NAME]", async () => {
    expect(Component.getAllComponents()).rejects.toBeTruthy();
  });
});
