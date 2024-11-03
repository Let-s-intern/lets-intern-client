import { useMediaQuery } from '@mui/material';

const brandInfo = {
  totalParticipants: 1900,
  satisfaction: 4.9,
  programs: 59,
  participants: 1646,
  passers: 162,
  passersDate: '24년 4월 기준',
  videoId: 'videoId',
};

const ChallengeBrand = () => {
  const isDesktop = useMediaQuery('(min-width: 991px)');

  return (
    <section className="flex w-full flex-col gap-y-8 py-8 md:gap-y-20">
      <div className="flex w-full flex-col whitespace-pre text-small20 font-bold md:items-center md:text-xlarge28">
        <p>
          누적 참여자{' '}
          <span className="text-challenge">
            {brandInfo.totalParticipants.toLocaleString()}명
          </span>
        </p>
        <p>
          참여 만족도{' '}
          <span className="text-challenge">{brandInfo.satisfaction}점</span>
        </p>
      </div>
      <div className="flex w-full flex-col gap-y-5 md:flex-row md:gap-x-[60px]">
        <div className="flex w-full gap-x-5 md:gap-x-[60px]">
          <div className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] border-challenge pt-4">
            <p className="text-xsmall14 font-semibold md:text-small18">
              프로그램 수
            </p>
            <p className="text-small20 font-bold md:text-xlarge28">
              {brandInfo.programs.toLocaleString()}개
            </p>
          </div>
          <div className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] border-challenge pt-4">
            <p className="text-xsmall14 font-semibold md:text-small18">
              참여자 수
            </p>
            <p className="text-small20 font-bold md:text-xlarge28">
              {brandInfo.participants.toLocaleString()}명
            </p>
          </div>
        </div>
        <div className="flex w-full gap-x-5 md:gap-x-[60px]">
          <div className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] border-challenge pt-4">
            <p className="text-xsmall14 font-semibold md:text-small18">
              합격자 수{' '}
              <span className="text-xxsmall12 font-normal text-neutral-40 md:text-xsmall14">
                {brandInfo.passersDate}
              </span>
            </p>
            <p className="text-small20 font-bold md:text-xlarge28">
              {brandInfo.passers.toLocaleString()}명
            </p>
          </div>
          <div className="flex h-full flex-1 flex-col gap-y-1 border-t-[3px] border-challenge pt-4">
            <p className="text-xsmall14 font-semibold md:text-small18">
              참여자 만족도
            </p>
            <p className="text-small20 font-bold md:text-xlarge28">
              {brandInfo.satisfaction}점
            </p>
          </div>
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
        <div className="flex w-full items-center justify-center rounded-md bg-[#EEFAFF] px-4 py-[14px] md:py-5">
          설명
        </div>
      </div>
    </section>
  );
};

export default ChallengeBrand;
