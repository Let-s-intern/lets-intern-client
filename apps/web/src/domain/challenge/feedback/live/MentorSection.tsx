'use client';

import clsx from 'clsx';
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DUMMY_MENTORS } from '../dummy';
import MentorCard from './ui/MentorCard';

const MentorSection = ({
  selectedMentorId,
  onSelect,
}: {
  selectedMentorId: number | null;
  onSelect: (id: number) => void;
}) => (
  <section>
    <h2 className="text-xsmall16 text-neutral-0 mb-4 font-semibold">
      담당 멘토
    </h2>
    <div className="-mr-4">
      <Swiper
        spaceBetween={16}
        slidesPerView="auto"
        freeMode
        modules={[FreeMode]}
        slidesOffsetAfter={16}
      >
        {DUMMY_MENTORS.map((mentor) => (
          <SwiperSlide key={mentor.id} className="h-[119px] !w-auto">
            <MentorCard
              mentor={mentor}
              onClick={() => onSelect(mentor.id)}
              className={clsx(
                'border-1 max-w-[300px] border',
                selectedMentorId === mentor.id
                  ? 'border-primary'
                  : 'border-neutral-80',
              )}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default MentorSection;
