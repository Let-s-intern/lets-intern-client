import { useRef } from 'react';
import styled from 'styled-components';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

import Card from './Card';
import Program from '../interfaces/program';

interface SliderButtonProps {
  scrollContainer: React.RefObject<HTMLDivElement>;
  direction: 'prev' | 'next';
}

interface ProgramListSliderProps {
  programs: Program[];
}

const SlideContent = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SlideButton = ({ scrollContainer, direction }: SliderButtonProps) => {
  return (
    <button
      className="text-2xl"
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

const ProgramListSlider = ({ programs }: ProgramListSliderProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="flex items-center gap-3">
      <SlideButton scrollContainer={scrollContainer} direction="prev" />
      <SlideContent
        ref={scrollContainer}
        className="flex overflow-x-scroll scroll-smooth py-5"
      >
        <div className="flex gap-5">
          {programs.map((program) => (
            <Card key={program.id} program={program} className="w-72" />
          ))}
        </div>
      </SlideContent>
      <SlideButton scrollContainer={scrollContainer} direction="next" />
    </div>
  );
};

export default ProgramListSlider;
