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
  todayTh: number;
  isDone: boolean;
}

const getContentWidth = (swiper: SwiperType) => {
  const lastIndex = swiper.slidesGrid.length - 1;
  if (lastIndex < 0) return 0;
  return swiper.slidesGrid[lastIndex] + swiper.slidesSizesGrid[lastIndex];
};

const SWIPER_STYLE = { paddingTop: 16 };

const MissionCalendar = ({ schedules, todayTh, isDone }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { selectedMissionTh } = useMissionStore();
  const pathname = usePathname();

  const [isLocked, setIsLocked] = useState(true);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [trackWidth, setTrackWidth] = useState<number>();
  const [wrapperEl, setWrapperEl] = useState<HTMLElement | null>(null);

  const isMissionPage = useMemo(() => pathname.includes('/me'), [pathname]);

  const targetIndex = useMemo(() => {
    return isMissionPage ? (selectedMissionTh ?? todayTh) : todayTh;
  }, [isMissionPage, selectedMissionTh, todayTh]);

  const focusTodayMission = (swiper: SwiperType) => {
    const startsFromZero = schedules[0]?.missionInfo?.th === 0;
    const visibleCount = swiper.slidesPerViewDynamic();
    const visibleLimit = startsFromZero ? visibleCount - 1 : visibleCount;

    if (targetIndex <= visibleLimit) return;

    const rawIndex = startsFromZero ? targetIndex : targetIndex - 1;
    const centeredIndex = Math.max(rawIndex - Math.floor(visibleCount / 2), 0);
    swiper.slideTo(centeredIndex, 0);
  };

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    setTrackWidth(getContentWidth(swiper));
    focusTodayMission(swiper);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIndex, schedules.length, schedules]);

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

  const todaySchedule = schedules.find((s) => s.missionInfo.th === todayTh);
  const isTodayDone = todaySchedule?.attendanceInfo.result === 'PASS';

  const progress = isDone
    ? 100
    : isTodayDone
      ? Math.min(((todayTh + 1) / schedules.length) * 100, 100)
      : Math.min(
          ((todayTh + CARD_CENTER_FRACTION) / schedules.length) * 100,
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
              todayTh={todayTh}
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
