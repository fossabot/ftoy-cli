import Axios from "axios";
import { Component } from "./component";

jest.mock("axios");
jest.mock("./project");
jest.mock("./command");

describe("[utils] component", () => {
  test("Validate Component Name", () => {
    const MOCK_DATA = { data: true };
    (Axios.post as jest.Mock<any>).mockResolvedValueOnce({
      data: MOCK_DATA,
    });
    expect(Component.validateName("test")).resolves.toBe(MOCK_DATA.data);
  });

  test("Get Component Types", () => {
    const MOCK_DATA = {
      data: [{ label: "标题", sort: 1, value: "title", _id: "1540781888704" }],
    };
    (Axios.get as jest.Mock<any>).mockResolvedValueOnce({
      data: MOCK_DATA,
    });
    expect(Component.getTypes()).resolves.toBe(MOCK_DATA.data);

    const MOCK_DATA_EMPTY = {};
    (Axios.get as jest.Mock<any>).mockResolvedValueOnce({
      data: MOCK_DATA_EMPTY,
    });
    expect(Component.getTypes()).resolves.toBe([]);
  });

  test("Get All Components [NO REMOTE URL]", async () => {
    expect(Component.getAllComponents()).rejects.toBeTruthy();
  });

  test("Bundle", async () => {
    expect(Component.bundle()).rejects.toBeTruthy();
  });

  test("Release", async () => {
    const MOCK_DATA = { data: true };
    (Axios.post as jest.Mock<any>).mockResolvedValueOnce({
      data: MOCK_DATA,
    });
    const config = {
      type: "",
      version: "",
      name: "",
      label: "",
      props: {
        attributes: {
          default: () => ({}),
        },
      },
      _id: "",
      gitname: "",
      regname: "",
      giturl: "",
      path: "",
      attributes: {},
    };
    const component = new Component(config);
    expect(component.config === config).toBe(true);
    expect(component.release()).resolves.toBe(MOCK_DATA);
  });
});
