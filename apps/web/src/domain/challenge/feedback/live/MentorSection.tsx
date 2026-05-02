'use client';

import clsx from 'clsx';
import 'swiper/css';
import { FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DUMMY_MENTORS, type Mentor } from '../dummy';

const MentorCard = ({
  mentor,
  isSelected,
  onClick,
}: {
  mentor: Mentor;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'rounded-xs border-1 flex w-full items-center gap-4 border p-4 text-left transition-colors',
      isSelected ? 'border-primary' : 'border-neutral-80',
    )}
  >
    <div className="rounded-xs relative h-[119px] w-[119px] shrink-0 overflow-hidden">
      {mentor.thumbnailUrl && (
        <img
          src={mentor.thumbnailUrl}
          alt={mentor.name}
          className="h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 flex flex-col gap-2 bg-black/70 p-[15px]">
        <span className="text-xxsmall16 text-bold leading-none text-neutral-100">
          {mentor.company}
        </span>
        <span className="text-xxsmall16 text-bold leading-none text-neutral-100">
          {mentor.name}
        </span>
      </div>
    </div>
    <div className="flex w-[120px] flex-col gap-1">
      <p className="text-xsmall14 text-neutral-0 font-bold">{mentor.name}</p>
      <p className="text-xxsmall12 text-neutral-30">{mentor.description}</p>
    </div>
  </button>
);

const MentorSection = ({
  selectedMentorId,
  onSelect,
}: {
  selectedMentorId: string | null;
  onSelect: (id: string) => void;
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
          <SwiperSlide key={mentor.id} className="!w-auto">
            <MentorCard
              mentor={mentor}
              isSelected={selectedMentorId === mentor.id}
              onClick={() => onSelect(mentor.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default MentorSection;
