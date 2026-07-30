'use client';

import { useMediaQuery } from '@mui/material';
import { Fragment, ReactNode } from 'react';
import { Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import EmptyContainer from '@/common/container/EmptyContainer';
import { MOBILE_MEDIA_QUERY } from '@/utils/constants';

import MentorProgramItem, {
  MentorProgramItemProps,
} from '../ui/MentorProgramItem';

interface MentorProgramContainerProps {
  title: ReactNode;
  programs: MentorProgramItemProps[];
  showGrid?: boolean;
  gaItem: string;
  gaTitle: string;
  emptyText?: string;
}

const MentorProgramContainer = (props: MentorProgramContainerProps) => {
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (props.programs.length < 1) return null;

  return (
    <div className="flex w-full flex-col gap-y-6">
      {typeof props.title === 'string' ? (
        <h2 className="text-small20 md:text-medium24 text-neutral-0 font-bold">
          {props.title.split('\\n').map((line, index) => (
            <Fragment key={index}>
              {line} <br className="md:hidden" />
            </Fragment>
          ))}
        </h2>
      ) : (
        props.title
      )}

      {props.programs.length < 1 ? (
        <EmptyContainer
          className="h-[201px] md:h-[266px]"
          text={props.emptyText || '등록된 콘텐츠가 없습니다.'}
        />
      ) : (
        <Swiper
          key={props.title + '-slide'}
          className="w-full"
          modules={[Grid]}
          slidesPerView={2.4}
          grid={
            !isMobile && props.showGrid
              ? { rows: 2, fill: 'row' }
              : { rows: 1, fill: 'row' }
          }
          spaceBetween={12}
          slidesOffsetBefore={20}
          slidesOffsetAfter={20}
          breakpoints={{
            768: {
              spaceBetween: 16,
              slidesPerView: 3,
              slidesOffsetBefore: 20,
              slidesOffsetAfter: 20,
            },
            820: {
              spaceBetween: 16,
              slidesPerView: 4,
              slidesOffsetBefore: 20,
              slidesOffsetAfter: 20,
            },
            1040: {
              spaceBetween: 16,
              slidesPerView: 5,
              slidesOffsetBefore: 20,
              slidesOffsetAfter: 20,
            },
            1280: {
              spaceBetween: 16,
              slidesPerView: 5,
              slidesOffsetBefore: 0,
              slidesOffsetAfter: 0,
            },
          }}
        >
          {props.programs.map((program, index) => (
            <SwiperSlide key={index}>
              <MentorProgramItem {...program} className={props.gaItem} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default MentorProgramContainer;
