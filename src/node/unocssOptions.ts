import { VitePluginConfig } from "unocss/vite";
import { presetAttributify, presetWind, presetIcons } from "unocss";

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  /* 扩展语法 */
  rules: [
    /* [
      "divider-bottom",
      {
        "border-bottom": "1px solid var(--island-c-divider-light)",
      },
    ], */
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: "1px solid var(--island-c-divider-light)",
      }),
    ],
  ],
};

export default options;
