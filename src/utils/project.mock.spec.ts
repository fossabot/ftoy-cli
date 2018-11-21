import { Project } from "./project";

jest.mock("../config.const");

describe("[utils] project", () => {
  test.each`
    key                   | value
    ${"componentDir"}     | ${"test"}
    ${"distDir"}          | ${"test"}
    ${"buildScript"}      | ${"test"}
    ${"buildWatchScript"} | ${"test"}
    ${"testServer"}       | ${"test"}
  `("Project[$key]", ({ key, value }: { key: string; value: string }) => {
    expect(Project[key]).toBe(value);
  });

  test("should be valid", () => {
    expect(Project.isValid()).toBe(true);
  });
});
