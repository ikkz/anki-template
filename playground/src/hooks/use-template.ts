import { configs } from '../../../build/config';
import { useSearchParams } from 'react-router';

const key = 'template';

export const useTemplate = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const template = searchParams.get(key);

  return [
    configs.find(({ name }) => name === template) ? template : null,
    (template: string) =>
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        params.set(key, template);
        return params;
      }),
  ] as const;
};
