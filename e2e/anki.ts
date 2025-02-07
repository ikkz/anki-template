import {
  type BuildJson,
  BUILTIN_FIELDS,
} from '../build/plugins/generate-template';
import { renderTemplate } from '../build/utils';
import { readTemplate } from './utils';
import { type Page } from '@playwright/test';

declare const e2eAnki: {
  clean(): void;
  flipToBack(): void;
  render(html: string): void;
};

export class Anki {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async init() {
    await this.page.goto('http://localhost:3001');
  }

  private async render(html: string) {
    await this.page.evaluate((html) => {
      e2eAnki.render(html);
    }, html);
  }

  public async renderCard(
    build: BuildJson,
    extraFields: Partial<Record<(typeof BUILTIN_FIELDS)[number], string>> = {},
  ) {
    const fields = Object.assign(
      {},
      Object.fromEntries(
        [...build.fields, ...BUILTIN_FIELDS].map((k) => [k, '']),
      ),
      build.notes[0].fields,
      extraFields,
    );
    const template = await readTemplate(build.config.name);
    const frontHtml = renderTemplate(template.front, fields);
    const backHtml = renderTemplate(template.back, {
      ...fields,
      FrontSide: frontHtml,
    });
    await this.render(frontHtml);
    await this.page.evaluate((backHtml) => {
      e2eAnki.flipToBack = () => {
        e2eAnki.render(backHtml);
      };
    }, backHtml);

    return async () => {
      await this.page.evaluate(() => {
        e2eAnki.flipToBack();
      });
    };
  }

  public async clean() {
    await this.page.evaluate(() => {
      e2eAnki.clean();
    });
  }
}
