import SettingsPage from './settings';
import { Page, PageMap } from '@/hooks/use-page';

export const DEFAULT_PAGES: PageMap = {
  [Page.Settings]: SettingsPage,
};
