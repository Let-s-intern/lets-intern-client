import { ChallengeIdPrimitive } from '@/schema';
import MarketingBenefitsSection from '@components/common/challenge-marketing-view/MarketingBenefitsSection';
import MarketingDifferentiatorsSection from '@components/common/challenge-marketing-view/MarketingDifferentiatorsSection';
import MarketingFeaturesSection from '@components/common/challenge-marketing-view/MarketingFeaturesSection';
import MarketingIntroSection from '@components/common/challenge-marketing-view/MarketingIntroSection';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeMarketingView = ({ challenge }: Props) => {
  return (
    <div className="w-full">
      <MarketingIntroSection />
      <MarketingFeaturesSection />
      <MarketingDifferentiatorsSection />
      <MarketingBenefitsSection />
    </div>
  );
};

export default ChallengeMarketingView;
