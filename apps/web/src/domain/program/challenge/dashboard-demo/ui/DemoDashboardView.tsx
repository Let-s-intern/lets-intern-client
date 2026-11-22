import {
  DEMO_GUIDES,
  DEMO_SCORE,
  DEMO_USER_NAME,
  DEMO_ZERO_MISSION,
  DemoSchedule,
} from '../data/demoMock';
import DemoListCard from './DemoListCard';
import DemoMissionCalendar from './DemoMissionCalendar';
import type { RenderDemoTip } from './DashboardDemo';

interface Props {
  schedules: DemoSchedule[];
  onOpenMission: () => void;
  onLocked: () => void;
  /** 지금 순서의 안내 말풍선만 그린다 */
  renderTip: RenderDemoTip;
}

/**
 * 실제 대시보드(app/(user)/challenge/[applicationId]/[programId]/page.tsx)의 배치를 따른다.
 * 체험 창은 본문 오른쪽에 신청 패널이 붙어 늘 좁아서, 미션 카드와 공지·점수 카드는 세로로 쌓는다.
 */
const DemoDashboardView = ({
  schedules,
  onOpenMission,
  onLocked,
  renderTip,
}: Props) => {
  const zeroMission = schedules[0];

  return (
    <main className="px-5 py-8 md:py-0 md:pl-8 md:pr-0">
      <h1 className="text-[22px] font-semibold">
        {DEMO_USER_NAME}님의 대시보드
      </h1>
      <div className="mt-6 flex flex-col gap-4 md:gap-5">
        <div className="flex flex-col gap-3">
          {/* 진행 중인 미션 — DailyMissionSection 모양 */}
          <section className="relative flex h-[338px] flex-col rounded-xs border border-primary-80">
            <div className="relative flex flex-col border-b px-4 py-3 md:flex-row md:flex-wrap md:items-center md:gap-x-2 md:py-4">
              <h2 className="flex flex-row font-semibold text-[#4A495C]">
                <span className="relative inline-block font-semibold text-neutral-10 after:mx-[6px] after:h-[18px] after:border-r after:border-neutral-60 after:content-['']">
                  {zeroMission.th}회차
                </span>
                <span>{zeroMission.title}</span>
              </h2>
              <span className="text-xsmall14 text-primary">
                마감기한 {zeroMission.endDate.format('MM.DD HH:mm')}까지
              </span>
              {renderTip(1, 'bottom')}
            </div>
            <div className="flex-1 overflow-hidden p-4">
              <p className="line-clamp-[8] whitespace-pre-line text-xsmall14 text-neutral-0 md:text-xsmall16">
                {DEMO_ZERO_MISSION.description}
              </p>
            </div>
            {/* 첫 말풍선은 '미션 수행하기' 버튼을 가리킨다. 카드 위에 두면 체험 창 위쪽에 잘린다 */}
            <div className="relative m-4">
              {renderTip(2)}
              <button
                type="button"
                onClick={onOpenMission}
                className="w-full rounded-xs bg-primary py-3 text-center text-white"
              >
                미션 수행하기
              </button>
            </div>
          </section>

          <div className="flex flex-col gap-2.5">
            <div className="flex gap-2.5">
              {/* 미션 점수 현황 — ScoreSection 모양 */}
              <section className="relative flex w-[calc((100%-10px)/2)] flex-col gap-y-4 rounded-xs border border-[#E4E4E7] p-4">
                {renderTip(3)}
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
                <div className="relative">
                  {renderTip(4)}
                  <button
                    type="button"
                    onClick={onLocked}
                    className="w-full rounded-xs border border-neutral-80 px-2 py-2.5 text-xsmall14 font-medium text-neutral-50"
                  >
                    수료증 발급
                  </button>
                </div>
              </section>
              <DemoListCard
                title="챌린지 가이드"
                items={DEMO_GUIDES}
                onLocked={onLocked}
                className="w-[calc((100%-10px)/2)]"
                tip={renderTip(5)}
              />
            </div>
          </div>
        </div>

        <section className="relative w-full rounded-xs border border-neutral-80 p-4">
          {renderTip(6)}
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
