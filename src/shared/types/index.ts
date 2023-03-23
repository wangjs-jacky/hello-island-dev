import { ComponentType } from "react";
import { UserConfig as ViteConfiguration } from "vite";

export type NavItemWithLink = {
  text: string;
  link: string;
};

export interface Sidebar {
  [path: string]: SidebarGroup[];
}

export interface SidebarGroup {
  text?: string;
  items: SidebarItem[];
}

export type SidebarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SidebarItem[] };

export interface Footer {
  message?: string;
  copyright?: string;
}

/* 主题面板 */
export interface ThemeConfig {
  /* 顶部 NavBar */
  nav?: NavItemWithLink[];
  /* 侧边栏 */
  sidebar?: Sidebar;
  /* 底部栏 */
  footer?: Footer;
}

export interface UserConfig {
  /* 主题 */
  title?: string;
  /* 描述 */
  description?: string;
  /* 主题面板设置 */
  themeConfig?: ThemeConfig;
  /* Vite 配置 */
  viteConfig?: ViteConfiguration;
}

/* 扩展：UserConfig 的超集 */
export interface SiteConfig {
  root: string;
  configPath: string;
  siteData: UserConfig;
}

/* 定义 Context 的类型定义 */
/* 路由定义 */
export type PageType = "home" | "doc" | "custom" | "404";

export interface Header {
  id: string;
  text: string;
  depth: number;
}

export interface Feature {
  icon: string;
  title: string;
  details: string;
}

export interface Hero {
  name: string;
  text: string;
  tagline: string;
  image?: {
    src: string;
    alt: string;
  };
  actions: {
    text: string;
    link: string;
    theme: "brand" | "alt";
  }[];
}

/* 支持解析的 yaml 数据 */
export interface FrontMatter {
  title?: string;
  description?: string;
  pageType?: PageType;
  sidebar?: boolean;
  outline?: boolean;
  // 增加主页才存在的属性： features 和 hero 的类型
  features?: Feature[];
  hero?: Hero;
}

export interface PageData {
  /* 配置数据 */
  siteData: UserConfig;
  /** location.path */
  pagePath: string;
  /** 元信息 */
  frontmatter: FrontMatter;
  /* 路由 */
  pageType: PageType;
  toc?: Header[];
}

export interface PageModule {
  default: ComponentType;
  frontmatter: FrontMatter;
  toc?: Header[];
  [key: string]: unknown;
}

export type PropsWithIsland = {
  __island?: boolean;
};
