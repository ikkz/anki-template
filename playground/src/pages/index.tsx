import { Previewer } from '../components/previewer';
import { TemplateSelector } from '../components/template-selector';
import { useTemplate } from '../hooks/use-template';

const IndexPage = () => {
  const [template] = useTemplate();
  return (
    <div className="md:flex h-full">
      <div className="md:w-[400px] md:border-r p-6">
        <TemplateSelector />
      </div>
      <div className="md:flex-1">
        {template ? (
          <Previewer template={template} />
        ) : (
          <div className="md:h-full flex md:items-center justify-center">
            Click a template in the list to preview
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexPage;
