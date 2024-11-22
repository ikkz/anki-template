import { About } from './about';
import { Checkbox } from './checkbox';

import { useAtom } from 'jotai';
import { FC } from 'react';
import { id } from 'at/options';

import { t } from '@/utils/locale';
import { atomWithLocalStorage } from '@/utils/storage';

export const randomOptionsAtom = atomWithLocalStorage<boolean>(
  'randomOptions',
  true,
);
export const selectionMenuAtom = atomWithLocalStorage<boolean>(
  'selectionMenu',
  true,
);
export const hideAboutAtom = atomWithLocalStorage<boolean>('hideAbout', false);
export const biggerTextAtom = atomWithLocalStorage<boolean>(
  'biggerText',
  false,
);
export const hideTimerAtom = atomWithLocalStorage<boolean>('hideTimer', false);
export const hideQuestionTypeAtom = atomWithLocalStorage<boolean>(
  'hideQuestionType',
  false,
);
export const noScorllAtom = atomWithLocalStorage<boolean>('noScorll', true);
export const blurOptionsAtom = atomWithLocalStorage<boolean>(
  'blurOptions',
  false,
);

let OptionList: FC;

// these branches can be treeshaken by rollup
if (id === 'mcq') {
  OptionList = () => {
    const [randomOptions, setRandomOptions] = useAtom(randomOptionsAtom);
    const [selectionMenu, setSelectionMenu] = useAtom(selectionMenuAtom);
    const [hideAbout, setHideAbout] = useAtom(hideAboutAtom);
    const [biggerText, setBiggerText] = useAtom(biggerTextAtom);
    const [hideTimer, setHideTimer] = useAtom(hideTimerAtom);
    const [hideQuestionType, setHideQuestionType] =
      useAtom(hideQuestionTypeAtom);
    const [noScorll, setNoScorll] = useAtom(noScorllAtom);
    const [blurOptions, setBlurOptions] = useAtom(blurOptionsAtom);

    return (
      <>
        <Checkbox
          title={t('hideQuestionType')}
          checked={hideQuestionType}
          onChange={setHideQuestionType}
          subtitle={t('hideQuestionTypeDetail')}
        />
        <Checkbox
          title={t('biggerText')}
          checked={biggerText}
          onChange={setBiggerText}
        />
        <Checkbox
          title={t('randomOption')}
          subtitle={t('randomOptionDetail')}
          checked={randomOptions}
          onChange={setRandomOptions}
        />
        <Checkbox
          title={t('noScroll')}
          checked={noScorll}
          onChange={setNoScorll}
        />
        <Checkbox
          title={t('selMenu')}
          subtitle={t('selMenuDetail')}
          checked={selectionMenu}
          onChange={setSelectionMenu}
        />
        <Checkbox
          title={t('blurOptions')}
          subtitle={t('blurOptionsDetail')}
          checked={blurOptions}
          onChange={setBlurOptions}
        />
        <Checkbox
          title={t('hideTimer')}
          checked={hideTimer}
          onChange={setHideTimer}
        />
        <Checkbox
          title={t('hideAbout')}
          checked={hideAbout}
          onChange={setHideAbout}
        />
      </>
    );
  };
} else if (id === 'basic') {
  OptionList = () => {
    const [selectionMenu, setSelectionMenu] = useAtom(selectionMenuAtom);
    const [hideAbout, setHideAbout] = useAtom(hideAboutAtom);
    const [biggerText, setBiggerText] = useAtom(biggerTextAtom);
    const [hideTimer, setHideTimer] = useAtom(hideTimerAtom);
    const [noScorll, setNoScorll] = useAtom(noScorllAtom);

    return (
      <>
        <Checkbox
          title={t('biggerText')}
          checked={biggerText}
          onChange={setBiggerText}
        />
        <Checkbox
          title={t('noScroll')}
          checked={noScorll}
          onChange={setNoScorll}
        />
        <Checkbox
          title={t('selMenu')}
          subtitle={t('selMenuDetail')}
          checked={selectionMenu}
          onChange={setSelectionMenu}
        />
        <Checkbox
          title={t('hideTimer')}
          checked={hideTimer}
          onChange={setHideTimer}
        />
        <Checkbox
          title={t('hideAbout')}
          checked={hideAbout}
          onChange={setHideAbout}
        />
      </>
    );
  };
} else {
  OptionList = () => null;
}

export const Settings: FC = () => {
  return (
    <>
      <div className="flex flex-col gap-4">
        <OptionList />
      </div>
      <hr className="my-8" />
      <About />
    </>
  );
};
