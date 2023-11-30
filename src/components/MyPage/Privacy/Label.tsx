import styled from 'styled-components';

const Label = styled.label`
  width: auto;
  font-weight: 500;
  margin-bottom: 0.5rem;

  @media (min-width: 640px) {
    margin-bottom: 0;
    margin-left: 0.5rem;
    width: 8rem;
  }
`;

export default Label;
