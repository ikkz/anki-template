import { version } from '../../../package.json';
import { GithubOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC } from 'react';
import { useLocation } from 'react-router';

export const Header: FC = () => {
  const location = useLocation();
  return (
    <>
      <h1 className="font-bold text-2xl flex flex-wrap gap-x-2 gap-y-1">
        <span>ikkz Template@{version}</span>
        <Button
          icon={<GithubOutlined />}
          type="text"
          target="_blank"
          className="text-xl ml-2"
          href="https://github.com/ikkz/anki-template"
        />
        <a href="https://ko-fi.com/M4M212WUCI" target="_blank" rel="noreferrer">
          <img
            height="36"
            className="border-none h-9"
            src="https://storage.ko-fi.com/cdn/kofi6.png?v=6"
            alt="Buy Me a Coffee at ko-fi.com"
          />
        </a>
      </h1>
      <div className="mb-6">
        Docs
        <Button size="small" type="link" target="_blank" href="/docs/markdown">
          markdown
        </Button>
        <Button
          size="small"
          type="link"
          target="_blank"
          href="/docs/embed-options"
        >
          embed options
        </Button>
        {location.pathname === '/' ? null : (
          <>
            Go to
            <Button size="small" type="link" target="_blank" href="/">
              Playground
            </Button>
          </>
        )}
      </div>
    </>
  );
};
