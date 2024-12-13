import { CardShell } from '../components/card-shell';
import { AnkiField } from '../components/field';
import {
  biggerTextAtom,
  blurOptionsAtom,
  hideQuestionTypeAtom,
} from '../components/settings';
import { useBack } from '../hooks/use-back';
import { useCrossState } from '../hooks/use-cross-state';
import { useField } from '../hooks/use-field';
import { t } from '../utils/locale';
import { randomOptionsAtom } from '@/components/settings';
import '@/styles/mcq.css';
import { flipToBack } from '@/utils/bridge';
import { FIELD_ID } from '@/utils/const';
import { getFieldText, isFieldEmpty } from '@/utils/field';
import { useAutoAnimate } from '@formkit/auto-animate/preact';
import useCreation from 'ahooks/es/useCreation';
import useMemoizedFn from 'ahooks/es/useMemoizedFn';
import useSelections from 'ahooks/es/useSelections';
import useTimeout from 'ahooks/es/useTimeout';
import { locale } from 'at/locale';
import { fields } from 'at/options';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { shuffle } from 'remeda';

const fieldToAlpha = (field: string) => field.slice(field.length - 1);

export default () => {
  const prefRandomOptions = useAtomValue(randomOptionsAtom);
  const prefBiggerText = useAtomValue(biggerTextAtom);
  const prefHideQuestionType = useAtomValue(hideQuestionTypeAtom);

  const answers = useCreation(
    () => (getFieldText('answer') || '').split('').map((c) => `option${c}`),
    [],
  );
  const [originOptions, shuffledOptions] = useCreation(() => {
    const options = fields.filter(
      (name) => name.startsWith('option') && !isFieldEmpty(FIELD_ID(name)),
    );

    return [options, shuffle(options)] as const;
  }, []);
  const [options, setOptions] = useCrossState(
    'options-array',
    prefRandomOptions ? shuffledOptions : originOptions,
  );

  const [storedSelections, setStoredSelections] = useCrossState<string[]>(
    'selected',
    [],
  );
  const { isSelected, toggle, selected, setSelected } = useSelections(
    options,
    storedSelections,
  );
  useEffect(() => {
    setStoredSelections(selected);
  }, [selected]);

  const [back] = useBack();

  const onClick = useMemoizedFn((name: string) => {
    if (back) {
      return;
    }

    if (isMultipleChoice || prefHideQuestionType) {
      toggle(name);
    } else {
      setSelected([name]);
      setTimeout(flipToBack, 300);
    }
  });

  const getSelectResult = useMemoizedFn((name: string) => {
    switch (true) {
      case back && isSelected(name) && !answers.includes(name):
        return 'wrong';
      case back && isSelected(name) && answers.includes(name):
        return 'correct';
      case back && !isSelected(name) && answers.includes(name):
        return 'missed';
      default:
        return 'none';
    }
  });

  const [parent] = useAutoAnimate();
  useTimeout(() => {
    if (back) {
      setOptions(originOptions);
    }
  }, 600);

  const note = useField('note');
  const isMultipleChoice = answers.length > 1;

  const [blurred, setBlurred] = useCrossState(
    'blurred',
    useAtomValue(blurOptionsAtom),
  );

  return (
    <CardShell
      title={
        prefHideQuestionType || !options.length ? (
          t('question')
        ) : (
          <>{isMultipleChoice ? t('multipleAnswer') : t('singleAnswer')}</>
        )
      }
      questionExtra={
        options.length ? (
          <div
            className={clsx('mt-5', prefBiggerText ? 'prose-xl' : '')}
            ref={parent}
            onClick={() => setBlurred(false)}
          >
            {options.map((name) => {
              const selectResult = getSelectResult(name);
              return (
                <div
                  key={name}
                  onClick={() => onClick(name)}
                  className={clsx(
                    'select-type-hint relative mb-3 cursor-pointer transition-transform before:select-none after:select-none last:mb-0 lg:mb-6',
                    {
                      'active:scale-95': !back,
                      'after:absolute after:left-px after:top-0 after:block after:-translate-x-full after:rounded-l after:px-0.5 after:py-1 after:text-xs after:text-white':
                        selectResult !== 'none',
                      'after:origin-top-right after:scale-75':
                        selectResult !== 'none' && locale === 'en',
                      'before:text-red-500 after:bg-red-500':
                        selectResult === 'wrong',
                      'before:text-green-500 after:bg-green-500':
                        selectResult === 'correct',
                      'before:text-amber-500 after:bg-amber-500':
                        selectResult === 'missed',
                      [`after:content-['${t(
                        `${
                          selectResult as Exclude<typeof selectResult, 'none'>
                        }Answer`,
                      )}']`]: selectResult !== 'none',
                      [clsx(
                        `before:absolute before:content-['${fieldToAlpha(
                          name,
                        )}'] before:-top-4 before:right-1 before:text-4xl before:font-extrabold before:italic before:opacity-20`,
                        'dark:before:opacity-50',
                      )]: back,
                      'before:text-indigo-500 after:hidden':
                        selectResult === 'none',
                    },
                    {
                      [`pointer-events-none blur`]: blurred,
                    },
                  )}
                >
                  <AnkiField
                    name={name}
                    className={clsx(
                      'rounded-xl border-2 border-transparent bg-indigo-50 px-4 py-2 transition-colors',
                      {
                        '!border-indigo-500 !bg-indigo-50 !text-indigo-500':
                          !back && isSelected(name),
                        '!border-red-500 !bg-red-50 !text-red-500':
                          selectResult === 'wrong',
                        '!border-green-500 !bg-green-50 !text-green-500':
                          selectResult === 'correct',
                        '!border-amber-500 !bg-amber-50 !text-amber-500':
                          selectResult === 'missed',
                        '!rounded-tl-none': selectResult !== 'none',
                      },
                      'dark:!bg-opacity-10',
                    )}
                  />
                </div>
              );
            })}
          </div>
        ) : null
      }
      answer={
        <>
          {options.length ? (
            <div className="text-center text-3xl font-bold italic text-opacity-50">
              <span className="align-super">
                {selected.length ? (
                  originOptions.map((name) => {
                    const selectResult = getSelectResult(name);
                    if (!['wrong', 'correct'].includes(selectResult)) {
                      return null;
                    }
                    return (
                      <span
                        key={name}
                        className={clsx({
                          'text-red-400': selectResult === 'wrong',
                          'text-green-400': selectResult === 'correct',
                        })}
                      >
                        {fieldToAlpha(name)}
                      </span>
                    );
                  })
                ) : (
                  <span className="text-amber-400">-</span>
                )}
              </span>
              <span className="text-5xl text-gray-200">/</span>
              <span className="align-sub text-green-400">
                {answers.map((name) => fieldToAlpha(name))}
              </span>
            </div>
          ) : (
            <>
              <AnkiField name="answer" />
              <hr className="my-3" />
            </>
          )}
          {note ? (
            <AnkiField
              name="note"
              className={clsx('prose prose-sm mt-3', 'dark:prose-invert')}
            />
          ) : null}
        </>
      }
    />
  );
};
