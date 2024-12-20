import { About } from './about';
import { Block } from './block';
import { Dot } from './dot';
import { AnkiField } from './field';
import { SelectionMenu } from './selection-menu';
import {
  Settings,
  biggerTextAtom,
  hideAboutAtom,
  noScorllAtom,
  selectionMenuAtom,
} from './settings';
import { TimerBlock } from './timer';
import { useBack } from '@/hooks/use-back';
import { useField } from '@/hooks/use-field';
import { tAbout, tAnswer, tBack, tTemplateSetting } from 'at/i18n';
import { locale } from 'at/locale';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { FC, ReactNode, useRef, useState } from 'react';

interface Props {
  header?: ReactNode;
  title: ReactNode;
  questionExtra?: ReactNode;
  answer?: ReactNode;
}

export const CardShell: FC<Props> = ({
  header,
  title,
  questionExtra,
  answer,
}) => {
  const prefSelectionMenu = useAtomValue(selectionMenuAtom);
  const prefHideAbout = useAtomValue(hideAboutAtom);
  const prefBiggerText = useAtomValue(biggerTextAtom);
  const prefNoScroll = useAtomValue(noScorllAtom);

  const [back] = useBack();

  const questionRef = useRef<HTMLDivElement>(null);

  const tags = useField('Tags')?.split(' ');

  const [showSettings, setShowSettings] = useState(false);

  return (
    <div
      className={clsx(
        'tappable m-auto px-5 py-7 font-sans text-base',
        'w-full max-w-xl lg:max-w-3xl',
        `locale-${locale}`,
      )}
    >
      {header}
      {showSettings ? (
        <Block
          name={
            <div className="flex flex-row justify-between">
              <span>{tTemplateSetting}</span>
              <div
                className="cursor-pointer font-bold text-indigo-500"
                onClick={() => setShowSettings(false)}
              >
                {tBack}
              </div>
            </div>
          }
        >
          <Settings />
        </Block>
      ) : null}
      <div className={showSettings ? 'hidden' : 'block'}>
        <Block
          ref={questionRef}
          name={
            <div className="flex flex-row justify-between">
              <span>
                {title}
                {tags?.length ? (
                  <>
                    <Dot />
                    {tags.join(' / ')}
                  </>
                ) : null}
              </span>
              <div
                className="cursor-pointer font-bold text-indigo-500"
                onClick={() => setShowSettings(true)}
              >
                {tTemplateSetting}
              </div>
            </div>
          }
          className="relative"
        >
          {prefSelectionMenu ? <SelectionMenu target={questionRef} /> : null}
          <AnkiField
            name="question"
            className={clsx('font-bold', prefBiggerText ? 'prose-xl' : '')}
          />
          {questionExtra}
        </Block>
        {back && answer ? (
          <Block name={tAnswer} id={prefNoScroll ? undefined : 'answer'}>
            {answer}
          </Block>
        ) : null}
        <TimerBlock />
        {prefHideAbout ? null : (
          <Block name={tAbout}>
            <About />
          </Block>
        )}
      </div>
    </div>
  );
};
