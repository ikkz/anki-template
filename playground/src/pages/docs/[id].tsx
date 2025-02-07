import { Header } from '../../components/header';
import { useRequest } from 'ahooks';
import { Spin } from 'antd';
import { useParams } from 'react-router';

export default () => {
  const params = useParams<{ id: string }>();
  const { data: md, loading } = useRequest(
    async () => {
      const res = await import(`../../../../docs/${params.id}.md`);
      return res.html;
    },
    {
      refreshDeps: [params.id],
    },
  );

  return (
    <div className="p-4 max-w-[700px] mx-auto">
      <Header />
      {loading ? (
        <Spin className="flex items-center justify-center" />
      ) : (
        <div
          className="prose prose-sm"
          dangerouslySetInnerHTML={{ __html: md }}
        />
      )}
    </div>
  );
};
