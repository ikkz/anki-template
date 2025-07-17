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
import { CheckCircle, XCircle, Check, X } from 'lucide-react';
import { type ReactElement } from 'react';

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

  const displayStatus = status;

  const isCorrect = back && answer === status;

  return (
    <div
      className={clsx(
        'rounded-xl pl-4 pr-2 py-2 mt-4 flex items-center justify-between border-2',
        back
          ? isCorrect
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
            : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
          : 'bg-indigo-50 border-indigo-200 dark:bg-neutral-800 dark:border-neutral-600',
      )}
    >
      <div
        className={clsx(
          'prose prose-neutral dark:prose-invert rm-prose-y',
          'flex-grow mr-2 flex items-center',
        )}
      >
        {back && (
          <div className="mr-3 flex-shrink-0">
            {isCorrect ? (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check size={16} color="white" strokeWidth={3} />
              </div>
            ) : (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <X size={16} color="white" strokeWidth={3} />
              </div>
            )}
          </div>
        )}
        <div className="flex-grow">{node}</div>
      </div>
      <div className="relative">
        <div className="flex space-x-2">
          <div
            className={clsx(
              'p-2 rounded-full relative border-2',
              {
                'cursor-pointer transition-transform hover:scale-105 active:scale-95':
                  !back,
              },
              back
                ? displayStatus === true
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400 border-gray-300 dark:border-neutral-600'
                : displayStatus === true
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-indigo-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400 border-indigo-200 dark:border-neutral-600',
            )}
            onClick={() => onStatusChange(true)}
          >
            <CheckCircle size={24} />
          </div>
          <div
            className={clsx(
              'p-2 rounded-full relative border-2',
              {
                'cursor-pointer transition-transform hover:scale-105 active:scale-95':
                  !back,
              },
              back
                ? displayStatus === false
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-gray-100 dark:bg-neutral-700 text-gray-500 dark:text-neutral-400 border-gray-300 dark:border-neutral-600'
                : displayStatus === false
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-indigo-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400 border-indigo-200 dark:border-neutral-600',
            )}
            onClick={() => onStatusChange(false)}
          >
            <XCircle size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default () => {
  const rawItems = useCreation(() => {
    const field = document.getElementById(FIELD_ID('items'));
    if (!field) {
      return [];
    }
    return extractItems(field);
  }, []);

  const items = useCreation(() => {
    return rawItems.map(({ node, answer }, idx) => (
      <Item index={idx} key={idx} node={node} answer={answer} />
    ));
  }, [rawItems]);

  const hasNote = !isFieldEmpty(FIELD_ID('note'));

  return (
    <CardShell
      title={t.question}
      questionExtra={<>{items}</>}
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
