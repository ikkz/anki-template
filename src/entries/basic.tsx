import { AnkiField } from '@/components/field';
import { CardShell } from '../components/card-shell';
import { t } from '@/utils/locale';
import clsx from 'clsx';
import { isFieldEmpty } from '@/utils/field';
import { FIELD_ID } from '@/utils/const';

export default () => {
  const hasNote = !isFieldEmpty(FIELD_ID('note'));
  const hasAnswer = !isFieldEmpty(FIELD_ID('answer'));

  return (
    <CardShell
      title={t('question')}
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
