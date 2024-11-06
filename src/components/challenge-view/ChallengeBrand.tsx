import { ChallengeColor } from '@components/ChallengeView';
import { useMediaQuery } from '@mui/material';

const brandInfo = {
  totalParticipants: '2000+',
  passers: '75+',
  satisfaction: 4.9,
  videoId: 'videoId',
};

const ChallengeBrand = ({ colors }: { colors: ChallengeColor }) => {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <section className="flex w-full flex-col gap-y-8 py-8 md:gap-y-20 md:pb-40 md:pt-10">
      <div className="flex w-full flex-col whitespace-pre text-small20 font-bold md:items-center md:text-xlarge28">
        <p>취업 준비의 든든한 지원군,</p>
        <p>
          <span style={{ color: colors.primary }}>렛츠 커리어</span> 와
          함께하세요
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-[60px]">
        <div
          className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] pt-4"
          style={{ borderTopColor: colors.primary }}
        >
          <p className="text-xsmall14 font-semibold md:text-small18">
            누적 참여자 수
          </p>
          <p className="text-small20 font-bold md:text-xlarge28">
            {brandInfo.totalParticipants}명
          </p>
        </div>
        <div
          className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] pt-4"
          style={{ borderTopColor: colors.primary }}
        >
          <p className="text-xsmall14 font-semibold md:text-small18">
            챌린지 평균 수료율
          </p>
          <p className="text-small20 font-bold md:text-xlarge28">
            {brandInfo.passers}%
          </p>
        </div>
        <div
          className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] pt-4"
          style={{ borderTopColor: colors.primary }}
        >
          <p className="text-xsmall14 font-semibold md:text-small18">
            참여자 만족도
          </p>
          <p className="text-small20 font-bold md:text-xlarge28">
            {brandInfo.satisfaction}점
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-y-6 md:gap-y-8">
        <iframe
          width="560"
          height={isDesktop ? '560' : '315'}
          src="https://www.youtube.com/embed/_xTOxSSqgzA"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full max-w-3xl"
        ></iframe>
        <div
          className="flex w-full items-center justify-center rounded-md px-4 py-[14px] md:py-5"
          style={{ backgroundColor: colors.primaryLight }}
        >
          설명
        </div>
      </div>
    </section>
  );
};

export default ChallengeBrand;
