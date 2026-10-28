import { useParams } from 'react-router-dom';

import { useOneTimeFormApplicationsQuery } from '@/api/one-time-form/oneTimeFormQueries';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

import ApplicantTable from '../ui/ApplicantTable';

/** `/one-time-form/:formId/applications` */
const OneTimeFormApplicantsPage = () => {
  const formId = Number(useParams<{ formId: string }>().formId);
  const { data, isLoading, isError } = useOneTimeFormApplicationsQuery(formId);

  return (
    <div className="mx-6 mb-40 mt-6">
      <Header>
        <Heading>{data ? `${data.form.title} 신청자` : '신청자 목록'}</Heading>
      </Header>
      <main className="mt-6">
        {isError ? (
          <div className="py-4 text-center">
            신청자 목록을 불러오지 못했습니다.
          </div>
        ) : (
          <ApplicantTable
            formId={formId}
            applications={data?.applications ?? []}
            loading={isLoading}
          />
        )}
      </main>
    </div>
  );
};

export default OneTimeFormApplicantsPage;
