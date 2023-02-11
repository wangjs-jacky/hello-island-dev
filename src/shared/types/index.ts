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
  vite?: ViteConfiguration;
}
