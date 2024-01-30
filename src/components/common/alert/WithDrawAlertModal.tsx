import { useState } from 'react';
import cn from 'classnames';

import axios from '../../../utils/axios';
import AlertModal from '../../../pages/AlertModal';
import classes from './WithDrawAlertModal.module.scss';

interface WithDrawAlertModalProps {
  setIsWithdrawModal: (isWithdrawModal: boolean) => void;
}

const WithDrawAlertModal = ({
  setIsWithdrawModal,
}: WithDrawAlertModalProps) => {
  const [withdrawDisabled, setWithdrawDisabled] = useState(true);
  const [alertIndex, setAlertIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await axios.get('/user/withdraw');
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');
      setIsSuccess(true);
      setAlertIndex(1);
    } catch (err) {
      setIsSuccess(false);
      setAlertIndex(1);
    }
  };

  return alertIndex === 0 ? (
    <AlertModal
      title="회원 탈퇴"
      confirmText="탈퇴"
      cancelText="취소"
      onConfirm={() => handleDeleteAccount()}
      onCancel={() => setIsWithdrawModal(false)}
      disabled={withdrawDisabled}
      className={cn('withdraw-alert-modal', classes.modal)}
    >
      <ul>
        <li>탈퇴하시면 모든 데이터는 복구가 불가능합니다.</li>
        <li>신청현황, 후기를 포함한 모든 정보가 삭제됩니다.</li>
      </ul>
      <div className={classes.checkArea}>
        {!withdrawDisabled ? (
          <img
            className={classes.checkbox}
            src="/icons/checkbox-checked.svg"
            alt="check"
            onClick={() => setWithdrawDisabled(!withdrawDisabled)}
          />
        ) : (
          <img
            className={classes.checkbox}
            src="/icons/checkbox-unchecked.svg"
            alt="check"
            onClick={() => setWithdrawDisabled(!withdrawDisabled)}
          />
        )}
        <label
          htmlFor="agree"
          onClick={() => setWithdrawDisabled(!withdrawDisabled)}
        >
          안내사항을 모두 확인하였으며, 이에 동의합니다.
        </label>
      </div>
    </AlertModal>
  ) : (
    <AlertModal
      title={isSuccess ? '회원 탈퇴 성공' : '회원 탈퇴 실패'}
      confirmText="확인"
      onConfirm={() => {
        setIsWithdrawModal(false);
        if (isSuccess) {
          window.location.href = '/';
        } else {
          setAlertIndex(0);
        }
      }}
      showCancel={false}
      className={cn('withdraw-alert-modal', classes.modal)}
    >
      <p>
        {isSuccess
          ? '회원 탈퇴가 완료되었습니다.'
          : '회원 탈퇴를 실패하였습니다.'}
      </p>
    </AlertModal>
  );
};

export default WithDrawAlertModal;
