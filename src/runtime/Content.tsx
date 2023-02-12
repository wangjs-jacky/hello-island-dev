import { useRoutes } from "react-router-dom";
import Index from "../../docs/guide/index";
import A from "../../docs/guide/a";
import B from "../../docs/b";

const routes = [
  {
    path: "/guide",
    element: <Index />,
  },
  {
    path: "/guide/a",
    element: <A />,
  },
  {
    path: "/b",
    element: <B />,
  },
];

export const Content = () => {
  const rootElement = useRoutes(routes);
  return rootElement;
};
