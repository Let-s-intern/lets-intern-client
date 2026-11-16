'use client';

import dayjs from '@/lib/dayjs';
import { useRef, useState } from 'react';
import { buildDemoSchedules, DEMO_TIPS } from '../data/demoMock';
import DemoDashboardView from './DemoDashboardView';
import DemoLockPopover from './DemoLockPopover';
import DemoMyMissionView from './DemoMyMissionView';
import DemoNavBar, { DemoView } from './DemoNavBar';

/**
 * 챌린지 상세의 프로그램 소개 맨 위에 넣는 대시보드 맛보기.
 * 목 데이터만 쓰고 API 를 부르지 않는다. 화면 전환은 로컬 상태로만 하고 URL 은 건드리지 않는다.
 */
const DashboardDemo = () => {
  // 서버와 브라우저가 같은 날짜를 그리도록 기본 시간대(Asia/Seoul) 기준으로 오늘을 잡는다.
  const [schedules] = useState(() => buildDemoSchedules(dayjs.tz()));
  const [view, setView] = useState<DemoView>('dashboard');
  const [isLockOpen, setIsLockOpen] = useState(false);
  // 화면을 오가도 이어서 보도록 안내 순서는 여기서 들고 있는다.
  const [tipStep, setTipStep] = useState<number | null>(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const openLock = () => setIsLockOpen(true);
  const showNextTip = () =>
    setTipStep((step) =>
      step !== null && step + 1 < DEMO_TIPS.length ? step + 1 : null,
    );

  const changeView = (next: DemoView) => {
    setView(next);
    scrollRef.current?.scrollTo({ top: 0 });
  };

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
        <div
          ref={scrollRef}
          data-demo-scroll
          className="flex h-[600px] flex-col overflow-y-auto md:h-[640px] md:flex-row md:px-6 md:py-8"
        >
          <DemoNavBar view={view} onSelect={changeView} onLocked={openLock} />
          <div className="min-w-0 flex-1">
            {view === 'dashboard' ? (
              <DemoDashboardView
                schedules={schedules}
                onOpenMission={() => changeView('my-mission')}
                onLocked={openLock}
                tipStep={tipStep}
                onNextTip={showNextTip}
              />
            ) : (
              <DemoMyMissionView schedules={schedules} onLocked={openLock} />
            )}
          </div>
        </div>
        {isLockOpen && <DemoLockPopover onClose={() => setIsLockOpen(false)} />}
      </div>
    </section>
  );
};

export default DashboardDemo;
