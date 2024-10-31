import { useParams } from 'react-router-dom';

import { useGetLiveFaq } from '@/api/program';
import { FaqCard } from '@components/challenge-view/ChallengeFaq';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

function LiveFaq() {
  const { id } = useParams();

  const { data } = useGetLiveFaq(id ?? '');

  const faqList = data?.faqList;

  if (!faqList) return <></>;

  return (
    <section id="faq" className="lg:flex lg:flex-col lg:items-center">
      <SuperTitle className="mb-6 text-neutral-45 lg:mb-12">FAQ</SuperTitle>
      <SuperTitle className="text-primary">{superTitle}</SuperTitle>
      <Heading2 className="mb-10 lg:mb-20">{title}</Heading2>

      <div className="mb-10 flex flex-col gap-3 lg:mb-24 lg:w-full lg:max-w-[800px]">
        {faqList.map((faq) => (
          <FaqCard key={faq.id} faq={faq} />
        ))}
      </div>
    </section>
  );
}

export default LiveFaq;
