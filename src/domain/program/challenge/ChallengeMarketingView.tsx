import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import ChallengeRecruitmentInfoSection from '@/domain/program/challenge/challenge-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import MarketingCurriculumSection from '@/domain/program/challenge/marketing-view/MarketingCurriculumSection';
import MarketingDifferentiatorsSection from '@/domain/program/challenge/marketing-view/MarketingDifferentiatorsSection';
import MarketingPricingSection from '@/domain/program/challenge/marketing-view/MarketingPricingSection';
import MarketingSummarySection from '@/domain/program/challenge/marketing-view/MarketingSummarySection';
import { parseChallengeContent } from '@/domain/program/challenge/utils/parseChallengeContent';
import { ChallengeIdPrimitive } from '@/schema';
import { useMemo } from 'react';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import FreeTemplateLayout from './challenge-view/FreeTemplateLayout';
import MarketingApplicationStrategySection from './marketing-view/MarketingApplicationStrategySection';
import MarketingChallengeCalendar from './marketing-view/MarketingChallengeCalendar';
import MarketingFAQSection from './marketing-view/MarketingFAQSection';
import MarketingFeaturesSection from './marketing-view/MarketingFeaturesSection';
import MarketingIntroReviewSection from './marketing-view/MarketingIntroReviewSection';
import MarketingIntroSection from './marketing-view/MarketingIntroSection';
import MarketingPlanSection from './marketing-view/MarketingPlanSection';
import MarketingReviewsSection from './marketing-view/MarketingReviewsSection';
import MarketingTimelineSection from './marketing-view/MarketingTimelineSection';
interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeMarketingView = ({ challenge }: Props) => {
  const content = useMemo(
    () => parseChallengeContent(challenge.desc),
    [challenge.desc],
  );
  const weekText = content?.challengePoint?.weekText ?? '4주';

  return (
    <div className="w-full">
      <ChallengeBasicInfoSection challenge={challenge} />
      {content?.isFreeTemplate ? (
        <FreeTemplateLayout freeContent={content.freeContent} />
      ) : (
        <>
          <ChallengeTabNavigation />
          <ChallengeIntroEditorContent challenge={challenge} />
          <MarketingIntroSection />
          <MarketingIntroReviewSection weekText={weekText} />
          <MarketingFeaturesSection weekText={weekText} />
          <MarketingDifferentiatorsSection
            lectures={content?.lectures}
            weekText={weekText}
          />
          <MarketingChallengeCalendar
            challenge={challenge}
            curriculumImage={content?.curriculumImage}
            lectureCount={content?.lectures?.length}
          />
          <MarketingCurriculumSection content={content} weekText={weekText} />
          <MarketingPlanSection />
          <MarketingTimelineSection />
          <MarketingReviewsSection challenge={challenge} />
          <MarketingApplicationStrategySection weekText={weekText} />
          <MarketingPricingSection priceInfoList={challenge.priceInfo} />
          <MarketingSummarySection weekText={weekText} />
          {/* 특별혜택 */}
          <MarketingFAQSection faqInfo={challenge.faqInfo} />
          <ChallengeRecruitmentInfoSection challenge={challenge} />
        </>
      )}
    </div>
  );
};

export default ChallengeMarketingView;
