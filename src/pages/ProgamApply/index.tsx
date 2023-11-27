import styled from 'styled-components';

import CautionContent from './components/CautionContent';
import Modal from './components/Modal';
import ResultContent from './components/ResultContent';
import MemberTypeContent from './components/MemberTypeContent';
import MemberInfoInputContent from './components/MemberInfoInputContent';

interface ProgramApplyProps {
  applyPageIndex: number;
  user: any;
  hasDetailInfo: boolean;
  isLoggedIn: boolean;
  isNextButtonDisabled: boolean;
  handleApplyModalClose: () => void;
  handleApplyNextButton: () => void;
  handleApplyInput: (e: any) => void;
}

interface BlackBackgroundProps {
  $position: 'bottom' | 'center';
}

const ProgramApply = ({
  applyPageIndex,
  user,
  hasDetailInfo,
  isLoggedIn,
  isNextButtonDisabled,
  handleApplyModalClose,
  handleApplyNextButton,
  handleApplyInput,
}: ProgramApplyProps) => {
  return applyPageIndex === 0 ? (
    <BlackBackground $position="bottom" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="다음"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
      >
        <MemberTypeContent />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 1 ? (
    <BlackBackground $position="bottom" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="다음"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
        isNextButtonDisabled={isNextButtonDisabled}
      >
        <MemberInfoInputContent
          user={user}
          hasDetailInfo={hasDetailInfo}
          isLoggedIn={isLoggedIn}
          handleApplyInput={handleApplyInput}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 2 ? (
    <BlackBackground $position="center" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="다음"
        position="center"
        onNextButtonClick={handleApplyNextButton}
      >
        <CautionContent
          cautionChecked={false}
          onCautionChecked={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 3 ? (
    <BlackBackground $position="center" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="신청서 확인하기"
        position="center"
        onNextButtonClick={handleApplyNextButton}
      >
        <ResultContent />
      </Modal>
    </BlackBackground>
  ) : null;
};

export default ProgramApply;

const BlackBackground = styled.div<BlackBackgroundProps>`
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  display: flex;
  width: 100vw;
  height: 100vh;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);

  ${({ $position }) =>
    $position === 'bottom'
      ? `align-items: flex-end;`
      : `align-items: center; justify-content: center;`}
`;
