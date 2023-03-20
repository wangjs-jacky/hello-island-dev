import babelPluginIsland from "../babel-plugin-island";
import { describe, test, expect } from "vitest";
import os from "os";
import { transformAsync } from "@babel/core";
import { MASK_SPLITTER } from "../constants";

const isWindows = os.platform() === "win32";

describe("babel-plugin-island", () => {
  /* 
    目标：
        // 转换前
        <Aside __island />

        // 转换后
        <Aside __island="../comp/id.ts!!ISLAND!!/User/import.ts" />
  */
  const ISLAND_PATH = "../Comp/index";
  const prefix = isWindows ? "C:" : "";

  const IMPORTER_PATH = prefix + "/User/project/test.tsx";
  /* 配置 babelrc 中的内容 */
  const babelOptions = {
    filename: IMPORTER_PATH,
    presets: ["@babel/preset-react"],
    plugins: [babelPluginIsland],
  };
  test("Should compile jsx identifier", async () => {
    const code = `import Aside from '${ISLAND_PATH}';
                  export default function App(){ return <Aside __island />}`;
    const result = await transformAsync(code, babelOptions);

    expect(result?.code).toContain(
      `__island: "${ISLAND_PATH}${MASK_SPLITTER}${IMPORTER_PATH}"`
    );
  });

  test("Should compile jsx member expression", async () => {
    const code = `import Aside from '${ISLAND_PATH}';
                  export default function App(){ return <Aside.B __island />}`;
    const result = await transformAsync(code, babelOptions);

    expect(result?.code).toContain(
      `__island: "${ISLAND_PATH}${MASK_SPLITTER}${IMPORTER_PATH}"`
    );
  });
});
