import MissionFileLink from '@/domain/challenge/my-challenge/mission/guide/MissionFileLink';
import MissionHeaderSection from '@/domain/challenge/my-challenge/mission/guide/MissionHeaderSection';
import { ReactNode } from 'react';
import { DEMO_ZERO_MISSION, DemoSchedule } from '../data/demoMock';

interface Props {
  schedule: DemoSchedule;
  onLocked: () => void;
  /** 미션 설명 카드 위쪽에 붙는 안내 말풍선 */
  guideTip?: ReactNode;
  /** OT 영상 위에 붙는 안내 말풍선 */
  videoTip?: ReactNode;
}

/**
 * MissionGuideZeroSection 의 복사본. 원본은 자료를 누르면 열람 기록 API 를 부르고 새 창을 연다.
 * 체험에서는 자료와 OT 영상을 잠금 안내로 돌린다.
 */
const DemoZeroGuide = ({ schedule, onLocked, guideTip, videoTip }: Props) => (
  <div className="flex flex-col gap-3">
    <MissionHeaderSection
      selectedMissionTh={schedule.th}
      missionType={schedule.title}
      missionStartDate={schedule.startDate}
      missionEndDate={schedule.endDate}
    />
    <section className="relative flex flex-col gap-5 rounded-xs border border-neutral-80 px-4 py-4">
      {guideTip}
      <p className="whitespace-pre-wrap text-xsmall14 text-neutral-0 md:text-xsmall16">
        {DEMO_ZERO_MISSION.description}
      </p>
      <div className="h-px bg-neutral-80" />
      <section className="flex flex-col gap-3">
        <h3 className="text-xsmall16 font-semibold text-neutral-10">
          미션 가이드
        </h3>
        <p className="whitespace-pre-wrap text-xsmall14 text-neutral-10 md:text-xsmall16">
          {DEMO_ZERO_MISSION.guide}
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-xxs bg-neutral-95 p-3 pb-5">
        <div className="flex flex-col">
          <h3 className="text-xsmall16 font-semibold text-neutral-0">
            미션 자료 모음
          </h3>
          <p className="text-xsmall14 text-neutral-10">
            자료를 확인하고 미션을 진행해 주세요.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {DEMO_ZERO_MISSION.materials.map((material) => (
            <MissionFileLink
              key={material.name}
              title={material.label}
              fileName={material.name}
              onClick={onLocked}
            />
          ))}
        </div>
      </section>

      <section className="relative flex flex-col gap-3">
        {videoTip}
        <h3 className="text-lg font-semibold text-neutral-0">OT 영상</h3>
        <button
          type="button"
          onClick={onLocked}
          aria-label="OT 영상 재생"
          className="flex aspect-video items-center justify-center rounded-sm bg-neutral-95 transition-colors hover:bg-neutral-90"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-sm bg-white shadow-lg">
            <span className="ml-1 h-0 w-0 border-b-[8px] border-l-[12px] border-t-[8px] border-b-transparent border-l-neutral-0 border-t-transparent" />
          </span>
        </button>
      </section>
    </section>
  </div>
);

export default DemoZeroGuide;
