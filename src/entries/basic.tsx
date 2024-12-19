import { CardShell } from '../components/card-shell';
import { AnkiField } from '@/components/field';
import { FIELD_ID } from '@/utils/const';
import { isFieldEmpty } from '@/utils/field';
import tQuestion from 'at/i18n/question';
import clsx from 'clsx';

export default () => {
  const hasNote = !isFieldEmpty(FIELD_ID('note'));
  const hasAnswer = !isFieldEmpty(FIELD_ID('answer'));

  return (
    <CardShell
      title={tQuestion}
      answer={
        hasAnswer || hasNote ? (
          <>
            {hasAnswer ? (
              <AnkiField name="answer" className="prose dark:prose-invert" />
            ) : null}
            {hasAnswer && hasNote ? <hr className="my-4" /> : null}
            {hasNote ? (
              <AnkiField
                name="note"
                className={clsx('prose prose-sm mt-3', 'dark:prose-invert')}
              />
            ) : null}
          </>
        ) : null
      }
    />
  );
};
