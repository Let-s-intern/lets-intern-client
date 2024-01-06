import { useRef } from 'react';
import styled, { css } from 'styled-components';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';
import cn from 'classnames';

interface CardListSliderProps {
  isEmpty?: boolean;
  children: React.ReactNode;
  className?: string;
}

interface CardListContentProps {
  $isEmpty?: boolean;
}

const CardListSlider = ({
  children,
  isEmpty = false,
  className,
}: CardListSliderProps) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const handlePrevButtonClick = () => {
    if (scrollContainer.current === null) return;
    const offsetWidth = scrollContainer.current.offsetWidth;
    scrollContainer.current.scrollLeft -= offsetWidth;
  };

  const handleNextButtonClick = () => {
    if (scrollContainer.current === null) return;
    const offsetWidth = scrollContainer.current.offsetWidth;
    scrollContainer.current.scrollLeft += offsetWidth;
  };

  return (
    <>
      <CardListSliderBlock
        className={cn('card-list-slider', {
          [className as string]: className,
        })}
      >
        <SliderPrevButton onClick={handlePrevButtonClick}>
          <i>
            <MdArrowBackIosNew />
          </i>
        </SliderPrevButton>
        <CardListContent $isEmpty={isEmpty} ref={scrollContainer}>
          <CardList>{children}</CardList>
        </CardListContent>
        <SliderNextButton onClick={handleNextButtonClick}>
          <i>
            <MdArrowForwardIos />
          </i>
        </SliderNextButton>
      </CardListSliderBlock>
    </>
  );
};

export default CardListSlider;

const CardListSliderBlock = styled.div`
  display: flex;
  gap: 1rem;
`;

const CardListContent = styled.div<CardListContentProps>`
  display: flex;
  ${(props) =>
    props.$isEmpty &&
    css`
      justify-content: center;
    `}
  overflow-x: scroll;
  scroll-behavior: smooth;
  width: 100%;
  height: 300px;
  flex-grow: 1;
  scrollbar-width: none; /* FireFox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera, ... */
  }

  &::-ms-scrollbar {
    display: none; /* Internet Explorer, Edge */
  }
`;

const CardList = styled.div`
  display: flex;
  gap: 1rem;
  height: 100%;
`;

const SliderPrevButton = styled.button`
  font-size: 1.25rem;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;

const SliderNextButton = styled.button`
  font-size: 1.25rem;
  display: none;

  @media (min-width: 640px) {
    display: block;
  }
`;
