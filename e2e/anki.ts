import {
  type BuildJson,
  BUILTIN_FIELDS,
} from '../build/plugins/generate-template';
import { readTemplate } from './utils';
import { type Page } from '@playwright/test';
import { template } from 'lodash-es';

declare const e2eAnki: {
  clean(): void;
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

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  public async renderCard(
    build: BuildJson,
    back?: boolean,
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
    let html = renderTemplate(template.front, fields);
    if (back) {
      html = renderTemplate(template.back, {
        ...fields,
        FrontSide: html,
      });
    }
    await this.render(html);
  }

  public async clean() {
    await this.page.evaluate(() => {
      e2eAnki.clean();
    });
  }
}

function renderTemplate(html: string, data: object) {
  return template(html, {
    interpolate: /{{([\s\S]+?)}}/g,
  })(data);
}
