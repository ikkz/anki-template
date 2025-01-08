import { About } from './about';
import { Block } from './block';
import { Button } from './button';
import { Dot } from './dot';
import { TimerBlock } from './timer';
import { useBack } from '@/hooks/use-back';
import { useField } from '@/hooks/use-field';
import { Page, PageContext } from '@/hooks/use-page';
import { DEFAULT_PAGES } from '@/pages';
import { biggerTextAtom, hideAboutAtom, noScrollAtom } from '@/store/settings';
import * as t from 'at/i18n';
import { locale } from 'at/options';
import { AnkiField } from 'at/virtual/field';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { FC, MutableRefObject, ReactNode, useState } from 'react';

interface Props {
  header?: ReactNode;
  title: ReactNode;
  enableCloze?: boolean;
  questionRef?: MutableRefObject<HTMLDivElement | null>;
  questionExtra?: ReactNode;
  answer?: ReactNode;
}

export const CardShell: FC<Props> = ({
  header,
  title,
  enableCloze,
  questionRef,
  questionExtra,
  answer,
}) => {
  const prefHideAbout = useAtomValue(hideAboutAtom);
  const prefBiggerText = useAtomValue(biggerTextAtom);
  const prefNoScroll = useAtomValue(noScrollAtom);
  const [back] = useBack();

  const tags = useField('Tags')?.split(' ');

  const [page, setPage] = useState(Page.Index);
  const PageComponent = DEFAULT_PAGES[page];

  return (
    <div
      className={clsx(
        'tappable m-auto px-5 py-7 font-sans text-base',
        'w-full max-w-xl lg:max-w-3xl',
        `locale-${locale}`,
      )}
    >
      {header}
      <PageContext.Provider value={{ page, setPage }}>
        {PageComponent ? <PageComponent /> : null}
        <div className={page !== Page.Index ? 'hidden' : 'block'}>
          <Block
            name={
              <span>
                {title}
                {tags?.length ? (
                  <>
                    <Dot />
                    <span data-testid="tags">{tags.join(' / ')}</span>
                  </>
                ) : null}
              </span>
            }
            action={
              <Button
                onClick={() => setPage(Page.Settings)}
                data-testid="index:setting"
              >
                {t.templateSetting}
              </Button>
            }
            className="relative"
            enableTools
          >
            <AnkiField
              name="question"
              enableCloze={enableCloze}
              className={clsx(prefBiggerText ? 'prose-xl' : '')}
              fieldRef={questionRef}
            />
            {questionExtra}
          </Block>
          {back && answer ? (
            <Block
              name={t.answer}
              id={prefNoScroll ? undefined : 'answer'}
              enableTools
            >
              {answer}
            </Block>
          ) : null}
          <TimerBlock />
          {prefHideAbout ? null : (
            <Block name={t.about}>
              <About />
            </Block>
          )}
        </div>
      </PageContext.Provider>
    </div>
  );
};
