import { ChallengeIdPrimitive } from '@/schema';
import ChallengeBasicInfoSection from '@components/common/challenge-marketing-view/ChallengeBasicInfoSection';
import ChallengeRecruitmentInfoSection from '@components/common/challenge-marketing-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@components/common/challenge-marketing-view/ChallengeTabNavigation';
import MarketingCurriculumSection from '@components/common/challenge-marketing-view/MarketingCurriculumSection';
import MarketingDifferentiatorsSection from '@components/common/challenge-marketing-view/MarketingDifferentiatorsSection';
import MarketingPricingSection from '@components/common/challenge-marketing-view/MarketingPricingSection';
import MarketingSummarySection from '@components/common/challenge-marketing-view/MarketingSummarySection';
import MarketingApplicationStrategySection from './common/challenge-marketing-view/MarketingApplicationStrategySection';
import MarketingBenefitsSection from './common/challenge-marketing-view/MarketingBenefitsSection';
import MarketingChallengeCalendar from './common/challenge-marketing-view/MarketingChallengeCalendar';
import MarketingFAQSection from './common/challenge-marketing-view/MarketingFAQSection';
import MarketingFeaturesSection from './common/challenge-marketing-view/MarketingFeaturesSection';
import MarketingIntroSection from './common/challenge-marketing-view/MarketingIntroSection';
import MarketingReviewsSection from './common/challenge-marketing-view/MarketingReviewsSection';

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
      <MarketingBenefitsSection />
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
