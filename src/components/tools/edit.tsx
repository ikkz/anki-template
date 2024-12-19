import { Button } from '../button';
import { Input } from '../input';
import { Tool } from '@/store/tools';
import * as t from 'at/i18n';
import { FC, useState } from 'react';

export const ToolEdit: FC<{
  initialTool: Tool;
  onSave: (tool: Tool) => void;
  onCancel: () => void;
}> = ({ initialTool, onSave, onCancel }) => {
  const [tool, setTool] = useState(initialTool);

  return (
    <>
      <Input
        title={t.name}
        value={tool.name}
        onChange={(value) =>
          setTool((prevTool) => ({
            ...prevTool,
            name: value,
          }))
        }
        className="mt-2"
      />
      <Input
        title={t.url}
        value={tool.url}
        onChange={(value) =>
          setTool((prevTool) => ({
            ...prevTool,
            url: value,
          }))
        }
        className="mt-2"
      />
      <Input
        title={t.prefixText}
        value={tool.prefixText}
        onChange={(value) =>
          setTool((prevTool) => ({
            ...prevTool,
            prefixText: value,
          }))
        }
        className="mt-2"
      />
      <Input
        title={t.suffixText}
        value={tool.suffixText}
        onChange={(value) =>
          setTool((prevTool) => ({
            ...prevTool,
            suffixText: value,
          }))
        }
        className="mt-2"
      />
      <div className="flex justify-end gap-x-2 mt-2">
        <Button onClick={() => onCancel()}>{t.cancel}</Button>
        <Button onClick={() => onSave(tool)}>{t.save}</Button>
      </div>
    </>
  );
};
