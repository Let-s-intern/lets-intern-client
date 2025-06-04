import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import React from 'react';
import BenefitList from './BenefitList';
import ChallengePriceInfoWithContent from './ChallengePriceInfo';
import ChallengeSchedule from './ChallengeSchedule';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeBasicInfoSection: React.FC<Props> = ({ challenge }) => {
  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pb-10 pt-6 md:px-0 md:py-[60px]">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-[22px]">
        {/* 썸네일 */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-blue-500">
          <Image
            src={challenge.thumbnail ?? ''}
            alt={`${challenge.title} 썸네일`}
            fill={true}
            priority
          />
        </div>

        {/* 챌린지 정보 */}
        <div className="w-full md:max-w-[424px]">
          <h1 className="mb-2 py-1 text-medium22 font-bold text-neutral-0 md:text-medium24">
            {challenge.title}
          </h1>

          <ChallengePriceInfoWithContent
            priceInfoList={challenge.priceInfo}
            content={<BenefitList challengeType={challenge.challengeType} />}
          />
        </div>
      </div>

      {/* 일정 정보 */}
      <div className="mt-6 flex flex-col md:mt-5 md:flex-row md:gap-3">
        <ChallengeSchedule challenge={challenge} />
      </div>
    </div>
  );
};

export default ChallengeBasicInfoSection;
