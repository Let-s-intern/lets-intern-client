import { ChallengeIdPrimitive } from '@/schema';
import React from 'react';
import MarketingIntroSection from './common/challenge-marketing-view/MarketingIntroSection';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeMarketingView: React.FC<Props> = ({ challenge }) => {
  return (
    <>
      <MarketingIntroSection />
    </>
  );
};

export default ChallengeMarketingView;
