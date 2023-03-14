import { usePageData } from "@runtime";
import { useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

/* 正文内容 */
const DocLayout = () => {
  const { siteData } = usePageData();
  console.log("siteData", siteData);
  const sidebarData = siteData.themeConfig?.sidebar || {};
  /* 获取当前 location 地址 */
  const { pathname } = useLocation();
  /* 当前路由地址：pathname */
  const matchedSidebarKey = Object.keys(sidebarData).find((key) => {
    /* 根据 pathname 对应配置的路由 */
    console.log("key", key);

    if (pathname.startsWith(key)) {
      return true;
    }
  });

  const matchedSidebar = sidebarData[matchedSidebarKey] || [];
  console.log("matchedSidebar", matchedSidebar, pathname);

  return (
    <div relative="~">
      <Sidebar sidebarData={matchedSidebar} pathname={pathname} />
    </div>
  );
};

export default DocLayout;
