import styled from 'styled-components';

const ScrollableBox = styled.div`
  padding-right: 4px;
  overflow-y: auto;
  animation-duration: 500ms;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &.scrolling::-webkit-scrollbar-thumb {
    background: #a5a1fa;
    border-radius: 16px;
  }
`;

export default ScrollableBox;
