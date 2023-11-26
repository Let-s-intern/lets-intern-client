import styled from 'styled-components';

export const Section = styled.section`
  & + & {
    margin-top: 3rem;
  }
`;

export const SectionTitle = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;
