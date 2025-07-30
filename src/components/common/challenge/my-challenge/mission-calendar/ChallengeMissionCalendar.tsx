import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Schedule } from '../../../../../schema';
import MissionCalendarItem from './ChallengeMissionCalendarItem';

interface Props {
  className?: string;
  schedules: Schedule[];
  todayTh: number;
  isDone: boolean;
}

// 새로운 버전
const MissionCalendar = ({ schedules, todayTh, isDone }: Props) => {
  return (
    <Swiper
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
            key={index}
            schedule={schedule}
            todayTh={todayTh}
            className="w-full"
            isDone={isDone}
            isLast={index === schedules.length - 1}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default MissionCalendar;
