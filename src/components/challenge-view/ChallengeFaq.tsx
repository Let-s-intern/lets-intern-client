import { ReactNode, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useParams } from 'react-router-dom';
import { twJoin } from 'tailwind-merge';

import { useGetChallengeFaq } from '@/api/challenge';
import channelService from '@/ChannelService';
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
    <section id="faq" className="lg:flex lg:flex-col lg:items-center">
      <SuperTitle className="mb-6 text-neutral-45 lg:mb-12">FAQ</SuperTitle>
      <SuperTitle className="text-[#00A8EB]">{superTitle}</SuperTitle>
      <Heading2 className="mb-10 lg:mb-20">{title}</Heading2>

      {/* 카테고리 */}
      <div className="mb-8 flex items-center gap-x-2.5 gap-y-3 lg:mb-20">
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

      <div className="mb-10 flex flex-col gap-3 lg:mb-24 lg:w-full lg:max-w-[800px]">
        {faqList.map((faq) => {
          if (faq.category === categoryList[selectedIndex])
            return <FaqCard key={faq.id} faq={faq} />;
        })}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-md bg-neutral-95 px-8 py-4 lg:w-full lg:max-w-[800px] lg:flex-row lg:items-center lg:justify-between">
        <span className="text-xsmall14 font-semibold text-neutral-35 lg:text-small20">
          아직 궁금증이 풀리이 않았다면?
        </span>
        <button
          className="rounded-sm border border-neutral-70 bg-white px-5 py-3 text-xsmall14 font-medium lg:px-6 lg:text-small18"
          onClick={() => channelService.showMessenger()}
        >
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
        'min-w-16 cursor-pointer rounded-full border px-5 py-2 text-center text-xxsmall12 font-semibold lg:min-w-36 lg:py-4 lg:text-medium22',
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

/* LiveFaq에서 함께 사용 */
export function FaqCard({ faq }: { faq: Faq }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      key={faq.id}
      className="overflow-hidden rounded-xxs border border-neutral-80"
    >
      <div className="flex items-center justify-between bg-neutral-100 p-5">
        <span className="text-xsmall14 font-semibold text-neutral-0 lg:text-medium22">
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
        <div className="border-t border-neutral-80 px-5 py-3 text-xxsmall12 text-neutral-35 lg:text-small18">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default ChallengeFaq;