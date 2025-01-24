import { filterBuilds } from '../dist';
import { test } from '../test';
import { expect } from '@playwright/test';

filterBuilds({}).forEach((build) => {
  test(`[${build.config.name}] should not display tags`, async ({
    anki,
    page,
  }) => {
    await anki.renderCard(build, false, {});
    await expect(page.getByTestId('tags')).not.toBeAttached();
    await anki.renderCard(build, true, {});
    await expect(page.getByTestId('tags')).not.toBeAttached();
  });

  test(`[${build.config.name}] should display tags`, async ({ anki, page }) => {
    await anki.renderCard(build, false, {
      Tags: 'hello 世界',
    });
    await expect(page.getByTestId('tags')).toHaveText('hello / 世界');
    await anki.renderCard(build, true, {
      Tags: 'hello 世界',
    });
    await expect(page.getByTestId('tags')).toHaveText('hello / 世界');
  });
});
