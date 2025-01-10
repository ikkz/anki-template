import { createContext, FC, useContext } from 'react';
import { doNothing } from 'remeda';

export enum Page {
  Index = 'index',
  Settings = 'settings',
  Tools = 'tools',
  Options = 'options',
}

export type PageMap = Partial<Record<Page, FC>>;

export const PageContext = createContext<{
  page: Page;
  setPage: (page: Page) => void;
}>({
  page: Page.Index,
  setPage: doNothing,
});

export const usePage = () => {
  return useContext(PageContext).page;
};

export const useNavigate = () => {
  return useContext(PageContext).setPage;
};
