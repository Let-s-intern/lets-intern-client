import ChallengeRecruitmentInfoSection from '@/domain/challenge/challenge-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@/domain/challenge/challenge-view/ChallengeTabNavigation';
import MarketingCurriculumSection from '@/domain/challenge/marketing-view/MarketingCurriculumSection';
import MarketingDifferentiatorsSection from '@/domain/challenge/marketing-view/MarketingDifferentiatorsSection';
import MarketingPricingSection from '@/domain/challenge/marketing-view/MarketingPricingSection';
import MarketingSummarySection from '@/domain/challenge/marketing-view/MarketingSummarySection';
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
