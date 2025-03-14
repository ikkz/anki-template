import { CardShell } from '@/components/card-shell';
import { useBack } from '@/hooks/use-back';
import { useCrossState } from '@/hooks/use-cross-state';
import { FIELD_ID } from '@/utils/const';
import { isFieldEmpty } from '@/utils/field';
import useCreation from 'ahooks/es/useCreation';
import useMemoizedFn from 'ahooks/es/useMemoizedFn';
import * as t from 'at/i18n';
import { extractItems } from 'at/virtual/extract-tf-items';
import { AnkiField } from 'at/virtual/field';
import clsx from 'clsx';
import { CheckCircle, XCircle, Triangle } from 'lucide-react';
import { type ReactElement } from 'react';

const WrongAnwserIndicator = () => (
  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
    <Triangle
      size={14}
      fill="#ef4444"
      color="#ef4444"
      className="animate-bounce"
    />
  </div>
);

interface ItemProp {
  index: number;
  node: ReactElement;
  answer: boolean;
}

const Item = ({ node, answer, index }: ItemProp) => {
  const [back] = useBack();

  const [status, setStatus] = useCrossState<boolean | undefined>(
    `status-${index}`,
    undefined,
  );

  const onStatusChange = useMemoizedFn((status: boolean) => {
    if (back) {
      return;
    }
    setStatus(status);
  });

  const displayStatus = back ? answer : status;

  const showWrong = back && answer !== status;

  return (
    <div
      className={clsx(
        'rounded-xl pl-4 pr-2 py-2 mt-4 flex items-center justify-between',
        back
          ? displayStatus === answer
            ? 'bg-indigo-50'
            : 'bg-red-100'
          : 'bg-indigo-50',
        'dark:bg-opacity-10',
      )}
    >
      <div
        className={clsx(
          'prose prose-neutral dark:prose-invert rm-prose-y',
          'flex-grow mr-2',
        )}
      >
        {node}
      </div>
      <div className="relative">
        <div className="flex space-x-2">
          <div
            className={clsx(
              'p-2 rounded-full relative',
              {
                'cursor-pointer transition-transform hover:scale-105 active:scale-95':
                  !back,
              },
              displayStatus === true
                ? 'bg-green-500 text-white'
                : 'bg-indigo-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400',
            )}
            onClick={() => onStatusChange(true)}
          >
            <CheckCircle size={24} />
            {showWrong && status === true ? <WrongAnwserIndicator /> : null}
          </div>
          <div
            className={clsx(
              'p-2 rounded-full relative',
              {
                'cursor-pointer transition-transform hover:scale-105 active:scale-95':
                  !back,
              },
              displayStatus === false
                ? 'bg-orange-500 text-white'
                : 'bg-indigo-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400',
            )}
            onClick={() => onStatusChange(false)}
          >
            <XCircle size={24} />
            {showWrong && status === false ? <WrongAnwserIndicator /> : null}
          </div>
        </div>
        {showWrong && status === undefined ? <WrongAnwserIndicator /> : null}
      </div>
    </div>
  );
};

export default () => {
  const items = useCreation(() => {
    const field = document.getElementById(FIELD_ID('items'));
    if (!field) {
      return [];
    }
    return extractItems(field).map(({ node, answer }, idx) => (
      <Item index={idx} key={idx} node={node} answer={answer} />
    ));
  }, []);

  const hasNote = !isFieldEmpty(FIELD_ID('note'));
  const [back] = useBack();

  return (
    <CardShell
      title={t.question}
      questionExtra={
        <>
          {items}
          {back ? (
            <div className="flex items-center justify-end space-x-1 mt-2 text-xs text-gray-500">
              {t.yourWrongAnswer}
              <Triangle
                size={12}
                fill="#f87171"
                color="#f87171"
                className="ml-1"
              />
            </div>
          ) : null}
        </>
      }
      answer={
        hasNote ? (
          <AnkiField
            name="note"
            className={clsx('prose prose-sm', 'dark:prose-invert')}
          />
        ) : null
      }
    />
  );
};
