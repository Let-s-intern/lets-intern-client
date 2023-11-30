import styled from 'styled-components';

const InputControl = styled.div`
  display: flex;
  flex-direction: column;

  & + & {
    margin-top: 1rem;
  }

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
`;

export default InputControl;
