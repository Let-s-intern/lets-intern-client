'use client';

import dayjs from '@/lib/dayjs';
import { ReactNode, useState } from 'react';
import {
  buildDemoSchedules,
  DEMO_MISSION_TIPS,
  DEMO_TIPS,
} from '../data/demoMock';
import DemoDashboardView from './DemoDashboardView';
import DemoLockPopover from './DemoLockPopover';
import DemoMyMissionView from './DemoMyMissionView';
import DemoNavBar, { DemoView } from './DemoNavBar';
import DemoTip, { DemoTipPlacement } from './DemoTip';

/** 화면마다 갈라지는 안내를 그리는 함수. 지금 순서의 말풍선만 그린다 */
export type RenderDemoTip = (
  step: number,
  placement?: DemoTipPlacement,
) => ReactNode;

/**
 * 챌린지 상세의 프로그램 소개 맨 위에 넣는 대시보드 맛보기.
 * 목 데이터만 쓰고 API 를 부르지 않는다. 화면 전환은 로컬 상태로만 하고 URL 은 건드리지 않는다.
 * 체험 창 안에는 스크롤이 없다. 내용만큼 길어지고, 말풍선은 화면별로 순서대로 띄운다.
 */
const DashboardDemo = () => {
  // 서버와 브라우저가 같은 날짜를 그리도록 기본 시간대(Asia/Seoul) 기준으로 오늘을 잡는다.
  const [schedules] = useState(() => buildDemoSchedules(dayjs.tz()));
  const [view, setView] = useState<DemoView>('dashboard');
  const [isLockOpen, setIsLockOpen] = useState(false);
  // 화면을 오가도 이어서 보도록 안내 순서는 여기서 들고 있는다.
  const [tipStep, setTipStep] = useState<number | null>(0);
  const [missionTipStep, setMissionTipStep] = useState<number | null>(0);
  // 다음 안내를 눌렀을 때만 페이지를 말풍선으로 옮긴다. 화면을 오갈 때는 그대로 둔다.
  const [followTip, setFollowTip] = useState(false);

  const openLock = () => setIsLockOpen(true);
  const nextOf = (step: number | null, total: number) =>
    step !== null && step + 1 < total ? step + 1 : null;
  const showNextTip = () => {
    setFollowTip(true);
    setTipStep((step) => nextOf(step, DEMO_TIPS.length));
  };
  const showNextMissionTip = () => {
    setFollowTip(true);
    setMissionTipStep((step) => nextOf(step, DEMO_MISSION_TIPS.length));
  };

  const changeView = (next: DemoView) => {
    setFollowTip(false);
    setView(next);
  };

  const makeRenderTip = (
    tips: string[],
    current: number | null,
    onNext: () => void,
  ): RenderDemoTip => {
    const renderTip: RenderDemoTip = (step, placement) =>
      current === step && (
        <DemoTip
          text={tips[step]}
          step={step}
          total={tips.length}
          onNext={onNext}
          placement={placement}
          scroll={followTip}
        />
      );
    return renderTip;
  };
  const renderDashboardTip = makeRenderTip(DEMO_TIPS, tipStep, showNextTip);
  const renderMissionTip = makeRenderTip(
    DEMO_MISSION_TIPS,
    missionTipStep,
    showNextMissionTip,
  );

  return (
    <section className="mx-auto flex w-full max-w-[1000px] flex-col px-5 pt-10 md:px-10 md:pt-16 lg:px-0">
      <div className="relative overflow-hidden rounded-md border border-neutral-80 bg-white shadow-03">
        <div className="flex items-center gap-3 border-b border-neutral-80 bg-neutral-95 px-4 py-2.5">
          <div aria-hidden className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-70" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-70" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-70" />
          </div>
          <span className="text-xsmall14 font-medium text-neutral-40">
            대시보드 미리보기
          </span>
        </div>
        <div className="flex flex-col pb-6 md:flex-row md:px-6 md:py-8">
          <DemoNavBar
            view={view}
            onSelect={changeView}
            tip={view === 'dashboard' ? renderDashboardTip(0, 'bottom') : null}
          />
          <div className="min-w-0 flex-1">
            {view === 'dashboard' ? (
              <DemoDashboardView
                schedules={schedules}
                onOpenMission={() => changeView('my-mission')}
                onLocked={openLock}
                renderTip={renderDashboardTip}
              />
            ) : (
              <DemoMyMissionView
                schedules={schedules}
                onLocked={openLock}
                renderTip={renderMissionTip}
              />
            )}
          </div>
        </div>
        {isLockOpen && <DemoLockPopover onClose={() => setIsLockOpen(false)} />}
      </div>
    </section>
  );
};

export default DashboardDemo;
