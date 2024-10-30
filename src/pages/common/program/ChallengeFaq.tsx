import { useGetChallengeFaq } from '@/api/challenge';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';
import { twJoin } from 'tailwind-merge';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

function ChallengeFaq() {
  const { id } = useParams();

  const [selectedIndex, setSelectedIndex] = useState(0);

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
      <div className="mb-8 flex items-center gap-x-2.5 gap-y-3">
        {categoryList?.map((category, index) => (
          <FaqCategory
            key={category}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            {category}
          </FaqCategory>
        ))}
      </div>

      <div>
        {faqList.map((faq) => (
          <div key={faq.id}></div>
        ))}
      </div>
      <div></div>
    </section>
  );
}

function FaqCategory({
  children,
  selected,
  onClick,
}: {
  children?: ReactNode;
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={twJoin(
        'cursor-pointer rounded-full border px-5 py-2 text-xxsmall12 font-semibold',
        selected
          ? 'border-[#A8E6FF] bg-[#EEFAFF] text-[#00A8EB]'
          : 'border-neutral-70 text-neutral-45',
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default ChallengeFaq;
