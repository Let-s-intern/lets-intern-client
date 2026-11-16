import {
  DEMO_GUIDES,
  DEMO_NOTICES,
  DEMO_SCORE,
  DEMO_USER_NAME,
  DEMO_ZERO_MISSION,
  DemoSchedule,
} from '../data/demoMock';
import DemoListCard from './DemoListCard';
import DemoMissionCalendar from './DemoMissionCalendar';

interface Props {
  schedules: DemoSchedule[];
  onOpenMission: () => void;
  onLocked: () => void;
}

/**
 * 실제 대시보드(app/(user)/challenge/[applicationId]/[programId]/page.tsx)의 배치를 따른다.
 * 체험 창이 실제 화면보다 좁아서 카드를 나란히 놓는 기준만 md 에서 lg 로 올렸다.
 */
const DemoDashboardView = ({ schedules, onOpenMission, onLocked }: Props) => {
  const zeroMission = schedules[0];

  return (
    <main className="px-5 py-8 md:py-0 md:pl-8 md:pr-0">
      <h1 className="text-[22px] font-semibold">
        {DEMO_USER_NAME}님의 대시보드
      </h1>
      <div className="mt-6 flex flex-col gap-4 md:gap-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* 진행 중인 미션 — DailyMissionSection 모양 */}
          <section className="flex h-[338px] flex-col rounded-xs border border-primary-80 lg:h-[360px] lg:min-w-0 lg:flex-1">
            <div className="flex flex-col border-b px-4 py-3 lg:flex-row lg:items-center lg:gap-2 lg:py-4">
              <h2 className="flex flex-row font-semibold text-[#4A495C]">
                <span className="relative inline-block font-semibold text-neutral-10 after:mx-[6px] after:h-[18px] after:border-r after:border-neutral-60 after:content-['']">
                  {zeroMission.th}회차
                </span>
                <span>{zeroMission.title}</span>
              </h2>
              <span className="text-xsmall14 text-primary">
                마감기한 {zeroMission.endDate.format('MM.DD HH:mm')}까지
              </span>
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <p className="line-clamp-[8] whitespace-pre-line text-xsmall14 text-neutral-0 md:text-xsmall16">
                {DEMO_ZERO_MISSION.description}
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenMission}
              className="m-4 rounded-xs bg-primary py-3 text-center text-white"
            >
              미션 수행하기
            </button>
          </section>

          <div className="flex flex-col gap-2.5 lg:w-[20rem]">
            <DemoListCard
              title="공지사항"
              items={DEMO_NOTICES}
              onLocked={onLocked}
            />
            <div className="flex gap-2.5">
              {/* 미션 점수 현황 — ScoreSection 모양 */}
              <section className="flex w-[calc((100%-10px)/2)] flex-col gap-y-4 rounded-xs border border-[#E4E4E7] p-4">
                <div className="flex flex-1 flex-col gap-2">
                  <h2 className="font-semibold text-[#4A495C]">
                    미션 점수 현황
                  </h2>
                  <div className="flex items-end">
                    <span className="text-2xl font-bold text-primary">
                      {DEMO_SCORE.current}점
                    </span>
                    <span className="mb-[1px] ml-1 font-semibold text-[#D3D3D3]">
                      /{DEMO_SCORE.total}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onLocked}
                  className="rounded-xs border border-neutral-80 px-2 py-2.5 text-xsmall14 font-medium text-neutral-50"
                >
                  수료증 발급
                </button>
              </section>
              <DemoListCard
                title="챌린지 가이드"
                items={DEMO_GUIDES}
                onLocked={onLocked}
                className="w-[calc((100%-10px)/2)]"
              />
            </div>
          </div>
        </div>

        <section className="w-full rounded-xs border border-neutral-80 p-4">
          <h2 className="text-1-bold text-neutral-30">
            일정 및 미션 제출 현황
          </h2>
          <DemoMissionCalendar
            schedules={schedules}
            onOpenMission={onOpenMission}
            onLocked={onLocked}
          />
        </section>
      </div>
    </main>
  );
};

export default DemoDashboardView;
