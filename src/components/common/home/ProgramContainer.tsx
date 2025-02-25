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
}

const ProgramContainer = ({ ...props }: ProgramContainerProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex w-full max-w-[1160px] flex-col gap-y-6 md:gap-y-10">
      <div className="flex w-full flex-col gap-y-4 px-5 md:px-0">
        <MoreHeader
          subtitle={props.subTitle}
          href={props.moreUrl}
          isVertical
          isBig
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
          className="w-full"
          autoplay={{ delay: 2500 }}
          modules={[Grid]}
          slidesPerView={isMobile ? 2.4 : 5}
          grid={
            !isMobile && props.showGrid
              ? { rows: 2, fill: 'row' }
              : { rows: 1, fill: 'row' }
          }
          spaceBetween={isMobile ? 12 : 26}
          slidesOffsetBefore={isMobile ? 20 : 0}
          slidesOffsetAfter={isMobile ? 20 : 0}
        >
          {props.programs.map((program, index) => (
            <SwiperSlide key={index}>
              <ProgramItem {...program} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProgramContainer;
