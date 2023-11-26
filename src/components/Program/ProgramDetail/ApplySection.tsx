import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../../Button';

interface ApplySectionProps {
  programId: number;
}

const ApplySection = ({ programId }: ApplySectionProps) => {
  return (
    <ApplySectionBlock>
      <ApplyButtonWrapper>
        <ApplyButton to={`/program/${programId}/apply`}>신청하기</ApplyButton>
      </ApplyButtonWrapper>
      <ApplyFormArea>
        <Outlet />
      </ApplyFormArea>
    </ApplySectionBlock>
  );
};

export default ApplySection;

const ApplySectionBlock = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 30;
`;

const ApplyButtonWrapper = styled.div`
  position: fixed;
  bottom: 1rem;
  display: flex;
  width: 100%;
  justify-content: start;
  padding: 0 1rem;

  @media (min-width: 640px) {
    justify-content: center;
  }
`;

const ApplyButton = styled(Button)`
  width: 100%;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);

  @media (min-width: 640px) {
    width: auto;
  }
`;

const ApplyFormArea = styled.div``;
