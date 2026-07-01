import { ReportType, reportFaqsQueryOptions } from '@/api/report';
import {
  personalStatementColors,
  resumeColors,
} from '@/domain/report/reportColors';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import FaqDropdown from '@/common/dropdown/FaqDropdown';
import FaqChat from '@/domain/faq/FaqChat';
import MainHeader from '@/domain/report/ui/header/MainHeader';
import SubHeader from '@/domain/report/ui/header/SubHeader';
import { useSuspenseQuery } from '@tanstack/react-query';

const SUB_HEADER = '자주 묻는 질문';
const MAIN_HEADER = '궁금한 점이 있으신가요?';

interface ReportFaqSectionProps {
  reportType: ReportType;
  reportId: number | string;
}

const ReportFaqSection = ({ reportType, reportId }: ReportFaqSectionProps) => {
  const subHeaderStyle = {
    color:
      reportType === 'PERSONAL_STATEMENT'
        ? personalStatementColors.C34AFF
        : resumeColors._11AC5C,
  };

  return (
    <section
      data-section="faq"
      className="w-full px-5 pb-16 md:pb-32 md:pt-24 lg:px-0"
    >
      <div>
        <SubHeader className="mb-2 md:mb-3" style={subHeaderStyle}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </div>

      <main className="mx-auto mt-10 md:mt-20">
        <div className="mx-auto mb-10 flex max-w-[800px] flex-col gap-3 md:mb-16">
          <AsyncBoundary pendingFallback={null}>
            <ReportFaqList reportId={reportId} />
          </AsyncBoundary>
        </div>
        <FaqChat />
      </main>
    </section>
  );
};

function ReportFaqList({ reportId }: { reportId: number | string }) {
  const { data } = useSuspenseQuery(reportFaqsQueryOptions(reportId));

  return (
    <>
      {data.faqList.map((faq) => (
        <FaqDropdown key={faq.id} faq={faq} />
      ))}
    </>
  );
}

export default ReportFaqSection;
