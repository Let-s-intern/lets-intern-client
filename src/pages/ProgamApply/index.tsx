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
  cautionChecked: boolean;
  notice: string;
  program: any;
  announcementDate: string;
  programType: string;
  handleApplyModalClose: () => void;
  handleApplyNextButton: () => void;
  handleApplyInput: (e: any) => void;
  handleCautionChecked: () => void;
  memberChecked: 'USER' | 'GUEST' | '';
  setMemberChecked: (memberChecked: 'USER' | 'GUEST' | '') => void;
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
  cautionChecked,
  notice,
  program,
  announcementDate,
  programType,
  handleApplyModalClose,
  handleApplyNextButton,
  handleApplyInput,
  handleCautionChecked,
  memberChecked,
  setMemberChecked,
}: ProgramApplyProps) => {
  return applyPageIndex === 0 ? (
    <BlackBackground $position="bottom" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="다음"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
      >
        <MemberTypeContent
          isLoggedIn={isLoggedIn}
          memberChecked={memberChecked}
          setMemberChecked={setMemberChecked}
        />
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
          programType={programType}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 2 ? (
    <BlackBackground $position="center" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="다음"
        position="center"
        onNextButtonClick={handleApplyNextButton}
        isNextButtonDisabled={isNextButtonDisabled}
      >
        <CautionContent
          cautionChecked={cautionChecked}
          onCautionChecked={handleCautionChecked}
          notice={notice}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 3 ? (
    <BlackBackground $position="center" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText={isLoggedIn ? '신청서 확인하기' : '닫기'}
        position="center"
        onNextButtonClick={handleApplyNextButton}
      >
        <ResultContent announcementDate={announcementDate} />
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
