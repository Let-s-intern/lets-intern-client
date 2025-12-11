import { challengeColors } from '@/domain/program/challenge/ChallengeView';
import { twMerge } from '@/lib/twMerge';
import { ChallengeType, challengeTypeSchema, faqSchemaType } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import SuperTitle from '@components/common/program/program-detail/SuperTitle';
import FaqChat from '@components/common/ui/FaqChat';
import FaqDropdown from '@components/common/ui/FaqDropdown';
import Heading2 from '@components/common/ui/Heading2';
import { CSSProperties, ReactNode, useMemo, useState } from 'react';
import { PROGRAM_FAQ_ID } from '../../ProgramDetailNavigation';

const superTitle = '자주 묻는 질문';
const title = '궁금한 점이 있으신가요?';

const { PORTFOLIO, CAREER_START, ETC, EXPERIENCE_SUMMARY } =
  challengeTypeSchema.enum;

interface ChallengeFaqProps {
  faqData?: faqSchemaType;
  faqCategory: ChallengeContent['faqCategory'];
  challengeType: ChallengeType;
}

function ChallengeFaq({
  faqData,
  faqCategory,
  challengeType,
}: ChallengeFaqProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const faqList = faqData?.faqList;
  const categoryList = [...new Set(faqCategory)];

  const styles = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return {
          primaryColor: challengeColors._4D55F5,
          primaryLightColor: challengeColors.F3F4FF,
          borderColor: challengeColors.B8BBFB,
        };
      case PORTFOLIO:
        return {
          primaryColor: challengeColors._4A76FF,
          primaryLightColor: challengeColors.F0F4FF,
          borderColor: challengeColors.ADC3FF,
        };
      case EXPERIENCE_SUMMARY:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC8BC,
        };
      case ETC:
        return {
          primaryColor: challengeColors.F26646,
          primaryLightColor: challengeColors.FFF6F4,
          borderColor: challengeColors.FFC8BC,
        };
      // 자소서, 대기업, 마케팅
      default:
        return {
          primaryColor: challengeColors._14BCFF,
          primaryLightColor: challengeColors.EEFAFF,
          borderColor: challengeColors.A8E6FF,
        };
    }
  }, [challengeType]);

  if (!faqList) return <></>;

  return (
    <section
      id={PROGRAM_FAQ_ID}
      className="challenge_faq flex w-full max-w-[1000px] flex-col px-5 py-20 pt-20 md:items-center md:px-10 md:py-40 lg:px-0"
    >
      <SuperTitle
        className="mb-6 text-neutral-45 md:mb-12"
        style={{ color: styles.primaryColor }}
      >
        FAQ
      </SuperTitle>
      <SuperTitle className="mb-3" style={{ color: styles.primaryColor }}>
        {superTitle}
      </SuperTitle>
      <Heading2 className="mb-10 md:mb-20">{title}</Heading2>

      {/* 카테고리 */}
      <div className="mb-8 flex items-center gap-x-2.5 gap-y-3 md:mb-20">
        {categoryList?.map((category, index) => (
          <FaqCategory
            key={category}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
            selectedStyle={{
              borderColor: styles.borderColor,
              backgroundColor: styles.primaryLightColor,
              color: styles.primaryColor,
            }}
          >
            {category}
          </FaqCategory>
        ))}
      </div>

      <div className="mb-10 flex flex-col gap-3 md:mb-24 md:w-full md:max-w-[800px]">
        {faqList?.map((faq) => {
          if (faq.category === categoryList[selectedIndex])
            return <FaqDropdown key={faq.id} faq={faq} />;
        })}
      </div>
      <FaqChat />
    </section>
  );
}

function FaqCategory({
  children,
  selected,
  onClick,
  selectedStyle,
}: {
  children?: ReactNode;
  selected: boolean;
  onClick?: () => void;
  selectedStyle?: CSSProperties;
}) {
  return (
    <div
      className={twMerge(
        'min-w-16 cursor-pointer rounded-full border border-neutral-70 px-5 py-2 text-center text-xxsmall12 font-semibold text-neutral-45 md:min-w-36 md:py-4 md:text-medium22',
      )}
      style={selected ? selectedStyle : undefined}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default ChallengeFaq;
