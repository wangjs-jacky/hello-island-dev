/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { resolve } from "node:path";
import fs from "fs-extra";
import { loadConfigFromFile } from "vite";
import { SiteConfig, UserConfig } from "shared/types";

type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

function getUserConfigPath(root: string) {
  try {
    /* 支持两类配置文件 */
    const supportConfigFiles = ["config.ts", "config.js"];
    const configPath = supportConfigFiles
      /* 找 Example 文件夹（docs）下的 config.ts 文件 */
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (error) {
    console.error(`Failed to load user config: ${error}`);
  }
}

function resolveSiteData(userConfig: UserConfig): UserConfig {
  const {
    title = "Island.js",
    description = "SSG FrameWork",
    themeConfig = {},
    viteConfig = {},
  } = userConfig;

  return {
    title,
    description,
    themeConfig,
    viteConfig,
  };
}

export async function resolveConfig(
  root: string,
  command: "serve" | "build",
  mode: "development" | "production"
): Promise<SiteConfig> {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);

  const siteConfig: SiteConfig = {
    root,
    configPath: configPath,
    siteData: resolveSiteData(userConfig as UserConfig),
  };

  return siteConfig;
}

export async function resolveUserConfig(
  root: string,
  command: "serve" | "build",
  mode: "development" | "production"
) {
  // 1. 获取配置文件路径
  const configPath = getUserConfigPath(root);
  // 2. 读取配置文件的内容
  const result = await loadConfigFromFile({ command, mode }, configPath, root);

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    /* 
      三种情况：
      1. object 2. promise 3. function
    */
    const userConfig = await (typeof rawConfig === "function"
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

/* config 支持 ts 定义 */
export function defineConfig(config: UserConfig) {
  return config;
}
