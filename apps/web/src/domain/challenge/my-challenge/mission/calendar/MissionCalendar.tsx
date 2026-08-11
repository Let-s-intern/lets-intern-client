import {
  countFinishedMissions,
  findLastFinishedSchedule,
  getMissionTimeState,
} from '@/domain/challenge/utils/missionTimeState';
import dayjs from '@/lib/dayjs';
import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import MissionCalendarItem from './MissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  /** 오늘 진행 중인 회차. 진행 중인 미션이 없는 시간대에는 null 이다. */
  todayTh: number | null;
  isDone: boolean;
}

const getContentWidth = (swiper: SwiperType) => {
  const lastIndex = swiper.slidesGrid.length - 1;
  if (lastIndex < 0) return 0;
  return swiper.slidesGrid[lastIndex] + swiper.slidesSizesGrid[lastIndex];
};

const SWIPER_STYLE = { paddingTop: 16 };

const MissionCalendar = ({ schedules, todayTh, isDone }: Props) => {
  // 카드 상태 판정의 기준 시각. 여기서 한 번만 만들어 카드 전체가 같은 '지금' 을 보게 한다.
  // 렌더마다 새로 만들면 카드 24개에 매번 다른 객체가 내려가 memo 가 걸리지 않는다.
  const now = useMemo(() => dayjs(), []);

  const swiperRef = useRef<SwiperType | null>(null);
  const { selectedMissionTh } = useMissionStore();
  const pathname = usePathname();

  const [isLocked, setIsLocked] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [trackWidth, setTrackWidth] = useState<number>();
  const [wrapperEl, setWrapperEl] = useState<HTMLElement | null>(null);

  const isMissionPage = useMemo(() => pathname.includes('/me'), [pathname]);

  // 진행 중인 미션이 없는 시간대에 맞춰 갈 자리. 가장 최근에 마감된 회차다.
  const lastFinishedTh =
    findLastFinishedSchedule(schedules, now)?.missionInfo.th ?? null;

  // 챌린지 시작 전이라 마감된 회차도 없으면 null 이고, 첫 카드에 머문다.
  const targetTh = isMissionPage
    ? (selectedMissionTh ?? todayTh ?? lastFinishedTh)
    : (todayTh ?? lastFinishedTh);

  const focusTodayMission = (swiper: SwiperType) => {
    if (targetTh === null) return;

    const startsFromZero = schedules[0]?.missionInfo?.th === 0;
    const visibleCount = swiper.slidesPerViewDynamic();
    const visibleLimit = startsFromZero ? visibleCount - 1 : visibleCount;

    if (targetTh <= visibleLimit) return;

    const rawIndex = startsFromZero ? targetTh : targetTh - 1;
    const centeredIndex = Math.max(rawIndex - Math.floor(visibleCount / 2), 0);
    swiper.slideTo(centeredIndex, 0);
  };

  // wrapperEl 을 의존성에 둔다. swiper 가 준비되기 전 첫 렌더에서는 아래 effect 가
  // 그냥 빠져나가는데, 준비 시점에 onSwiper 가 wrapperEl 을 채우며 다시 돌게 만든다.
  // 이게 없으면 trackWidth 가 undefined 로 남아 폴백 계산값에 머문다.
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    setTrackWidth(getContentWidth(swiper));
    focusTodayMission(swiper);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetTh, schedules.length, schedules, wrapperEl]);

  // 카드 폭은 창 크기에 따라 달라진다. 진행바 트랙만 옛 폭에 머물면 카드와 어긋난다.
  useEffect(() => {
    const handleResize = () => {
      const swiper = swiperRef.current;
      if (!swiper) return;
      setTrackWidth(getContentWidth(swiper));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStep = (swiper: SwiperType) => {
    return Math.max(Math.round(swiper.slidesPerViewDynamic() / 2), 1);
  };

  const updateEdgeState = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const step = getStep(swiper);
    swiper.slideTo(Math.max(swiper.activeIndex - step, 0));
  };

  const handleNext = () => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    const step = getStep(swiper);
    swiper.slideTo(
      Math.min(swiper.activeIndex + step, swiper.slides.length - 1),
    );
  };

  /**
   * 진행바가 가리킬 카드의 자리. **회차 번호가 아니라 카드 인덱스다.**
   *
   * 예전에는 `todayTh` 를 그대로 인덱스처럼 썼다. 그 계산은 0회차가 있는 편성
   * (th 가 곧 인덱스)에서만 맞고, 0회차가 없으면 인덱스는 th - 1 이라 한 칸씩 앞섰다.
   * 1회차가 진행 중인데 점이 2회차 위에 놓이던 것이 그 때문이다.
   *
   * 진행 중인 카드가 있으면 그 자리, 없으면 마감된 개수(=다음 카드 자리)를 쓴다.
   * 두 경우 모두 회차 번호를 보지 않으므로 편성이 어떻든 어긋나지 않는다.
   */
  const inProgressIndex = schedules.findIndex(
    (schedule) => getMissionTimeState(schedule.missionInfo, now) === 'IN_PROGRESS',
  );
  const finishedCount = countFinishedMissions(schedules, now);
  const progressIndex = inProgressIndex === -1 ? finishedCount : inProgressIndex;

  /**
   * 진행 중인 회차를 이미 냈는가.
   *
   * 예전에는 `result === 'PASS'` 를 봤는데, 그건 어드민이 확인 완료 처리한 뒤에야 붙는 값이다.
   * 유저가 제출을 마쳐도 한동안 '확인중'(WAITING)이라 진행바가 꿈쩍하지 않았다.
   * 제출 직후 움직이도록 출석 상태로 판정한다. 결과가 반려여도 낸 것은 낸 것이다.
   * 어드민이 만든 결석(ABSENT) 행은 제출로 치지 않는다.
   */
  const inProgressSchedule =
    inProgressIndex === -1 ? undefined : schedules[inProgressIndex];
  const attendanceStatus = inProgressSchedule?.attendanceInfo.status;
  const isTodayDone = attendanceStatus != null && attendanceStatus !== 'ABSENT';

  const progress = isDone
    ? 100
    : isTodayDone
      ? Math.min(((progressIndex + 1) / schedules.length) * 100, 100)
      : Math.min(
          ((progressIndex + CARD_CENTER_FRACTION) / schedules.length) * 100,
          100,
        );

  return (
    <div className="group relative">
      {!isLocked && !isBeginning && (
        <button
          type="button"
          aria-label="이전 미션 보기"
          onClick={handlePrev}
          className="absolute left-1 top-1/2 z-10 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-900/20 text-white transition hover:bg-neutral-900/40 md:flex md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      {!isLocked && !isEnd && (
        <button
          type="button"
          aria-label="다음 미션 보기"
          onClick={handleNext}
          className="absolute right-1 top-1/2 z-10 hidden h-8 w-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-neutral-900/20 text-white transition hover:bg-neutral-900/40 md:flex md:opacity-0 md:focus-visible:opacity-100 md:group-hover:opacity-100"
        >
          <ChevronRight size={20} />
        </button>
      )}
      <Swiper
        style={SWIPER_STYLE}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsLocked(swiper.isLocked);
          setWrapperEl(swiper.wrapperEl);
          updateEdgeState(swiper);
        }}
        onSlideChange={updateEdgeState}
        onLock={() => setIsLocked(true)}
        onUnlock={() => setIsLocked(false)}
        slidesPerView="auto"
      >
        {schedules.map((schedule, index) => (
          <SwiperSlide key={index} className="mt-3 !w-[82px]">
            <MissionCalendarItem
              schedule={schedule}
              now={now}
              isDone={isDone}
              className="w-full cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {wrapperEl &&
        createPortal(
          <MissionProgressBar
            width={trackWidth ?? schedules.length * SLIDE_WIDTH_PX}
            progress={progress}
          />,
          wrapperEl,
        )}
    </div>
  );
};

export default MissionCalendar;

const SLIDE_WIDTH_PX = 82;
const CARD_WIDTH_PX = 74.8;
const CARD_CENTER_FRACTION = CARD_WIDTH_PX / (2 * SLIDE_WIDTH_PX);

const MissionProgressBar = ({
  width,
  progress,
}: {
  width: number;
  progress: number;
}) => (
  <div
    className="bg-neutral-70 absolute left-0 top-0 hidden h-1 rounded-full md:block"
    style={{ width: `${width}px` }}
  >
    <div
      className="bg-primary absolute h-1 rounded-full"
      style={{ width: `${progress}%` }}
    />
    <div
      className="bg-primary absolute top-1/2 h-2 w-2 rounded-full"
      style={{
        left: `clamp(4px, ${progress}%, calc(100% - 4px))`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  </div>
);
