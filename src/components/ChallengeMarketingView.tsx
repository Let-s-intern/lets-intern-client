import { ChallengeIdPrimitive } from '@/schema';
import ChallengeBasicInfoSection from '@components/common/challenge-marketing-view/ChallengeBasicInfoSection';
import ChallengeRecruitmentInfoSection from '@components/common/challenge-marketing-view/ChallengeRecruitmentInfoSection';
import ChallengeTabNavigation from '@components/common/challenge-marketing-view/ChallengeTabNavigation';
import MarketingCurriculumSection from '@components/common/challenge-marketing-view/MarketingCurriculumSection';
import MarketingDifferentiatorsSection from '@components/common/challenge-marketing-view/MarketingDifferentiatorsSection';
import MarketingPricingSection from '@components/common/challenge-marketing-view/MarketingPricingSection';
import MarketingBenefitsSection from './common/challenge-marketing-view/MarketingBenefitsSection';
import MarketingFeaturesSection from './common/challenge-marketing-view/MarketingFeaturesSection';
import MarketingIntroSection from './common/challenge-marketing-view/MarketingIntroSection';

// 사용할 일 없을 것 같지만.. (임시입니다)
export const marketingColors = {
  _4A76FF: '#4A76FF',
  E9EEFF: '#E9EEFF',
  DDF2FF: '#DDF2FF',
  _2CB2FF: '#2CB2FF',
  _7FDDFF: '#7FDDFF',
  _7395FF: '#7395FF',
  _8FAAFF: '#8FAAFF',
  _132356: '#132356',
  F0F4FF: '#F0F4FF',
  E9F6EF: '#E9F6EF',
  E9F4FF: '#E9F4FF',
  _0C1737: '#0C1737',
  FF984A: '#FF984A',
  _65C065: '#65C065',
  F1F4FF: '#F1F4FF',
  EEEEEE: '#EEEEEE',
  _14BCFF: '#14BCFF',
  _20304F: '#20304F',
};

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
      <MarketingPricingSection priceInfoList={challenge.priceInfo} />
      <ChallengeRecruitmentInfoSection challenge={challenge} />
    </div>
  );
};

export default ChallengeMarketingView;
