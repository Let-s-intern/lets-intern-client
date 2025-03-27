import { ChallengeType, challengeTypeSchema } from '@/schema';
import { challengeColors } from '@components/ChallengeView';
import { useMemo } from 'react';

const brandInfo = {
  totalParticipants: '2000+',
  passers: '75+',
  satisfaction: 4.9,
  videoId: 'videoId',
};

const {
  PORTFOLIO,
  CAREER_START,
  PERSONAL_STATEMENT_LARGE_CORP,
  EXPERIENCE_SUMMARY,
} = challengeTypeSchema.enum;

interface Props {
  challengeType: ChallengeType;
}

const ChallengeBrand = ({ challengeType }: Props) => {
  const primaryColor = useMemo(() => {
    switch (challengeType) {
      case CAREER_START:
        return challengeColors._4D55F5;
      case PORTFOLIO:
        return challengeColors._4A76FF;
      case PERSONAL_STATEMENT_LARGE_CORP:
        return challengeColors._14BCFF;
      case EXPERIENCE_SUMMARY:
        return challengeColors.F26646;
      // 자소서
      default:
        return challengeColors._14BCFF;
    }
  }, [challengeType]);

  return (
    <section className="flex w-full flex-col gap-y-8 py-8 md:gap-y-20 md:pb-32 md:pt-10">
      <div className="flex w-full flex-col whitespace-pre text-small20 font-bold md:items-center md:text-xlarge28">
        <p>취업 준비의 든든한 지원군,</p>
        <p>
          <span style={{ color: primaryColor }}>렛츠커리어</span>와 함께하세요
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-[60px]">
        <div
          className="flex h-full flex-col gap-y-1 border-t-[3px] pt-4"
          style={{ borderTopColor: primaryColor }}
        >
          <p className="text-xsmall14 font-semibold md:text-small18">
            누적 참여자 수
          </p>
          <p className="text-small20 font-bold md:text-xlarge28">
            {brandInfo.totalParticipants}명
          </p>
        </div>
        <div
          className="flex h-full flex-col gap-y-1 border-t-[3px] pt-4"
          style={{ borderTopColor: primaryColor }}
        >
          <p className="text-xsmall14 font-semibold md:text-small18">
            챌린지 평균 수료율
          </p>
          <p className="text-small20 font-bold md:text-xlarge28">
            {brandInfo.passers}%
          </p>
        </div>
        <div
          className="flex h-full flex-col gap-y-1 border-t-[3px] pt-4"
          style={{ borderTopColor: primaryColor }}
        >
          <p className="text-xsmall14 font-semibold md:text-small18">
            참여자 만족도
          </p>
          <p className="text-small20 font-bold md:text-xlarge28">
            {brandInfo.satisfaction}점
          </p>
        </div>
      </div>
    </section>
  );
};

export default ChallengeBrand;
