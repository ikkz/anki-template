import { About } from './about';
import { Block } from './block';
import { CardContainer } from './card-container';
import { Dot } from './dot';
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
import { t } from '@/utils/locale';

import { useAtomValue } from 'jotai';
import { FC, ReactNode, useRef, useState } from 'react';
import { AnkiField } from './field';
import { locale } from 'at/locale';
import clsx from 'clsx';

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
    <CardContainer
      className={clsx(
        'tappable m-auto w-full max-w-xl px-5 py-7 font-sans text-base lg:max-w-2xl',
        `locale-${locale}`,
      )}
    >
      {header}
      {showSettings ? (
        <Block
          name={
            <div className="flex flex-row justify-between">
              <span>{t('templateSetting')}</span>
              <div
                className="cursor-pointer font-bold text-indigo-500"
                onClick={() => setShowSettings(false)}
              >
                {t('back')}
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
                {t('templateSetting')}
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
        {back ? (
          <Block name={t('answer')} id={prefNoScroll ? undefined : 'answer'}>
            {answer}
          </Block>
        ) : null}
        <TimerBlock />
        {prefHideAbout ? null : (
          <Block name={t('about')}>
            <About />
          </Block>
        )}
      </div>
    </CardContainer>
  );
};
