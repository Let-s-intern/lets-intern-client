import { useGetReportFaqs } from '@/api/report';
import { ReportColors } from '@/types/interface';
import FaqChat from '../ui/FaqChat';
import FaqDropdown from '../ui/FaqDropdown';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

const SUB_HEADER = '자주 묻는 질문';
const MAIN_HEADER = '궁금한 점이 있으신가요?';

interface ReportFaqSectionProps {
  colors: ReportColors;
  reportId: number | string;
}

const ReportFaqSection = ({ colors, reportId }: ReportFaqSectionProps) => {
  const SUB_HEADER_STYLE = {
    color: colors.primary.DEFAULT,
  };

  const { data } = useGetReportFaqs(reportId);

  return (
    <section className="w-full px-5 pb-16 md:pb-32 md:pt-24 lg:px-0">
      <header>
        <SubHeader className="mb-2 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="mx-auto mt-10 md:mt-20">
        <div className="mx-auto mb-10 flex max-w-[800px] flex-col gap-3 md:mb-16">
          {data?.faqList.map((faq) => <FaqDropdown key={faq.id} faq={faq} />)}
        </div>
        <FaqChat />
      </main>
    </section>
  );
};

export default ReportFaqSection;
