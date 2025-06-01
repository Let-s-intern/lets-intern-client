import { ChallengeIdPrimitive } from '@/schema';
import React from 'react';
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

const ChallengeMarketingView: React.FC<Props> = ({ challenge }) => {
  return (
    <>
      <MarketingIntroSection />
      <MarketingFeaturesSection />
    </>
  );
};

export default ChallengeMarketingView;
