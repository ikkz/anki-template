import { Block } from '@/components/block';
import { Button } from '@/components/button';
import { useNavigate, Page } from '@/hooks/use-page';
import * as t from 'at/i18n';
import { entry } from 'at/options';
import { useMemo } from 'react';

export default () => {
  const navigate = useNavigate();
  const options = useMemo(() => {
    const options = Object.fromEntries(
      Object.keys(localStorage)
        .filter(
          (key) =>
            (key.startsWith('at:_global:') || key.startsWith(`at:${entry}:`)) &&
            !!localStorage.getItem(key),
        )
        .map((key) => [key, localStorage.getItem(key)]),
    );
    return JSON.stringify(options, undefined, 2);
  }, []);

  return (
    <Block
      name={t.optionsPage}
      action={<Button onClick={() => navigate(Page.Settings)}>{t.back}</Button>}
    >
      <div className="prose prose-sm prose-neutral dark:prose-invert">
        <p
          dangerouslySetInnerHTML={{
            __html: t.optionsHelp,
          }}
        />
        <pre>{options}</pre>
      </div>
    </Block>
  );
};
