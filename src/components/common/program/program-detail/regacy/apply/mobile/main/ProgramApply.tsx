import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled, { css } from 'styled-components';
import axios from '../../../../../../../../utils/axios';
import {
  isValidEmail,
  isValidPhoneNumber,
} from '../../../../../../../../utils/valid';
import AlertModal from '../../../../../../../ui/alert/AlertModal';
import CautionContent from '../content/CautionContent';
import MemberInfoInputContent from '../content/MemberInfoInputContent';
import MemberTypeContent from '../content/MemberTypeContent';
import ResultContent from '../content/ResultContent';
import Modal from '../ui/Modal';

interface ProgramApplyProps {
  user: any;
  hasDetailInfo: boolean;
  isLoggedIn: boolean;
  program: any;
  memberChecked: 'USER' | 'GUEST' | '';
  applyPageIndex: number;
  wishJobList: any;
  setUser: (user: any) => void;
  setMemberChecked: (memberChecked: 'USER' | 'GUEST' | '') => void;
  setApplyPageIndex: (applyPageIndex: number) => void;
  setParticipated: (participated: boolean) => void;
  isApplyModalOpen: boolean;
  setIsApplyModalOpen: (isApplyModalOpen: boolean) => void;
  couponDiscount: number;
  setCouponDiscount: (couponDiscount: number) => void;
}

interface BlackBackgroundProps {
  $position: 'bottom' | 'center';
  $modalOpen: boolean;
}

/** @deprecated */
const ProgramApply = ({
  user,
  hasDetailInfo,
  isLoggedIn,
  program,
  memberChecked,
  applyPageIndex,
  wishJobList,
  setUser,
  setMemberChecked,
  setApplyPageIndex,
  setParticipated,
  setIsApplyModalOpen,
  couponDiscount,
  setCouponDiscount,
  isApplyModalOpen,
}: ProgramApplyProps) => {
  const navigate = useNavigate();
  const params = useParams();
  const [cautionChecked, setCautionChecked] = useState<boolean>(false);
  const [isNextButtonDisabled, setIsNextButtonDisabled] =
    useState<boolean>(false);
  const [announcementDate, setAnnouncementDate] = useState<string>('');
  const [bottomMessage, setBottomMessage] = useState<string>('');
  const [submitError, setSubmitError] = useState<unknown>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    title: '',
    message: '',
  });

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
      (isLoggedIn ? user.major && user.university : true) &&
      user.inflowPath &&
      (program.feeType === 'REFUND'
        ? user.accountType && user.accountNumber
        : true) &&
      (program.way === 'ALL' ? user.way : true)
    ) {
      setIsNextButtonDisabled(false);
    }
  }, [applyPageIndex, user, program]);

  const handleApplyNextButton = () => {
    if (applyPageIndex === 1) {
      if (!isValidEmail(user.email)) {
        setAlertInfo({
          title: '신청 정보 오류',
          message: '이메일 형식이 올바르지 않습니다.',
        });
        setShowAlert(true);
        return;
      } else if (!isValidPhoneNumber(user.phoneNum)) {
        setAlertInfo({
          title: '신청 정보 오류',
          message: '휴대폰 번호 형식이 올바르지 않습니다.',
        });
        setShowAlert(true);
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
    setBottomMessage('신청 작업을 진행중입니다.');
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
      setBottomMessage('신청 작업이 완료되었습니다.');
      setAnnouncementDate(res.data.announcementDate);
      setApplyPageIndex(applyPageIndex + 1);
    } catch (error) {
      setSubmitError(error);
      if ((error as any).response.status === 400) {
        setBottomMessage((error as any).response.data.reason);
      } else {
        setBottomMessage('신청 작업 도중 오류가 발생했습니다.');
      }
    }
  };

  const handleCautionChecked = () => {
    setIsNextButtonDisabled(cautionChecked);
    setCautionChecked(!cautionChecked);
  };

  return applyPageIndex === 0 ? (
    <BlackBackground
      $position="bottom"
      onClick={handleApplyModalClose}
      $modalOpen={isApplyModalOpen}
    >
      <Modal
        nextButtonText="다음"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
        onFoldButtonClick={handleApplyModalClose}
        nextButtonClass="member-type-next-button"
        nextButtonId="member_type_next_button"
        applyPageIndex={applyPageIndex}
      >
        <MemberTypeContent
          memberChecked={memberChecked}
          setMemberChecked={setMemberChecked}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 1 ? (
    <BlackBackground
      $position="bottom"
      onClick={handleApplyModalClose}
      $modalOpen={isApplyModalOpen}
    >
      <Modal
        nextButtonText="다음"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
        isNextButtonDisabled={isNextButtonDisabled}
        onFoldButtonClick={handleApplyModalClose}
        nextButtonClass="member-info-input-next-button"
        nextButtonId="member_info_input_next_button"
        applyPageIndex={applyPageIndex}
      >
        {showAlert && (
          <AlertModal
            onConfirm={() => setShowAlert(false)}
            title={alertInfo.title}
            showCancel={false}
            highlight="confirm"
          >
            <p>{alertInfo.message}</p>
          </AlertModal>
        )}
        <MemberInfoInputContent
          user={user}
          setUser={setUser}
          hasDetailInfo={hasDetailInfo}
          isLoggedIn={isLoggedIn}
          wishJobList={wishJobList}
          handleApplyInput={handleApplyInput}
          program={program}
          couponDiscount={couponDiscount}
          setCouponDiscount={setCouponDiscount}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 2 ? (
    <BlackBackground
      $position="center"
      onClick={handleApplyModalClose}
      $modalOpen={isApplyModalOpen}
    >
      <Modal
        nextButtonText="제출하기"
        position="bottom"
        onNextButtonClick={handleApplyNextButton}
        isNextButtonDisabled={isNextButtonDisabled}
        onFoldButtonClick={handleApplyModalClose}
        nextButtonClass="caution-next-button"
        nextButtonId="complete_button"
        message={bottomMessage}
        messageError={submitError}
        applyPageIndex={applyPageIndex}
      >
        <CautionContent
          cautionChecked={cautionChecked}
          onCautionChecked={handleCautionChecked}
          notice={program.notice}
          program={program}
          couponDiscount={couponDiscount}
        />
      </Modal>
    </BlackBackground>
  ) : applyPageIndex === 3 ? (
    <BlackBackground
      $position="center"
      onClick={handleApplyModalClose}
      $modalOpen={isApplyModalOpen}
    >
      <Modal
        nextButtonText={isLoggedIn ? '신청서 확인하기' : '닫기'}
        position="center"
        onNextButtonClick={handleApplyNextButton}
        hasFoldButton={false}
        nextButtonClass="close-button"
        nextButtonId="close_button"
        applyPageIndex={applyPageIndex}
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
  display: ${({ $modalOpen }) => ($modalOpen ? 'flex' : 'none')};
  width: 100vw;
  height: 100vh;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.5);

  ${({ $position }) =>
    $position === 'bottom'
      ? css`
          align-items: flex-end;
        `
      : css`
          align-items: center;
          justify-content: center;
        `}
`;
