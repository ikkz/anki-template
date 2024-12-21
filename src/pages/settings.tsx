import { About } from '@/components/about';
import { Block } from '@/components/block';
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
import {
  tBiggerText,
  tBlurOptions,
  tBlurOptionsDetail,
  tHideAbout,
  tHideQuestionType,
  tHideQuestionTypeDetail,
  tHideTimer,
  tNoScroll,
  tRandomOption,
  tRandomOptionDetail,
  tSelMenu,
  tSelMenuDetail,
  tTemplateSetting,
  tBack,
  tSetting,
} from 'at/i18n';
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
        title={tSelMenu}
        subtitle={
          <span>
            {tSelMenuDetail}
            <span
              className="text-indigo-500 font-bold cursor-pointer px-1 ml-auto float-right"
              onClick={() => navigate(Page.Tools)}
            >
              {tSetting}
            </span>
          </span>
        }
        checked={selectionMenu}
        onChange={setSelectionMenu}
      />
      <Checkbox
        title={tBiggerText}
        checked={biggerText}
        onChange={setBiggerText}
      />
      <Checkbox title={tNoScroll} checked={noScorll} onChange={setNoScorll} />
      <Checkbox
        title={tHideTimer}
        checked={hideTimer}
        onChange={setHideTimer}
      />
      <Checkbox
        title={tHideAbout}
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
          title={tHideQuestionType}
          checked={hideQuestionType}
          onChange={setHideQuestionType}
          subtitle={tHideQuestionTypeDetail}
        />
        <Checkbox
          title={tRandomOption}
          subtitle={tRandomOptionDetail}
          checked={randomOptions}
          onChange={setRandomOptions}
        />
        <Checkbox
          title={tBlurOptions}
          subtitle={tBlurOptionsDetail}
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
      name={tTemplateSetting}
      action={tBack}
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
