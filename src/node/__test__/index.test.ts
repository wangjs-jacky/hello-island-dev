import { expect, test } from "vitest";

test("add", () => {
  expect(1 + 1).toBe(2);
  /* 对于非常复杂的用例可以使用快照保存 */
  expect("map".slice(1)).toMatchSnapshot('"ap"');
  /* 可以使用内敛快照 */
  expect("map".slice(1)).toMatchInlineSnapshot('"ap"');
});
