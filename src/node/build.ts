import { build as viteBuild, InlineConfig } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";

export async function bundle(root: string) {
  const resolveViteConfig = (isServer: boolean = false): InlineConfig => ({
    mode: "production",
    root,
    build: {
      outDir: isServer ? ".temp" : "build",
      rollupOptions: {
        input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
        output: {
          format: isServer ? "cjs" : "esm"
        }
      }
    }
  })

  try {
    const clientBuild = async () => {
      return viteBuild(resolveViteConfig())
    }
    const serverBuild = async () => {
      return viteBuild(resolveViteConfig(true));
    }
    console.log("Building client + server bundles...");
    Promise.all([clientBuild(), serverBuild()]);
  } catch (error) {
    console.log(error);
  }
}

export async function build(root: string) {
  /* 1. bundle - client 端 + server 端 */
  console.log("root", root);
  await bundle(root);
  /* 2. 引入 server-entry 模块 */

  /* 3. 服务端渲染 */
}