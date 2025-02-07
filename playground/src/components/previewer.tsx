import {
  BuildJson,
  BUILTIN_FIELDS,
} from '../../../build/plugins/generate-template';
import { renderTemplate } from '../../../build/utils';
import hostPage from '../../../e2e/index.html?raw';
import { useRequest } from 'ahooks';
import { Button, Spin } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';

// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

declare global {
  interface Window {
    e2eAnki: {
      clean(): void;
      flipToBack(): void;
      render(html: string): void;
    };
  }
}

export const Previewer: FC<{ template: string }> = ({ template }) => {
  const { data, loading } = useRequest(
    () =>
      Promise.all([
        fetch(`/builds/${template}/front.html`).then((res) => res.text()),
        fetch(`/builds/${template}/back.html`).then((res) => res.text()),
        fetch(`/builds/${template}/build.json`).then(
          (res) => res.json() as Promise<BuildJson>,
        ),
      ]),
    {
      refreshDeps: [template],
    },
  );

  if (loading || !data) {
    return <Spin className="h-full flex items-center justify-center" />;
  }

  const [front, back, build] = data;

  return (
    <PreviewerFrame key={template} build={build} front={front} back={back} />
  );
};

const PreviewerFrame: FC<{ build: BuildJson; front: string; back: string }> = ({
  build,
  front,
  back,
}) => {
  const iframe = useRef<HTMLIFrameElement>(null);
  const flipCallback = useRef<() => void>();
  const [fields] = useState<Record<string, string>>(
    build.notes[0].fields as Record<string, string>,
  );
  const fieldsInDrawer = useRef(fields);

  useEffect(() => {
    const page = iframe.current?.contentWindow;
    if (!page) {
      return;
    }
    const render = () => {
      page.localStorage.clear();
      page.sessionStorage.clear();
      page.localStorage.setItem(`at:${build.config.entry}:hideAbout`, 'true');
      const renderFields = Object.assign(
        {},
        Object.fromEntries(
          [...build.fields, ...BUILTIN_FIELDS].map((k) => [k, '']),
        ),
        build.notes[0].fields,
        fields,
      );
      const frontHtml = renderTemplate(front, renderFields);
      const backHtml = renderTemplate(back, {
        ...renderFields,
        FrontSide: frontHtml,
      });
      page.e2eAnki.render(frontHtml);
      page.e2eAnki.flipToBack = () => {
        requestAnimationFrame(() => {
          page.e2eAnki.render(backHtml);
          setTimeout(() => {
            page.document
              .getElementById('answer')
              ?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
        });
      };
      flipCallback.current = page.e2eAnki.flipToBack;
    };
    const requestRender = () => {
      if (page.e2eAnki) {
        render();
      } else {
        requestAnimationFrame(requestRender);
      }
    };
    requestAnimationFrame(requestRender);
  }, [front, back, fields]);

  const [, setShowFields] = useState(false);
  const toggleDrawer = () => setShowFields((prev) => !prev);
  return (
    <div className="h-screen md:h-full relative group">
      <iframe
        key={build.config.name}
        srcDoc={hostPage}
        className="border-none h-full w-full"
        ref={iframe}
      />
      <div className="absolute top-0 md:-translate-y-full group-hover:translate-y-0 transition-transform pointer-events-none w-full flex justify-center">
        <div className="pointer-events-auto bg-white shadow md:shadow-none group-hover:shadow p-1 rounded-b">
          <Button type="text" onClick={() => flipCallback.current?.()}>
            Flip
          </Button>
          <Button
            type="text"
            target="_blank"
            href={`/docs/${build.config.entry}`}
          >
            Docs
          </Button>
          {build.config.field === undefined ? (
            <Button
              type="text"
              onClick={() => {
                fieldsInDrawer.current = fields;
                toggleDrawer();
              }}
            >
              Edit
            </Button>
          ) : null}
          {/* <Drawer */}
          {/*   open={showFields} */}
          {/*   closable */}
          {/*   destroyOnClose */}
          {/*   onClose={toggleDrawer} */}
          {/*   title="Edit fields" */}
          {/*   placement="right" */}
          {/*   size="large" */}
          {/*   extra={ */}
          {/*     <Button */}
          {/*       type="primary" */}
          {/*       onClick={() => { */}
          {/*         setFields({ ...fieldsInDrawer.current }); */}
          {/*         toggleDrawer(); */}
          {/*       }} */}
          {/*     > */}
          {/*       Ok */}
          {/*     </Button> */}
          {/*   } */}
          {/* > */}
          {/*   {build.fields.map((field) => ( */}
          {/*     <div key={field} className="mb-4"> */}
          {/*       <div className="text-lg font-bold mb-1">{field}</div> */}
          {/*       <ReactQuill */}
          {/*         defaultValue={fieldsInDrawer.current[field]} */}
          {/*         onChange={(value) => { */}
          {/*           Object.assign(fieldsInDrawer.current, { [field]: value }); */}
          {/*         }} */}
          {/*       /> */}
          {/*     </div> */}
          {/*   ))} */}
          {/* </Drawer> */}
        </div>
      </div>
    </div>
  );
};
