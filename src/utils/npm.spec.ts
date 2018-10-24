import { NodePackageManager } from "./npm";

describe("[utils] npm", () => {
  test("[SUCCESS] managersCanUse", () => {
    expect(NodePackageManager.managersCanUse).toBeInstanceOf(Array);
  });
});
