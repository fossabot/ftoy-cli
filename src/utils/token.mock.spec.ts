import Axios from "axios";
import { Token } from "./token";

jest.mock("axios");

describe("[utils] token", () => {
  test("Get Token", () => {
    const MOCK_DATA = { data: "" };
    (Axios.get as jest.Mock<any>).mockResolvedValueOnce({
      data: MOCK_DATA,
    });
    expect(Token.getValue()).resolves.toBe("");
  });
});
