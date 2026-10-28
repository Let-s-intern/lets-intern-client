import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';

import { useOneTimeFormApplicationsQuery } from '@/api/one-time-form/oneTimeFormQueries';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';

import ApplicantTable from '../ui/ApplicantTable';
import {
  getApplicationsCsvFileName,
  toApplicationsCsvRows,
  toCsvString,
} from '../utils/applicationsCsv';
import { saveCsvFile } from '../utils/saveCsvFile';

/** `/one-time-form/:formId/applications` */
const OneTimeFormApplicantsPage = () => {
  const formId = Number(useParams<{ formId: string }>().formId);
  const { data, isLoading, isError } = useOneTimeFormApplicationsQuery(formId);

  const canDownload = !isLoading && (data?.applications.length ?? 0) > 0;

  const downloadCsv = () => {
    saveCsvFile(
      getApplicationsCsvFileName(data.form.slug),
      toCsvString(toApplicationsCsvRows(data)),
    );
  };

  return (
    <div className="mx-6 mb-40 mt-6">
      <Header>
        <Heading>{data ? `${data.form.title} 신청자` : '신청자 목록'}</Heading>
        <Button
          variant="outlined"
          disabled={!canDownload}
          onClick={downloadCsv}
        >
          CSV 다운로드
        </Button>
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
