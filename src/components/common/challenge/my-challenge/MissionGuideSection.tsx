import { clsx } from 'clsx';

interface MissionGuideSectionProps {
  className?: string;
}

const MissionGuideSection = ({ className }: MissionGuideSectionProps) => {
  return (
    <div className={clsx('flex flex-col gap-8', className)}>
      {/* 환영 섹션 */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-neutral-0">환영합니다!</h2>
        <p className="text-sm leading-relaxed text-neutral-60">
          챌린지가 시작되기 전에 전체적인 챌린지 흐름과 일정, 미션 제출 방법
          등을 미리 알아보는 시간입니다. 이번 0회차에서 먼저 확인해보세요.
        </p>
        <div className="h-px bg-neutral-20" />
      </section>

      {/* 미션 가이드 섹션 */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-neutral-0">미션 가이드</h3>
        <p className="text-sm leading-relaxed text-neutral-60">
          앞으로 진행될 챌린지를 더 쉽게 만들어줄 작은 워밍업 운동입니다. 취업
          면접을 읽고 본인의 이해도에 따라 정리해보세요 😊
        </p>
      </section>

      {/* 미션 자료 모음 섹션 */}
      <section className="flex flex-col gap-4 rounded-lg bg-neutral-95 p-6">
        <h3 className="text-lg font-semibold text-neutral-0">미션 자료 모음</h3>
        <p className="text-sm text-neutral-60">
          자료를 확인하고 미션을 진행해 주세요.
        </p>

        <div className="flex flex-col gap-3">
          {/* 필수 콘텐츠 */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-neutral-0">필수 콘텐츠</h4>
            <div className="flex items-center gap-2 text-sm text-neutral-60">
              <div className="rounded h-4 w-4 bg-neutral-30" />
              <span>마케팅 서류 완성 챌린지 OT자료</span>
            </div>
          </div>

          {/* 추가 콘텐츠 */}
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium text-neutral-0">추가 콘텐츠</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-neutral-60">
                <div className="rounded h-4 w-4 bg-neutral-30" />
                <span>대시보드 이용방법</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-60">
                <div className="rounded h-4 w-4 bg-neutral-30" />
                <span>미션수행 및 인증법</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OT 영상 섹션 */}
      <section className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-neutral-0">OT 영상</h3>
        <div className="relative flex aspect-video items-center justify-center rounded-lg bg-neutral-95">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <div className="ml-1 h-0 w-0 border-b-[6px] border-l-[8px] border-t-[6px] border-b-transparent border-l-neutral-0 border-t-transparent" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MissionGuideSection;
