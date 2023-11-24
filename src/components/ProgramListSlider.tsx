import { useRef } from 'react';
import styled from 'styled-components';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

import Card from './Card';
import Program from '../interfaces/program';

interface SliderButtonProps {
  scrollContainer: React.RefObject<HTMLDivElement>;
  direction: 'prev' | 'next';
  className?: string;
}

interface ProgramListSliderProps {
  programs: Program[];
  cardType?: '신청 완료' | '참여 중' | '참여 완료' | '';
  loading?: boolean;
  page?: 'main' | 'review' | 'review-create' | 'application';
}

const SlideContent = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SlideButton = ({
  scrollContainer,
  direction,
  className,
}: SliderButtonProps) => {
  return (
    <button
      className={`hidden text-2xl sm:block${className ? ` ${className}` : ''}`}
      onClick={() => {
        if (scrollContainer.current === null) return;
        const offsetWidth = scrollContainer.current.offsetWidth;
        scrollContainer.current.scrollLeft +=
          direction === 'prev' ? -offsetWidth : offsetWidth;
      }}
    >
      <i>
        {direction === 'prev' ? <MdArrowBackIosNew /> : <MdArrowForwardIos />}
      </i>
    </button>
  );
};

const ProgramListSlider = ({
  programs,
  cardType = '',
  loading,
  page = 'main',
}: ProgramListSliderProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-3">
      <SlideButton scrollContainer={scrollContainer} direction="prev" />
      <SlideContent
        ref={scrollContainer}
        className="flex grow overflow-x-scroll scroll-smooth py-5"
      >
        {loading || programs?.length === 0 ? (
          <div className="h-[320px] w-full"></div>
        ) : (
          <div className="flex gap-5">
            {programs?.map((program) => {
              return (
                <Card
                  key={program?.id}
                  program={program}
                  reviewId={10}
                  cardType={cardType}
                  loading={loading}
                  page={page}
                />
              );
            })}
          </div>
        )}
      </SlideContent>
      <SlideButton scrollContainer={scrollContainer} direction="next" />
    </div>
  );
};

export default ProgramListSlider;
