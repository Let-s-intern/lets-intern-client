import { faqSchemaType } from '@/schema';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import FaqDropdown from '@components/common/ui/FaqDropdown';
import Heading2 from '@components/common/ui/Heading2';
import { LIVE_FAQ_ID } from '../../ProgramDetailNavigation';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

interface LiveFaqProps {
  faqData?: faqSchemaType;
}

function LiveFaq({ faqData }: LiveFaqProps) {
  const faqList = faqData?.faqList;

  if (!faqList) return <></>;

  return (
    <section
      id={LIVE_FAQ_ID}
      className="live-faq flex w-full max-w-[1000px] flex-col px-5 py-20 md:items-center md:px-10 md:py-40 lg:px-0"
    >
      <SuperTitle className="mb-6 text-primary md:mb-12">FAQ</SuperTitle>
      <SuperTitle className="text-primary">{superTitle}</SuperTitle>
      <Heading2 className="mb-10 md:mb-20">{title}</Heading2>

      <div className="flex flex-col gap-3 md:w-full md:max-w-[800px]">
        {faqList.map((faq) => (
          <FaqDropdown key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  );
}

export default LiveFaq;
