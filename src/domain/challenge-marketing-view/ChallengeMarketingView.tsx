import ChallengeBasicInfoSection from '@/domain/challenge-marketing-view/challenge/ChallengeBasicInfoSection';
import ChallengeRecruitmentInfoSection from '@/domain/challenge-marketing-view/challenge/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@/domain/challenge-marketing-view/challenge/ChallengeTabNavigation';
import MarketingCurriculumSection from '@/domain/challenge-marketing-view/marketing/MarketingCurriculumSection';
import MarketingDifferentiatorsSection from '@/domain/challenge-marketing-view/marketing/MarketingDifferentiatorsSection';
import MarketingPricingSection from '@/domain/challenge-marketing-view/marketing/MarketingPricingSection';
import MarketingSummarySection from '@/domain/challenge-marketing-view/marketing/MarketingSummarySection';
import { ChallengeIdPrimitive } from '@/schema';
import MarketingApplicationStrategySection from './marketing/MarketingApplicationStrategySection';
import MarketingChallengeCalendar from './marketing/MarketingChallengeCalendar';
import MarketingFAQSection from './marketing/MarketingFAQSection';
import MarketingFeaturesSection from './marketing/MarketingFeaturesSection';
import MarketingIntroSection from './marketing/MarketingIntroSection';
import MarketingReviewsSection from './marketing/MarketingReviewsSection';

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
