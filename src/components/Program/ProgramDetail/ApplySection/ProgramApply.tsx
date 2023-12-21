import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import axios from '../../../../libs/axios';
import CautionContent from './CautionContent';
import Modal from './Modal';
import ResultContent from './ResultContent';

import MemberInfoInputContent from './MemberInfoInputContent';
import { isValidEmail, isValidPhoneNumber } from '../../../../libs/valid';
import MemberTypeContent from './MemberTypeContent';

interface ProgramApplyProps {
  user: any;
  hasDetailInfo: boolean;
  isLoggedIn: boolean;
  program: any;
  memberChecked: 'USER' | 'GUEST' | '';
  applyPageIndex: number;
  setUser: (user: any) => void;
  setMemberChecked: (memberChecked: 'USER' | 'GUEST' | '') => void;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setParticipated: (participated: boolean) => void;
  setIsApplyModalOpen: (isApplyModalOpen: boolean) => void;
}

interface BlackBackgroundProps {
  $position: 'bottom' | 'center';
}

const ProgramApply = ({
  user,
  hasDetailInfo,
  isLoggedIn,
  program,
  memberChecked,
  applyPageIndex,
  setUser,
  setMemberChecked,
  setApplyPageIndex,
  setParticipated,
  setIsApplyModalOpen,
}: ProgramApplyProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const [cautionChecked, setCautionChecked] = useState<boolean>(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(false);
  const [announcementDate, setAnnouncementDate] = useState<string>('');

  useEffect(() => {
    if (applyPageIndex !== 1) {
      return;
    }
    setIsNextButtonDisabled(true);
    if (
      user.grade &&
      user.wishCompany &&
      user.wishJob &&
      user.applyMotive &&
      user.name &&
      user.email &&
      user.phoneNum &&
      user.major &&
      user.university &&
      user.inflowPath &&
      (program.way === 'ALL' ? user.way : true)
    ) {
      setIsNextButtonDisabled(false);
    }
  }, [applyPageIndex, user, program]);

  const handleApplyNextButton = () => {
    if (applyPageIndex === 1) {
      if (!isValidEmail(user.email)) {
        alert('이메일 형식이 올바르지 않습니다.');
        return;
      } else if (!isValidPhoneNumber(user.phoneNum)) {
        alert('휴대폰 번호 형식이 올바르지 않습니다.');
        return;
      }
      setApplyPageIndex(applyPageIndex + 1);
      setCautionChecked(false);
      setIsNextButtonDisabled(true);
    } else if (applyPageIndex === 2) {
      handleApplySubmit();
    } else if (applyPageIndex === 3) {
      if (isLoggedIn) {
        navigate('/mypage/application');
      } else {
        handleApplyModalClose();
      }
    } else {
      setApplyPageIndex(applyPageIndex + 1);
    }
  };

  const handleApplyModalClose = () => {
    if (applyPageIndex === 3) {
      setApplyPageIndex(0);
      setUser({
        name: '',
        email: '',
        phoneNum: '',
        major: '',
        university: '',
        grade: '',
        wishCompany: '',
        wishJob: '',
        applyMotive: '',
        preQuestions: '',
        way: '',
      });
      setParticipated(true);
      setIsApplyModalOpen(false);
    } else {
      setIsApplyModalOpen(false);
    }
  };

  const handleApplyInput = (e: any) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleApplySubmit = async () => {
    try {
      let newUser = { ...user, grade: Number(user.grade) };
      if (program.way !== 'ALL') {
        delete newUser.way;
      }
      if (!isLoggedIn) {
        delete newUser.name;
        delete newUser.email;
        delete newUser.phoneNum;
        newUser = {
          ...newUser,
          guestName: user.name,
          guestEmail: user.email,
          guestPhoneNum: user.phoneNum,
        };
      }
      const res = await axios.post(
        `/application/${params.programId}`,
        newUser,
        {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        },
      );
      setAnnouncementDate(res.data.announcementDate);
      setApplyPageIndex(applyPageIndex + 1);
    } catch (error) {
      if ((error as any).response.status === 400) {
        alert((error as any).response.data.reason);
      }
      console.error(error);
    }
  };

  const handleCautionChecked = () => {
    setIsNextButtonDisabled(cautionChecked);
    setCautionChecked(!cautionChecked);
  };

  return applyPageIndex === 0 ? (
    <BlackBackground $position="bottom" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText="다음"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
        onFoldButtonClick={handleApplyModalClose}
        nextButtonClass="member-type-next-button"
      >
        <MemberTypeContent
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
        onFoldButtonClick={handleApplyModalClose}
        nextButtonClass="member-info-input-next-button"
      >
        <MemberInfoInputContent
          user={user}
          hasDetailInfo={hasDetailInfo}
          isLoggedIn={isLoggedIn}
          handleApplyInput={handleApplyInput}
          program={program}
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
        hasFoldButton={false}
        nextButtonClass="caution-next-button"
      >
        <CautionContent
          cautionChecked={cautionChecked}
          onCautionChecked={handleCautionChecked}
          notice={program.notice}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 3 ? (
    <BlackBackground $position="center" onClick={handleApplyModalClose}>
      <Modal
        nextButtonText={isLoggedIn ? '신청서 확인하기' : '닫기'}
        position="center"
        onNextButtonClick={handleApplyNextButton}
        hasFoldButton={false}
        nextButtonClass="complete-button"
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
