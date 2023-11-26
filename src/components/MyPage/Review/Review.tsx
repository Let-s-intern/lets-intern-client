import styled from 'styled-components';

import CardListSlider from '../CardListSlider';
import { Section, SectionTitle } from '../Section';
import ReviewCard from './ReviewCard';

const Review = () => {
  return (
    <ReviewBlock>
      <Section>
        <SectionTitle>후기를 기다리고 있어요</SectionTitle>
        <CardListSlider>
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </CardListSlider>
      </Section>
      <Section>
        <SectionTitle>작성한 후기 확인하기</SectionTitle>
        <CardListSlider>
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
          <ReviewCard />
        </CardListSlider>
      </Section>
    </ReviewBlock>
  );
};

export default Review;

const ReviewBlock = styled.div``;
