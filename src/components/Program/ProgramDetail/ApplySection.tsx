import styled from 'styled-components';

import Button from '../../Button';

interface ApplySectionProps {
  program: any;
  handleApplyButtonClick: () => void;
  participated: boolean;
  isFirstOpen: boolean;
}

const ApplySection = ({
  program,
  handleApplyButtonClick,
  participated,
  isFirstOpen,
}: ApplySectionProps) => {
  return (
    <ApplySectionBlock>
      <ApplyButtonWrapper>
        <ApplyButton
          disabled={program.status !== 'OPEN' || participated}
          onClick={() => {
            if (!participated) {
              handleApplyButtonClick();
            }
          }}
        >
          {program.status !== 'OPEN'
            ? '신청 마감'
            : participated
            ? '신청 완료'
            : isFirstOpen
            ? '신청하기'
            : '이어서 신청하기'}
        </ApplyButton>
      </ApplyButtonWrapper>
    </ApplySectionBlock>
  );
};

export default ApplySection;

const ApplySectionBlock = styled.section`
  position: sticky;
  bottom: 1rem;
  left: 0;
  z-index: 30;
  margin-top: 5rem;
`;

const ApplyButtonWrapper = styled.div`
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
