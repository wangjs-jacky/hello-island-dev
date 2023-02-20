import { pluginMdxRollup } from "./pluginMdxRollup";
import { Plugin } from "vite";
import { pluginMdxHmr } from "./pluginMdxHmr";

export function createPluginMdx(): Plugin[] {
  return [pluginMdxRollup(), pluginMdxHmr()];
}
