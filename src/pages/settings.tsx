import { About } from '@/components/about';
import { Block } from '@/components/block';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Page, useNavigate } from '@/hooks/use-page';
import {
  biggerTextAtom,
  blurOptionsAtom,
  hideAboutAtom,
  hideQuestionTypeAtom,
  hideTimerAtom,
  noScorllAtom,
  randomOptionsAtom,
  selectionMenuAtom,
} from '@/store/settings';
import * as t from 'at/i18n';
import { id } from 'at/options';
import { useAtom } from 'jotai';
import { FC } from 'react';

const CommonOptions: FC = () => {
  const [selectionMenu, setSelectionMenu] = useAtom(selectionMenuAtom);
  const [hideAbout, setHideAbout] = useAtom(hideAboutAtom);
  const [biggerText, setBiggerText] = useAtom(biggerTextAtom);
  const [hideTimer, setHideTimer] = useAtom(hideTimerAtom);
  const [noScorll, setNoScorll] = useAtom(noScorllAtom);
  const navigate = useNavigate();

  return (
    <>
      <Checkbox
        title={t.selMenu}
        subtitle={
          <span>
            {t.selMenuDetail}
            <Button
              className="px-1 ml-auto float-right"
              onClick={() => navigate(Page.Tools)}
            >
              {t.setting}
            </Button>
          </span>
        }
        checked={selectionMenu}
        onChange={setSelectionMenu}
      />
      <Checkbox
        title={t.biggerText}
        checked={biggerText}
        onChange={setBiggerText}
      />
      <Checkbox title={t.noScroll} checked={noScorll} onChange={setNoScorll} />
      <Checkbox
        title={t.hideTimer}
        checked={hideTimer}
        onChange={setHideTimer}
      />
      <Checkbox
        title={t.hideAbout}
        checked={hideAbout}
        onChange={setHideAbout}
      />
    </>
  );
};

let OptionList: FC;

// these branches can be treeshaken by rollup
if (id === 'mcq') {
  OptionList = () => {
    const [randomOptions, setRandomOptions] = useAtom(randomOptionsAtom);
    const [hideQuestionType, setHideQuestionType] =
      useAtom(hideQuestionTypeAtom);
    const [blurOptions, setBlurOptions] = useAtom(blurOptionsAtom);

    return (
      <>
        <Checkbox
          title={t.hideQuestionType}
          checked={hideQuestionType}
          onChange={setHideQuestionType}
          subtitle={t.hideQuestionTypeDetail}
        />
        <Checkbox
          title={t.randomOption}
          subtitle={t.randomOptionDetail}
          checked={randomOptions}
          onChange={setRandomOptions}
        />
        <Checkbox
          title={t.blurOptions}
          subtitle={t.blurOptionsDetail}
          checked={blurOptions}
          onChange={setBlurOptions}
        />
        <CommonOptions />
      </>
    );
  };
} else if (id === 'basic') {
  OptionList = CommonOptions;
} else if (id === 'tf') {
  OptionList = CommonOptions;
} else {
  OptionList = () => null;
}

export default () => {
  const navigate = useNavigate();
  return (
    <Block
      name={t.templateSetting}
      action={t.back}
      onAction={() => navigate(Page.Index)}
    >
      <div className="flex flex-col gap-4">
        <OptionList />
      </div>
      <hr className="my-8" />
      <About />
    </Block>
  );
};
