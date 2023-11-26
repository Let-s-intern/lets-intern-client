import styled from 'styled-components';

import CardListSlider from '../CardListSlider';
import ApplicationCard from './ApplicationCard';
import { Section, SectionTitle } from '../Section';

const Application = () => {
  return (
    <ApplicationBlock>
      <Section>
        <SectionTitle>신청완료</SectionTitle>
        <CardListSlider>
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
        </CardListSlider>
      </Section>
      <Section>
        <SectionTitle>참여중</SectionTitle>
        <CardListSlider>
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
        </CardListSlider>
      </Section>
      <Section>
        <SectionTitle>참여완료</SectionTitle>
        <CardListSlider>
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
          <ApplicationCard />
        </CardListSlider>
      </Section>
    </ApplicationBlock>
  );
};

export default Application;

const ApplicationBlock = styled.div``;
