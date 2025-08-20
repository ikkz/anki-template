import { CardShell } from '@/components/card-shell';
import { useBack } from '@/hooks/use-back';
import { FIELD_ID } from '@/utils/const';
import { crossStorage } from '@/utils/cross-storage';
import { getFieldText, isFieldEmpty } from '@/utils/field';
import * as t from 'at/i18n';
import { AnkiField } from 'at/virtual/field';
import clsx from 'clsx';
import pRetry from 'p-retry';
import { useEffect, useMemo, useRef } from 'react';

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

async function fetchVocab(word: string) {
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
  );
  if (response.ok) {
    const body = await response.json();
    if (Array.isArray(body) && body.length) {
      return body[0] as Vocabulary;
    }
  }
}

async function fetchVocabWithRetry(word: string) {
  return await pRetry(() => fetchVocab(word), {
    retries: 5,
  });
}

export default () => {
  const hasNote = !isFieldEmpty(FIELD_ID('note'));
  const word = useMemo(
    () =>
      getFieldText('word')
        ?.replace(/^[\s\n]+/, '')
        .replace(/[\s\n]+$/, ''),
    [],
  );

  const [back] = useBack();

  const unmounted = useRef(false);
  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
    };
  }, []);

  useEffect(() => {
    if (back) {
      return;
    }
  }, [back]);

  return (
    <CardShell
      title={t.question}
      question={
        <div
          className={clsx(
            'at-vocab-word',
            'text-center font-semibold text-3xl',
          )}
        >
          {word}
        </div>
      }
      answer={null}
    />
  );
};
