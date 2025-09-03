import { Schedule } from '@/schema';
import { useMissionStore } from '@/store/useMissionStore';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const isMissionPage = useMemo(
    () => location.pathname.includes('/me'),
    [location.pathname],
  );

  const targetIndex = useMemo(() => {
    return isMissionPage ? (selectedMissionTh ?? todayTh) : todayTh;
  }, [isMissionPage, selectedMissionTh, todayTh]);

  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    // 모바일에서 3을 넘어가면 스크롤
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop && targetIndex > 3) {
      swiper.slideTo(targetIndex, 100);
    }
  }, [targetIndex, schedules.length]);

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
