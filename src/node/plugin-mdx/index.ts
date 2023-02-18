import { pluginMdxRollup } from "./pluginMdxRollup";
import { Plugin } from "vite";

export function createPluginMdx(): Plugin[] {
  return [pluginMdxRollup()];
}
