import { version } from '../../package.json';
import { locale } from 'at/options';
import clsx from 'clsx';

export const EnAbout = () => (
  <div className={clsx('prose prose-sm', 'dark:prose-invert')}>
    <p>
      Thank you for using my carefully crafted Anki template! If you like my
      template, consider supporting me{' '}
      <a href="https://afdian.com/a/leoly">here</a> ❤️.
    </p>

    <p>
      You can find all the templates I&apos;ve created{' '}
      <a href="https://github.com/ikkz/anki-template">here</a>.
    </p>

    <p>
      For suggestions and feedback, please submit them{' '}
      <a href="https://github.com/ikkz/anki-template/issues">here</a>.
    </p>

    <blockquote>
      Current version: {version},{' '}
      <a href="https://github.com/ikkz/anki-template/releases">check</a> update
    </blockquote>
  </div>
);

export const ZhAbout = () => (
  <div className={clsx('prose prose-sm', 'dark:prose-invert')}>
    <p>
      感谢您使用我精心制作的 Anki 模板！ 如果你喜欢我的模板，可以考虑在{' '}
      <a href="https://afdian.com/a/leoly">这里</a> 支持我 ❤️
    </p>
    <p>
      您可以在 <a href="https://github.com/ikkz/anki-template">这里</a>{' '}
      找到我创建的所有模板
    </p>

    <p>
      对于建议和反馈，请在{' '}
      <a href="https://github.com/ikkz/anki-template/issues">这里</a> 提交
    </p>

    <blockquote>
      当前版本： {version}，{' '}
      <a href="https://github.com/ikkz/anki-template/releases">检查</a>更新
    </blockquote>
  </div>
);

export const About = locale === 'zh' ? ZhAbout : EnAbout;
