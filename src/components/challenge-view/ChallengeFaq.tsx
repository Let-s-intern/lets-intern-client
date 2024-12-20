import { twMerge } from '@/lib/twMerge';
import { ReactNode, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGetChallengeFaq } from '@/api/challenge';
import { ChallengeColor } from '@components/ChallengeView';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import FaqChat from '@components/common/ui/FaqChat';
import FaqDropdown from '@components/common/ui/FaqDropdown';
import Heading2 from '@components/common/ui/Heading2';
import { PROGRAM_FAQ_ID } from '@components/ProgramDetailNavigation';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

interface ChallengeFaqProps {
  colors: ChallengeColor;
}

function ChallengeFaq({ colors }: ChallengeFaqProps) {
  const { id } = useParams();

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data } = useGetChallengeFaq(id ?? '');

  const faqList = data?.faqList;
  const categoryList = [...new Set(faqList?.map((faq) => faq.category))];

  if (!faqList) return <></>;

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
        {faqList.map((faq) => {
          if (faq.category === categoryList[selectedIndex])
            return <FaqDropdown key={faq.id} faq={faq} />;
        })}
      </div>
      <FaqChat />
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

export default ChallengeFaq;
