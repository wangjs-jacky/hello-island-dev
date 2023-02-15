import { useRoutes } from "react-router-dom";
import { routes } from "island:routes";

/* 
示例：
const routes = [
  {
    path: "/guide",
    element: <Index />,
  },
]; */

export const Content = () => {
  console.log("routes", routes);
  const rootElement = useRoutes(routes);

  return rootElement;
};
