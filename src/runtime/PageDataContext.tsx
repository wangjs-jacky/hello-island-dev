import { createContext, useContext } from "react";

import { PageData } from "shared/types";

export const PageDataContext = createContext({} as PageData);

export const usePageData = () => {
  return useContext(PageDataContext);
};
