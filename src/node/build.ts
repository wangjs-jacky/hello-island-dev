import { build as viteBuild } from "vite";
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from "./constants";

export async function bundle(root: string) {

  try {
    const clientBuild = async () => {
      return viteBuild({
        mode: "production",
        root,
        build: {
          outDir: "build",
          rollupOptions: {
            input: CLIENT_ENTRY_PATH,
            output: {
              format: 'esm' // 运行在浏览器端，模块语法为 EMS
            }
          }
        }
      })
    }

    const serverBuild = async () => {
      return viteBuild({
        mode: "production",
        root,
        build: {
          ssr: true,
          outDir: ".temp",
          rollupOptions: {
            input: SERVER_ENTRY_PATH,
            output: {
              format: 'cjs'
            }
          }
        }
      })
    }

    console.log("Building client + server bundles...");
    await clientBuild();
    await serverBuild();
  } catch (error) {

  }
}

export async function build(root: string) {
  /* 1. bundle - client 端 + server 端 */
  console.log("root", root);
  await bundle(root);
  /* 2. 引入 server-entry 模块 */

  /* 3. 服务端渲染 */
}