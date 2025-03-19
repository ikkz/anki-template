import { About } from '@/components/about';
import { Block } from '@/components/block';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/checkbox';
import { Page, useNavigate } from '@/hooks/use-page';
import {
  biggerTextAtom,
  blurOptionsAtom,
  clozeAtom,
  hideAboutAtom,
  hideMcqAnswerAtom,
  hideQuestionTypeAtom,
  hideTimerAtom,
  noScrollAtom,
  randomOptionsAtom,
  selectionMenuAtom,
} from '@/store/settings';
import * as t from 'at/i18n';
import { entry } from 'at/options';
import { useAtom } from 'jotai';
import { FC } from 'react';

const CommonOptions: FC = () => {
  const [selectionMenu, setSelectionMenu] = useAtom(selectionMenuAtom);
  const [hideAbout, setHideAbout] = useAtom(hideAboutAtom);
  const [biggerText, setBiggerText] = useAtom(biggerTextAtom);
  const [hideTimer, setHideTimer] = useAtom(hideTimerAtom);
  const [noScorll, setNoScorll] = useAtom(noScrollAtom);
  const [cloze, setCloze] = useAtom(clozeAtom);
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
        data-testid="setting:selectionMenu"
      />
      {entry !== 'cloze' ? (
        <Checkbox
          title={t.cloze}
          subtitle={t.clozeDetail}
          checked={cloze}
          onChange={setCloze}
          data-testid="setting:cloze"
        />
      ) : null}
      <Checkbox
        title={t.biggerText}
        checked={biggerText}
        onChange={setBiggerText}
        data-testid="setting:biggerText"
      />
      <Checkbox
        title={t.noScroll}
        checked={noScorll}
        onChange={setNoScorll}
        data-testid="setting:noScroll"
      />
      <Checkbox
        title={t.hideTimer}
        checked={hideTimer}
        onChange={setHideTimer}
        data-testid="setting:hideTimer"
      />
      <Checkbox
        title={t.hideAbout}
        checked={hideAbout}
        onChange={setHideAbout}
        data-testid="setting:hideAbout"
      />
    </>
  );
};

let OptionList: FC;

// these branches can be treeshaken by rollup
if (entry === 'mcq' || entry === 'mcq_10') {
  OptionList = () => {
    const [randomOptions, setRandomOptions] = useAtom(randomOptionsAtom);
    const [hideQuestionType, setHideQuestionType] =
      useAtom(hideQuestionTypeAtom);
    const [blurOptions, setBlurOptions] = useAtom(blurOptionsAtom);
    const [hideMcqAnswer, setHideMcqAnswer] = useAtom(hideMcqAnswerAtom);

    return (
      <>
        <Checkbox
          title={t.hideQuestionType}
          checked={hideQuestionType}
          onChange={setHideQuestionType}
          subtitle={t.hideQuestionTypeDetail}
          data-testid="setting:hideQuestionType"
        />
        <Checkbox
          title={t.randomOption}
          subtitle={t.randomOptionDetail}
          checked={randomOptions}
          onChange={setRandomOptions}
          data-testid="setting:randomOptions"
        />
        <Checkbox
          title={t.blurOptions}
          subtitle={t.blurOptionsDetail}
          checked={blurOptions}
          onChange={setBlurOptions}
          data-testid="setting:blurOptions"
        />
        <Checkbox
          title={t.hideMcqAnswer}
          checked={hideMcqAnswer}
          onChange={setHideMcqAnswer}
          data-testid="setting:hideMcqAnswer"
        />
        <CommonOptions />
      </>
    );
  };
} else {
  OptionList = CommonOptions;
}

export default () => {
  const navigate = useNavigate();
  return (
    <Block
      name={t.templateSetting}
      action={<Button onClick={() => navigate(Page.Index)}>{t.back}</Button>}
    >
      <div className="text-gray-500 dark:text-gray-400 text-sm mb-3">
        {t.optionsHint}
        <Button onClick={() => navigate(Page.Options)}>{t.optionsPage}</Button>
      </div>
      <div className="flex flex-col gap-4">
        <OptionList />
      </div>
      <hr className="my-8" />
      <About />
    </Block>
  );
};
