import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import cn from 'classnames';

import AlertModal from '../../AlertModal';

import classes from './MemberSelect.module.scss';

interface MemberSelectProps {
  setApplyPageIndex: (applyPageIndex: number) => void;
}

const MemberSelect = ({ setApplyPageIndex }: MemberSelectProps) => {
  const navigate = useNavigate();
  const params = useParams();

  const [memberChecked, setMemberChecked] = useState<'USER' | 'GUEST' | ''>('');
  const [isNextButtonDisabled, setIsNextButtonDisabled] = useState(true);
  const [isLoginModal, setIsLoginModal] = useState(false);

  const handleMemberSelected = (newMemberValue: 'USER' | 'GUEST') => {
    setMemberChecked(newMemberValue);
    setIsLoginModal(true);
  };

  const handleNextButtonClicked = () => {
    if (!isNextButtonDisabled) {
      setApplyPageIndex(2);
    }
  };

  const handleAlertConfirm = () => {
    setIsLoginModal(false);
    navigate(`/login?redirect=/program/detail/${params.programId}`);
    setMemberChecked('USER');
  };

  const handleAlertClose = () => {
    setIsLoginModal(false);
    memberChecked === 'GUEST'
      ? setMemberChecked('GUEST')
      : setMemberChecked('');
  };

  useEffect(() => {
    if (memberChecked !== '') {
      setIsNextButtonDisabled(false);
    } else {
      setIsNextButtonDisabled(true);
    }
  }, [memberChecked]);

  return (
    <div
      className={classes.content}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={classes.top}>
        <ul>
          <li onClick={() => handleMemberSelected('USER')}>
            {memberChecked === 'USER' && (
              <i>
                <img src="/icons/check.svg" alt="체크" />
              </i>
            )}
            <span>회원 신청</span>
          </li>
          <li onClick={() => handleMemberSelected('GUEST')}>
            {memberChecked === 'GUEST' && (
              <i>
                <img src="/icons/check.svg" alt="체크" />
              </i>
            )}
            <span>비회원 신청</span>
          </li>
        </ul>
      </div>
      {isLoginModal && memberChecked === 'USER' && (
        <AlertModal
          title="로그인이 필요합니다."
          onConfirm={handleAlertConfirm}
          onCancel={handleAlertClose}
          highlight="confirm"
        >
          회원 신청을 하기 위해서는
          <br />
          로그인이 필요합니다.
          <br />
          로그인 페이지로 이동하시겠습니까?
        </AlertModal>
      )}
      {isLoginModal && memberChecked === 'GUEST' && (
        <AlertModal
          title="회원으로 지원하면 마이페이지에서<br />신청현황을 확인하실 수 있습니다."
          onConfirm={handleAlertClose}
          onCancel={handleAlertConfirm}
          highlight="cancel"
          confirmText="비회원으로 신청"
          cancelText="회원으로 신청"
        >
          비회원으로 지원 시 다시 지원하거나
          <br />
          취소할 수 없습니다.
        </AlertModal>
      )}
      <button
        className={cn('member-type-next-button', 'next-button', {
          disabled: isNextButtonDisabled,
        })}
        onClick={handleNextButtonClicked}
      >
        다음
      </button>
    </div>
  );
};

export default MemberSelect;
