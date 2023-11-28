import styled from 'styled-components';

const InputControl = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  & + & {
    margin-top: 1rem;
  }
`;

export default InputControl;
