/**
 * S7 "여기에 더해서" 섹션 — 챌린지 수강생 전용 무제한 다시보기(VOD 아카이브) 안내.
 * 밝은 배경 위 카피 + VOD 아카이브 스크린샷. 정적 RSC.
 */
const PlusSection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-[#EFEFEF] to-[#DBDDFD] px-5 py-16 md:py-24">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <img
              src="/images/seminar/plus.png"
              alt=""
              className="h-7 w-7"
              aria-hidden
            />
            <p className="text-xsmall14 md:text-xsmall16 text-primary font-semibold">
              여기에 더해서!
            </p>
          </div>
          <h2 className="text-small20 md:text-xlarge30 text-neutral-0 break-keep font-bold">
            챌린지 수강생은
            <br />
            언제든지 볼 수 있는 <br className="md:hidden" />
            <span className="bg-primary inline-block -rotate-2 rounded-none px-2 py-1 text-neutral-100">
              무제한 다시보기
            </span>{' '}
            까지
          </h2>
        </div>

        <div className="flex w-full max-w-[960px] flex-col items-center gap-8 md:flex-row md:gap-12">
          <img
            src="/images/seminar/vod/archive.webp"
            alt="챌린지 참여자 전용 VOD 아카이브 화면"
            loading="lazy"
            className="shadow-03 w-full rounded-lg md:w-3/5"
          />
          <div className="flex flex-col gap-3 md:w-2/5">
            <span className="text-xxsmall12 md:text-xsmall14 bg-neutral-0 rounded-xs w-fit px-3 py-1.5 font-semibold text-neutral-100">
              챌린지 참여자 전용 VOD 아카이브
            </span>
            <p className="text-xsmall16 md:text-small20 text-neutral-0 break-keep font-bold">
              챌린지 1개 이상 참여 시
              <br />
              지난 세미나를 무료로 시청할 수 있어요
            </p>
            <p className="text-xsmall14 md:text-xsmall16 text-neutral-40">
              + 매달 2편 이상의 새로운 <span className="font-bold">VOD</span>{' '}
              업데이트
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlusSection;
