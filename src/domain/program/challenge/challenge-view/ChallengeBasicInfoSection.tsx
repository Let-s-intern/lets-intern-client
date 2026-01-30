import { ChallengeIdPrimitive } from '@/schema';
import Image from 'next/image';
import React from 'react';
import { getChallengeThemeColor } from '../utils/getChallengeThemeColor';
import ChallengePriceInfoContent from './ChallengePriceInfoContent';
import ChallengeSchedule from './ChallengeSchedule';

interface Props {
  challenge: ChallengeIdPrimitive;
}

const ChallengeBasicInfoSection: React.FC<Props> = ({ challenge }) => {
  const themeColor = getChallengeThemeColor(challenge.challengeType);
  return (
    <div className="mx-auto w-full max-w-[1000px] px-5 pb-10 pt-6 md:px-0 md:py-[60px]">
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:gap-[22px]">
        {/* 썸네일 */}
        <div className="relative aspect-[4/3] h-full flex-1 overflow-hidden rounded-sm bg-blue-500">
          {challenge.thumbnail && (
            <Image
              className="object-cover"
              src={challenge.thumbnail}
              alt={`${challenge.title} 썸네일`}
              fill={true}
              priority
            />
          )}
        </div>

        {/* 챌린지 정보 */}
        <div className="w-full md:max-w-[424px]">
          <h1 className="mb-2 py-1 text-medium22 font-bold text-neutral-0 md:text-medium24">
            {challenge.title}
          </h1>

          <ChallengePriceInfoContent
            priceInfoList={challenge.priceInfo}
            themeColor={themeColor}
          />
        </div>
      </div>

      {/* 일정 정보 */}
      <div className="mt-6 flex flex-col md:mt-5 md:flex-row md:gap-3">
        <ChallengeSchedule challenge={challenge} themeColor={themeColor} />
      </div>
    </div>
  );
};

export default ChallengeBasicInfoSection;
