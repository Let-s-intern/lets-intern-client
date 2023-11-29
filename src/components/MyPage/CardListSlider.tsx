import { useRef } from 'react';
import styled from 'styled-components';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

interface CardListSliderProps {
  children: React.ReactNode;
}

const CardListSlider = ({ children }: CardListSliderProps) => {
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
      <CardListSliderBlock>
        <SliderPrevButton onClick={handlePrevButtonClick}>
          <i>
            <MdArrowBackIosNew />
          </i>
        </SliderPrevButton>
        <CardListContent ref={scrollContainer}>
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

const CardListContent = styled.div`
  display: flex;
  overflow-x: scroll;
  scroll-behavior: smooth;
  width: 100%;
  height: 300px;
  flex-grow: 1;

  &::-webkit-scrollbar {
    display: none;
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
