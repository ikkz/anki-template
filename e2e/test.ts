import { Anki } from './anki';
import { test as base } from '@playwright/test';

export const test = base.extend<{ anki: Anki }>({
  anki: async ({ page }, use) => {
    const anki = new Anki(page);
    await anki.init();
    await use(anki);
    await anki.clean();
  },
});
