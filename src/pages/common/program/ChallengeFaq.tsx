import { ReactNode, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { twJoin } from 'tailwind-merge';

import { useGetChallengeFaq } from '@/api/challenge';
import { Faq } from '@/schema';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';

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

      <div className="mb-10 flex flex-col gap-3">
        {faqList.map((faq) => {
          if (faq.category === categoryList[selectedIndex])
            return <FaqCard key={faq.id} faq={faq} />;
        })}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-md bg-neutral-95 px-8 py-4">
        <span className="text-xsmall14 font-semibold text-neutral-35">
          아직 궁금증이 풀리이 않았다면?
        </span>
        <button className="rounded-sm border border-neutral-70 bg-white px-5 py-3">
          1:1 채팅 문의하기
        </button>
      </div>
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

function FaqCard({ faq }: { faq: Faq }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      key={faq.id}
      className="overflow-hidden rounded-xxs border border-neutral-80"
    >
      <div className="flex items-center justify-between bg-neutral-100 px-4 py-5">
        <span className="text-xsmall14 font-semibold text-neutral-0">
          {faq.question}
        </span>
        <IoIosArrowDown
          className={twJoin('cursor-pointer', isOpen && 'rotate-180')}
          size={24}
          color="#7A7D84"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="border-t border-neutral-80 px-5 py-3 text-xxsmall12 text-neutral-35">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default ChallengeFaq;
