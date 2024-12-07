import { CardShell } from '@/components/card-shell';
import { AnkiField } from '@/components/field';
import { useBack } from '@/hooks/use-back';
import { useCrossState } from '@/hooks/use-cross-state';
import { FIELD_ID } from '@/utils/const';
import { isFieldEmpty } from '@/utils/field';
import { t } from '@/utils/locale';
import useCreation from 'ahooks/es/useCreation';
import clsx from 'clsx';
import { CheckCircle, XCircle } from 'lucide-react';
import { useCallback } from 'react';

interface ItemProp {
  index: number;
  node: HTMLDivElement;
  answer?: boolean;
}

const Item = ({ node, answer, index }: ItemProp) => {
  const attachNode = useCallback(
    (ref: HTMLDivElement) => {
      if (node && ref) {
        node.remove();
        ref.appendChild(node);
      }
    },
    [node],
  );

  const back = useBack();
  const [status, setStatus] = useCrossState<boolean | undefined>(
    `status-${index}`,
    undefined,
  );

  return (
    <div className="rounded-xl bg-indigo-50 px-4 py-2 mt-4 flex items-center justify-between">
      <div
        ref={attachNode}
        className={clsx(
          'prose prose-neutral dark:prose-invert',
          'flex-grow mr-2',
        )}
      />
      <div className="flex space-x-2">
        <div
          className={clsx(
            'p-2 rounded-full cursor-pointer',
            'transition-transform hover:scale-105 active:scale-95',
            status === true
              ? 'bg-green-500 text-white'
              : 'bg-indigo-100 text-gray-600',
          )}
          onClick={() => setStatus(true)}
        >
          <CheckCircle size={24} />
        </div>
        <div
          className={clsx(
            'p-2 rounded-full cursor-pointer',
            'transition-transform hover:scale-105 active:scale-95',
            status === false
              ? 'bg-red-500 text-white'
              : 'bg-indigo-100 text-gray-600',
          )}
          onClick={() => setStatus(false)}
        >
          <XCircle size={24} />
        </div>
      </div>
    </div>
  );
};

export default () => {
  const items = useCreation(() => {
    const field = document.getElementById(FIELD_ID('items'));
    if (!field) {
      return null;
    }
    const itemNodes = field
      .querySelector('ul')
      ?.querySelectorAll(':scope > li');
    if (!itemNodes?.length) {
      return null;
    }
    return Array.from(itemNodes).map((node, idx) => {
      const answer = !node.textContent?.startsWith('F:');
      const container = document.createElement('div');
      container.append(...Array.from(node.childNodes));

      let firstTextNode: Node | null = container;
      while (firstTextNode && firstTextNode.nodeType !== Node.TEXT_NODE) {
        firstTextNode = firstTextNode.firstChild;
      }
      do {
        if (!firstTextNode) {
          break;
        }
        const match = firstTextNode.textContent?.match(/^(T|F):\s*/);
        if (!match) {
          break;
        }
        const range = document.createRange();
        range.setStart(firstTextNode, 0);
        range.setEnd(firstTextNode, match[0].length);
        range.deleteContents();
        // eslint-disable-next-line no-constant-condition
      } while (false);
      return <Item index={idx} key={idx} node={container} answer={answer} />;
    });
  }, []);
  const hasNote = !isFieldEmpty(FIELD_ID('note'));

  return (
    <CardShell
      title={t('question')}
      questionExtra={items}
      answer={
        hasNote ? (
          <AnkiField
            name="note"
            className={clsx('prose prose-sm mt-3', 'dark:prose-invert')}
          />
        ) : null
      }
    />
  );
};
