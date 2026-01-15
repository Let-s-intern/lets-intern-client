import { ReportType, useGetReportFaqs } from '@/api/report';
import { personalStatementColors } from '@/domain/report/ReportPersonalStatementPage';
import { resumeColors } from '@/domain/report/ReportResumePage';
import FaqDropdown from '../../common/dropdown/FaqDropdown';
import FaqChat from '../../common/faq/FaqChat';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

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

  const { data } = useGetReportFaqs(reportId);

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
          {data?.faqList.map((faq) => (
            <FaqDropdown key={faq.id} faq={faq} />
          ))}
        </div>
        <FaqChat />
      </main>
    </section>
  );
};

export default ReportFaqSection;
