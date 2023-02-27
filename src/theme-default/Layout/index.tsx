import { Content } from "@runtime";
import { usePageData } from "@runtime";
import "uno.css";

export const Layout = () => {
  const pageData = usePageData();
  /* 获取 pageType */
  const { pageType } = pageData;

  const getContent = () => {
    if (pageType === "home") {
      return <div> Home 页面</div>;
    } else if (pageType === "doc") {
      return (
        <div>
          <Content></Content>
        </div>
      );
    } else {
      return <div>404 页面</div>;
    }
  };

  return (
    <div>
      <div>Nav</div>
      {getContent()}
    </div>
  );
};
