import { clsx } from 'clsx';

interface MissionGuideSectionProps {
  className?: string;
  todayTh: number;
}

const MissionGuideSection = ({
  className,
  todayTh,
}: MissionGuideSectionProps) => {
  return (
    <div className={clsx('flex flex-col', className)}>
      {/* 제목 및 마감일 섹션 */}
      <section className="mb-3 flex flex-row items-center gap-2">
        <h2 className="text-xl font-bold text-neutral-0">{todayTh}회차 미션</h2>
        <div className="h-[18px] w-px bg-neutral-60" />
        <h2 className="text-xl font-bold text-neutral-0">OT 시청</h2>
        <p className="text-xsmall16 text-primary-90">
          마감기한 04.04 11:59까지
        </p>
      </section>
      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
        {/* 환영 섹션 */}
        <section className="flex flex-col gap-4">
          <p className="text-xsmall16 text-neutral-0">
            환영합니다! <br />
            챌린지가 시작되기 전에 <br />
            전체적인 챌린지 흐름과 일정, 미션 제출 방법 등을 미리 알아보는
            시간입니다. <br />
            <br />
            이번 0회차에서 먼저 확인해보세요.
          </p>
        </section>
        {/* 분리선 섹션 */}
        <div className="h-px bg-neutral-80" />
        {/* 미션 가이드 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-xsmall16 font-semibold text-neutral-10">
            미션 가이드
          </h3>
          <p className="text-xsmall16 text-neutral-10">
            이번 가이드는 앞으로의 챌린지를 어렵게 않게 이야가기 위한 작은 준비
            운동 같은 거예요. <br />
            콘텐츠를 따라 직무 인터뷰를 정독하며 여러분이 이해한 방식대로
            정리합시다 😀
          </p>
        </section>

        {/* 미션 자료 모음 섹션 */}
        <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3">
          <div className="flex flex-col">
            <h3 className="text-xsmall16 font-semibold text-neutral-0">
              미션 자료 모음
            </h3>
            <p className="text-xsmall16 text-neutral-10">
              자료를 확인하고 미션을 진행해 주세요.
            </p>
          </div>
          {/* 필수 콘텐츠 + 추가 콘텐츠 섹션 */}
          <div className="flex flex-col gap-2">
            {/* 필수 콘텐츠 */}
            <div className="flex flex-row items-center gap-3">
              <h4 className="text-xsmall16 font-medium text-neutral-0">
                필수 콘텐츠
              </h4>
              <div className="flex cursor-pointer items-center gap-1">
                <img
                  src="/icons/file-notext.svg"
                  alt="file icon"
                  className="h-5 w-5"
                />
                <span className="text-xsmall16 text-primary">
                  마케팅 서류 완성 챌린지 OT자료
                </span>
              </div>
            </div>

            {/* 추가 콘텐츠 */}
            <div className="flex flex-row gap-3">
              <h4 className="text-xsmall16 font-medium text-neutral-0">
                추가 콘텐츠
              </h4>
              <div className="flex flex-col gap-2">
                <div className="flex cursor-pointer items-center gap-1">
                  <img
                    src="/icons/file-notext.svg"
                    alt="file icon"
                    className="h-5 w-5"
                  />
                  <span className="text-xsmall16 text-primary">
                    대시보드 이용방법
                  </span>
                </div>
                <div className="flex cursor-pointer items-center gap-1">
                  <img
                    src="/icons/file-notext.svg"
                    alt="file icon"
                    className="h-5 w-5"
                  />
                  <span className="text-xsmall16 text-primary">
                    미션수행 및 인증법
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OT 영상 섹션 */}
        <section className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold text-neutral-0">OT 영상</h3>
          <div className="relative flex aspect-video cursor-pointer items-center justify-center rounded-sm bg-neutral-95 transition-colors hover:bg-neutral-90">
            <div className="flex h-16 w-16 items-center justify-center rounded-sm bg-white shadow-lg">
              <div className="ml-1 h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-l-neutral-0 border-t-transparent" />
            </div>
          </div>
        </section>
      </section>
    </div>
  );
};

export default MissionGuideSection;
