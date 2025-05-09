import { CardShell } from '@/components/card-shell';
import { FIELD_ID } from '@/utils/const';
import { isFieldEmpty } from '@/utils/field';
import * as t from 'at/i18n';
import { AnkiField } from 'at/virtual/field';
import clsx from 'clsx';

interface Vocabulary {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license: License;
  sourceUrls: string[];
}

interface Phonetic {
  text: string;
  audio: string;
  sourceUrl?: string;
  license?: License;
}

interface License {
  name: string;
  url: string;
}

interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

declare global {
  interface Window {
    AT_VOCAB_CACHE?: Record<string, Promise<Vocabulary>>;
    AT_VOCAB_TRANSFORM?: (vocab: Vocabulary) => Promise<Vocabulary>;
  }
}

export default () => {
  const hasNote = !isFieldEmpty(FIELD_ID('note'));
  const hasAnswer = !isFieldEmpty(FIELD_ID('answer'));

  return (
    <CardShell
      title={t.question}
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
                className={clsx('prose prose-sm', 'dark:prose-invert')}
              />
            ) : null}
          </>
        ) : null
      }
    />
  );
};
