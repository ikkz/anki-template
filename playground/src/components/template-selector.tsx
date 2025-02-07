import { BuildConfig, configs } from '../../../build/config';
import { configMatch } from '../../../build/utils';
import { entryOptions, fieldOptions, localeList } from '../const';
import { useTemplate } from '../hooks/use-template';
import { Header } from './header';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, List, Select } from 'antd';
import clsx from 'clsx';
import { FC, useMemo, useState } from 'react';

const optionRender = ({ value, label }: { value?: any; label?: any }) => (
  <>
    <div>{value}</div>
    <div className="text-neutral-500 text-wrap">{label}</div>
  </>
);

const labelRender = ({ value }: { value?: any }) => value;

export const TemplateSelector: FC = () => {
  const [entry, setEntry] = useState<BuildConfig['entry']>();
  const [locale, setLocale] = useState<BuildConfig['locale']>();
  const [field, setField] = useState<BuildConfig['field']>();
  const filteredConfigs = useMemo(
    () =>
      configs.filter((config) => configMatch({ entry, locale, field }, config)),
    [entry, locale, field],
  );

  const [selectedTemplate, setSelectedTemplate] = useTemplate();

  return (
    <div className="flex flex-col h-full">
      <Header />
      <div className="grid grid-cols-[100px_1fr] gap-y-4 items-center mb-4">
        <div>Template</div>
        <Select
          options={entryOptions}
          optionRender={optionRender}
          labelRender={labelRender}
          allowClear
          value={entry}
          onChange={setEntry}
        />
        <div>Language</div>
        <Select
          options={localeList.map((locale) => ({
            value: locale,
            label: locale,
          }))}
          allowClear
          value={locale}
          onChange={setLocale}
        />
        <div>Field type</div>
        <Select
          options={fieldOptions}
          optionRender={optionRender}
          labelRender={({ value }) => value}
          allowClear
          value={field}
          onChange={setField}
        />
      </div>
      <List
        bordered
        dataSource={filteredConfigs}
        rootClassName="h-[300px]"
        renderItem={(item) => (
          <List.Item
            className={clsx(
              'cursor-pointer hover:bg-neutral-100 transition-colors',
              {
                'bg-neutral-100': item.name === selectedTemplate,
              },
            )}
            onClick={() => setSelectedTemplate(item.name)}
            actions={[
              <Button
                key="download"
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                download={`${item.name}.apkg`}
                href={`/releases/${item.name}.apkg`}
              />,
            ]}
          >
            {item.name}
          </List.Item>
        )}
        className="overflow-auto"
      />
    </div>
  );
};
