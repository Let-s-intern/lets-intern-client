import { Link, useParams } from 'react-router-dom';

import { useOneTimeFormApplicationQuery } from '@/api/one-time-form/oneTimeFormQueries';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

import ApplicationAccountSection from '../ui/ApplicationAccountSection';
import ApplicationAnswersSection from '../ui/ApplicationAnswersSection';
import ApplicationInflowSection from '../ui/ApplicationInflowSection';
import ApplicationInfoSection from '../ui/ApplicationInfoSection';
import ApplicationPaymentSection from '../ui/ApplicationPaymentSection';

/** `/one-time-form/:formId/applications/:applicationId` */
const OneTimeFormApplicationDetailPage = () => {
  const params = useParams<{ formId: string; applicationId: string }>();
  const applicationId = Number(params.applicationId);
  const { data, isLoading, isError } =
    useOneTimeFormApplicationQuery(applicationId);

  return (
    <div className="mx-6 mb-40 mt-6">
      <Link
        to={`/one-time-form/${params.formId}/applications`}
        className="text-xsmall14 text-neutral-40 mb-2 inline-block underline"
      >
        신청자 목록으로
      </Link>
      <Header>
        <div className="flex flex-col gap-1">
          <Heading>
            {data ? `${data.application.name} 신청 상세` : '신청 상세'}
          </Heading>
          {data && (
            <p className="text-xsmall14 text-neutral-40">{data.form.title}</p>
          )}
        </div>
      </Header>
      <main className="mt-6 flex max-w-4xl flex-col gap-6">
        {isError ? (
          <p className="py-4 text-center">신청 정보를 불러오지 못했습니다.</p>
        ) : isLoading || !data ? (
          <p className="text-neutral-40 py-4 text-center">불러오는 중입니다.</p>
        ) : (
          <>
            <ApplicationInfoSection application={data.application} />
            <ApplicationPaymentSection
              formId={data.form.formId}
              application={data.application}
            />
            <ApplicationAccountSection user={data.application.user} />
            <ApplicationInflowSection application={data.application} />
            <ApplicationAnswersSection
              applicationId={applicationId}
              questions={data.questions}
              answers={data.application.answers}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default OneTimeFormApplicationDetailPage;
