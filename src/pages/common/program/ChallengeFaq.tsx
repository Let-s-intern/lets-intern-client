import { useGetChallengeFaq } from '@/api/challenge';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { useParams } from 'react-router-dom';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

function ChallengeFaq() {
  const { id } = useParams();
  const { data } = useGetChallengeFaq(id ?? '');

  const faqList = data?.faqList;
  const categoryList = [...new Set(faqList?.map((faq) => faq.category))];

  if (!faqList) return <></>;

  return (
    <section id="faq">
      <SuperTitle className="mb-6 text-neutral-45">FAQ</SuperTitle>
      <SuperTitle className="text-[#00A8EB]">{superTitle}</SuperTitle>
      <Heading2 className="mb-10">{title}</Heading2>
      {/* 카테고리 */}
      <div>
        {categoryList?.map((category) => <div key={category}>{category}</div>)}
      </div>
      <div></div>
      <div></div>
    </section>
  );
}

export default ChallengeFaq;
