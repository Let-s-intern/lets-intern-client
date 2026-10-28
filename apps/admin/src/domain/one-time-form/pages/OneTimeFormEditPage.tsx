import { useParams } from 'react-router-dom';

import { useOneTimeFormDetailQuery } from '@/api/one-time-form/oneTimeFormQueries';
import LoadingContainer from '@/common/loading/LoadingContainer';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

import OneTimeFormEditor from '../ui/OneTimeFormEditor';

/** `/one-time-form/:formId/edit` 의 수정 화면. 상세를 받은 뒤 편집기를 그린다 */
const EditOneTimeForm = ({ formId }: { formId: number }) => {
  const { data, isError } = useOneTimeFormDetailQuery(formId);

  if (isError) {
    return <div className="py-4 text-center">폼을 불러오지 못했습니다.</div>;
  }
  if (!data) return <LoadingContainer className="mt-[20%]" />;
  return <OneTimeFormEditor detail={data} />;
};

/** `/one-time-form/new` 와 `/one-time-form/:formId/edit` */
const OneTimeFormEditPage = () => {
  const { formId } = useParams<{ formId: string }>();
  const isNew = formId === undefined;

  return (
    <div className="mx-6 mb-40 mt-6">
      <Header>
        <Heading>{isNew ? '폼 만들기' : '폼 수정'}</Heading>
      </Header>
      <main className="mt-6">
        {/* 만든 뒤 수정 화면으로 옮겨 가면 입력 상태를 새로 잡는다 */}
        {isNew ? (
          <OneTimeFormEditor key="new" />
        ) : (
          <EditOneTimeForm key={formId} formId={Number(formId)} />
        )}
      </main>
    </div>
  );
};

export default OneTimeFormEditPage;
