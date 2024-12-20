import { ReportColors } from '@/types/interface';
import MainHeader from './MainHeader';
import SubHeader from './SubHeader';

const SUB_HEADER = '자주 묻는 질문';
const MAIN_HEADER = '궁금한 점이 있으신가요?';

interface ReportFaqSectionProps {
  colors: ReportColors;
}

const ReportFaqSection = ({ colors }: ReportFaqSectionProps) => {
  const SUB_HEADER_STYLE = {
    color: colors.primary.DEFAULT,
  };

  return (
    <section className="w-full px-5 pb-16 md:pb-32 md:pt-24 lg:px-0">
      <header>
        <SubHeader className="mb-2 md:mb-3" style={SUB_HEADER_STYLE}>
          {SUB_HEADER}
        </SubHeader>
        <MainHeader>{MAIN_HEADER}</MainHeader>
      </header>

      <main className="mx-auto mt-10 flex max-w-[690px] flex-col items-center gap-5 md:mt-11 md:gap-8"></main>
    </section>
  );
};

export default ReportFaqSection;
