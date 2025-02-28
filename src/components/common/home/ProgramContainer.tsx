import { useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import { Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import EmptyContainer from '../ui/EmptyContainer';
import MoreHeader from '../ui/MoreHeader';
import ProgramItem, { ProgramItemProps } from './ProgramItem';

interface ProgramContainerProps {
  title: ReactNode;
  navigation?: {
    text: string;
    active: boolean;
    onClick: () => void;
  }[];
  subTitle?: string;
  moreUrl?: string;
  programs: ProgramItemProps[];
  showGrid?: boolean;
  gaItem: string;
  gaTitle: string;
}

const ProgramContainer = (props: ProgramContainerProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (props.programs.length < 1) return null;

  return (
    <div className="flex w-full max-w-[1120px] flex-col gap-y-6 md:gap-y-10">
      <div className="flex w-full flex-col gap-y-4 px-5 xl:px-0">
        <MoreHeader
          subtitle={props.subTitle}
          href={props.moreUrl}
          isVertical
          isBig
          gaText={props.gaTitle}
        >
          {props.title}
        </MoreHeader>
        {props.navigation && (
          <div className="flex w-fit items-center gap-x-2 overflow-auto scrollbar-hide">
            {props.navigation.map((nav, index) => (
              <button
                key={index}
                className={`shrink-0 rounded-xs px-3 py-2 text-xsmall14 font-medium ${
                  nav.active
                    ? 'bg-neutral-10 text-white'
                    : 'bg-neutral-90 text-neutral-35'
                }`}
                onClick={nav.onClick}
              >
                {nav.text}
              </button>
            ))}
          </div>
        )}
      </div>
      {props.programs.length < 1 ? (
        <EmptyContainer />
      ) : (
        <Swiper
          // program 바뀔 경우 스크롤 위치 초기화 위해 key로 리렌더링 적용
          key={props.programs[0].title + props.programs.length + '-slide'}
          className="w-full"
          autoplay={{ delay: 2500 }}
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
              <ProgramItem {...program} className={props.gaItem} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProgramContainer;
