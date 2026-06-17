import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
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

const MissionCalendar = ({ schedules, todayTh, isDone }: Props) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const { selectedMissionTh } = useMissionStore();
  const pathname = usePathname();

  const isMissionPage = useMemo(() => pathname.includes('/me'), [pathname]);

  const targetIndex = useMemo(() => {
    return isMissionPage ? (selectedMissionTh ?? todayTh) : todayTh;
  }, [isMissionPage, selectedMissionTh, todayTh]);

  useEffect(() => {
    const swiper = swiperRef.current;
    const isDesktop = window.innerWidth >= 768;

    if (!swiper || isDesktop) return;

    const startsFromZero = schedules[0]?.missionInfo?.th === 0;
    const visibleLimit = startsFromZero ? 3 : 4;

    if (targetIndex > visibleLimit) {
      swiper.slideTo(startsFromZero ? targetIndex : targetIndex - 1, 100);
    }
  }, [targetIndex, schedules.length, schedules]);

  return (
    <Swiper
      onSwiper={(swiper) => (swiperRef.current = swiper)}
      slidesPerView="auto"
      breakpoints={{
        768: {
          slidesPerView: 10,
          slidesOffsetBefore: 0,
          slidesOffsetAfter: 0,
        },
      }}
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
  );
};

export default MissionCalendar;
