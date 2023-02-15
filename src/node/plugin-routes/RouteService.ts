/* 安装 fast-glob */
import fastGlob from "fast-glob";
import { normalizePath } from "vite";
import * as path from "path";

/* 扫描后的路由包含两个部分 */
interface RouteMeta {
  routePath: string;
  absolutePath: string;
}

export class RouteService {
  /* 扫描文件夹 */
  #scanDir: string;
  /* 绝对路劲 */
  #routeData: RouteMeta[] = [];

  constructor(scanDir: string) {
    this.#scanDir = scanDir;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async init() {
    const files = fastGlob
      .sync(["**/*.{js,jsx,ts,tsx,md,mdx}"], {
        cwd: this.#scanDir,
        absolute: true,
        ignore: ["**/node_modules/**", "**/build/**", "config.ts"],
      })
      .sort();

    files.forEach((absFile) => {
      const fileRelativePath = normalizePath(
        path.relative(this.#scanDir, absFile)
      );
      /* 1. 路由路径 */
      const routePath = this.normalizeRoutePath(fileRelativePath);
      /* 2. 文件绝对路径 */
      this.#routeData.push({
        routePath,
        absolutePath: absFile,
      });
    });
  }

  /* 将文件的相对路径 => 路由配置路径  */
  normalizeRoutePath(rawPath: string) {
    /* 去除 后缀，以及去除 index  */
    const routePath = rawPath.replace(/\.(.*)?$/, "").replace(/index$/, "");
    /* 路由满足： / + routers  */
    return routePath.startsWith("/") ? routePath : `/${routePath}`;
  }

  // 获取路由数据(用于 viteset 测试)，方便测试
  getRouteMeta(): RouteMeta[] {
    return this.#routeData;
  }

  generateRoutesCode() {
    return `
    import React from 'react';
    import loadable from '@loadable/component';
    /* 构造动态导入组件, 使用 Route + 数字的方式命名 */
    ${this.#routeData
      .map((route, index) => {
        return `const Route${index} = loadable(() => import('${route.absolutePath}'));`;
      })
      .join("\n")}
    export const routes = [
    ${this.#routeData
      .map((route, index) => {
        return `{ path: '${route.routePath}', element: React.createElement(Route${index})}`;
      })
      .join(",\n")}
    ];
    `;
  }
}
