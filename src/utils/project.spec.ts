import { Project } from "./project";

describe("[utils] project", () => {
  test.each`
    key                   | value
    ${"componentDir"}     | ${"test"}
    ${"distDir"}          | ${"test"}
    ${"buildScript"}      | ${"test"}
    ${"buildWatchScript"} | ${"test"}
    ${"testServer"}       | ${"test"}
  `("Project[$key]", ({ key, value }: { key: string; value: string }) => {
    expect(Project[key]).toBeDefined();
  });

  test("should not be valid", () => {
    expect(Project.isValid()).toBe(false);
  });
});
