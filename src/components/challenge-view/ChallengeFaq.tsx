import { twMerge } from '@/lib/twMerge';
import { ReactNode, useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { useParams } from 'react-router-dom';

import { useGetChallengeFaq } from '@/api/challenge';
import channelService from '@/ChannelService';
import { Faq } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import { ChallengeColor } from '@components/ChallengeView';
import Heading2 from '@components/common/program/program-detail/Heading2';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import { PROGRAM_FAQ_ID } from '@components/ProgramDetailNavigation';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

interface ChallengeFaqProps {
  colors: ChallengeColor;
  faqCategory: ChallengeContent['faqCategory'];
}

function ChallengeFaq({ colors, faqCategory }: ChallengeFaqProps) {
  const { id } = useParams();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data } = useGetChallengeFaq(id ?? '');

  const faqList = data?.faqList;
  const categoryList = [...new Set(faqCategory)];

  return (
    <section
      id={PROGRAM_FAQ_ID}
      className="challenge_faq flex w-full max-w-[1000px] flex-col px-5 py-20 pt-20 md:items-center md:px-10 md:py-40 lg:px-0"
    >
      <SuperTitle
        className="mb-6 text-neutral-45 md:mb-12"
        style={{ color: colors.primary }}
      >
        FAQ
      </SuperTitle>
      <SuperTitle className="mb-3" style={{ color: colors.primary }}>
        {superTitle}
      </SuperTitle>
      <Heading2 className="mb-10 md:mb-20">{title}</Heading2>

      {/* 카테고리 */}
      <div className="mb-8 flex items-center gap-x-2.5 gap-y-3 md:mb-20">
        {categoryList?.map((category, index) => (
          <FaqCategory
            key={category}
            colors={colors}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            {category}
          </FaqCategory>
        ))}
      </div>

      <div className="mb-10 flex flex-col gap-3 md:mb-24 md:w-full md:max-w-[800px]">
        {faqList?.map((faq) => {
          if (faq.category === categoryList[selectedIndex])
            return <FaqCard key={faq.id} faq={faq} />;
        })}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-md bg-neutral-95 px-8 py-4 md:w-full md:max-w-[800px] md:flex-row md:items-center md:justify-between">
        <span className="text-xsmall14 font-semibold text-neutral-35 md:text-small20">
          아직 궁금증이 풀리지 않았다면?
        </span>
        <button
          className="rounded-sm border border-neutral-70 bg-white px-5 py-3 text-xsmall14 font-medium md:px-6 md:text-small18"
          onClick={() => channelService.showMessenger()}
        >
          1:1 채팅 문의하기
        </button>
      </div>
    </section>
  );
}

function FaqCategory({
  colors,
  children,
  selected,
  onClick,
}: {
  colors: ChallengeColor;
  children?: ReactNode;
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={twMerge(
        'min-w-16 cursor-pointer rounded-full border border-neutral-70 px-5 py-2 text-center text-xxsmall12 font-semibold text-neutral-45 md:min-w-36 md:py-4 md:text-medium22',
      )}
      style={
        selected
          ? {
              borderColor: colors.primary,
              backgroundColor: colors.primaryLight,
              color: colors.primary,
            }
          : {}
      }
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
        <span className="text-xsmall14 font-semibold text-neutral-0 md:text-medium22">
          {faq.question}
        </span>
        <IoIosArrowDown
          className={twMerge('cursor-pointer', isOpen && 'rotate-180')}
          size={24}
          color="#7A7D84"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="border-t border-neutral-80 px-5 py-3 text-xxsmall12 text-neutral-35 md:text-small18">
          {faq.answer}
        </div>
      )}
    </div>
  );
}

export default ChallengeFaq;
