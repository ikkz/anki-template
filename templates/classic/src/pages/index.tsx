import OptionsPage from './options';
import SettingsPage from './settings';
import ToolsPage from './tools';
import { Page, PageMap } from '@/hooks/use-page';

export const DEFAULT_PAGES: PageMap = {
  [Page.Settings]: SettingsPage,
  [Page.Tools]: ToolsPage,
  [Page.Options]: OptionsPage,
};
