import ChallengeRecruitmentInfoSection from '@/domain/program/challenge/challenge-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@/domain/program/challenge/challenge-view/ChallengeTabNavigation';
import ChallengeIntroEditorContent from '@/domain/program/challenge/challenge-view/ChallengeIntroEditorContent';
import MarketingCurriculumSection from '@/domain/program/challenge/marketing-view/MarketingCurriculumSection';
import MarketingDifferentiatorsSection from '@/domain/program/challenge/marketing-view/MarketingDifferentiatorsSection';
import MarketingPricingSection from '@/domain/program/challenge/marketing-view/MarketingPricingSection';
import MarketingSummarySection from '@/domain/program/challenge/marketing-view/MarketingSummarySection';
import { ChallengeIdPrimitive } from '@/schema';
import ChallengeBasicInfoSection from './challenge-view/ChallengeBasicInfoSection';
import MarketingApplicationStrategySection from './marketing-view/MarketingApplicationStrategySection';
import MarketingChallengeCalendar from './marketing-view/MarketingChallengeCalendar';
import MarketingFAQSection from './marketing-view/MarketingFAQSection';
import MarketingFeaturesSection from './marketing-view/MarketingFeaturesSection';
import MarketingIntroSection from './marketing-view/MarketingIntroSection';
import MarketingReviewsSection from './marketing-view/MarketingReviewsSection';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeMarketingView = ({ challenge }: Props) => {
  return (
    <div className="w-full">
      <ChallengeBasicInfoSection challenge={challenge} />
      <ChallengeTabNavigation />
      <ChallengeIntroEditorContent challenge={challenge} />
      <MarketingIntroSection />
      <MarketingFeaturesSection />
      <MarketingDifferentiatorsSection />
      <MarketingCurriculumSection />
      <MarketingChallengeCalendar challenge={challenge} />
      <MarketingSummarySection />
      <MarketingApplicationStrategySection />
      <MarketingPricingSection priceInfoList={challenge.priceInfo} />
      <MarketingReviewsSection challenge={challenge} />
      <MarketingFAQSection faqInfo={challenge.faqInfo} />
      <ChallengeRecruitmentInfoSection challenge={challenge} />
    </div>
  );
};

export default ChallengeMarketingView;
