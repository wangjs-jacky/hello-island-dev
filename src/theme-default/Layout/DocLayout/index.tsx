import { Content, usePageData } from "@runtime";
import { useLocation } from "react-router-dom";
import { Aside } from "../../components/Aside";
import DocFooter from "../../components/DocFooter";
import Sidebar from "../../components/Sidebar";
import styles from "./index.module.scss";

/* 正文内容 */
const DocLayout = () => {
  /* 获取当前 md 中 yaml 信息 */
  const { siteData, toc } = usePageData();
  console.log("toc", toc);

  /* 获取 config.ts 内的配置信息 */
  const sidebarData = siteData.themeConfig?.sidebar || {};
  /* 获取当前 location 地址 */
  const { pathname } = useLocation();
  /* 当前路由地址：pathname */

  console.log("pathname", pathname);

  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    if (pathname.startsWith(key)) {
      return true;
    }
  });
  /* 根据 pathname 匹配 config.ts 中配置的路由 */
  const matchedSidebar = sidebarData[matchedSidebarKey] || [];

  return (
    <div relative="~">
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
      <div className={styles.content} flex="~">
        {/* 内容区 */}
        <div className="w-full min-w-364px px-24px max-w-860px">
          <div className="island-doc">
            <Content />
          </div>
          <DocFooter />
        </div>
        {/* 目录 */}
        <div className={styles["aside-container"]}>
          <Aside headers={toc}></Aside>
        </div>
      </div>
    </div>
  );
};

export default DocLayout;
