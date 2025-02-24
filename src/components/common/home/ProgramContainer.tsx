import { useMediaQuery } from '@mui/material';
import { ReactNode } from 'react';
import { Grid } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import MoreHeader from '../ui/MoreHeader';
import ProgramItem, { ProgramItemProps } from './ProgramItem';

interface ProgramContainerProps {
  title: ReactNode;
  subTitle?: string;
  moreUrl?: string;
  programs: ProgramItemProps[];
  showGrid?: boolean;
}

const ProgramContainer = ({ ...props }: ProgramContainerProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="flex w-full max-w-[1160px] flex-col gap-y-6">
      <div className="px-5 md:px-0">
        <MoreHeader
          subtitle={props.subTitle}
          href={props.moreUrl}
          isVertical
          isBig
        >
          {props.title}
        </MoreHeader>
      </div>
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
    </div>
  );
};

export default ProgramContainer;
