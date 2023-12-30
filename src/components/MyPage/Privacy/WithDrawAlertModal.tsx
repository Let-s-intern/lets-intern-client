import styled from 'styled-components';
import { useState } from 'react';

import AlertModal from '../../AlertModal';

import './WithDrawAlertModal.scss';

interface WithDrawAlertModalProps {
  onDeleteAccount: () => void;
  setIsWithdrawModal: (isWithdrawModal: boolean) => void;
}

const WithDrawAlertModal = ({
  onDeleteAccount,
  setIsWithdrawModal,
}: WithDrawAlertModalProps) => {
  const [withdrawDisabled, setWithdrawDisabled] = useState(true);

  const onConfirm = () => {
    onDeleteAccount();
    setIsWithdrawModal(false);
  };

  const onCancel = () => {
    setIsWithdrawModal(false);
  };

  return (
    <AlertModal
      title="회원 탈퇴"
      confirmText="탈퇴"
      cancelText="취소"
      onConfirm={onConfirm}
      onCancel={onCancel}
      disabled={withdrawDisabled}
      className="withdraw-alert-modal"
    >
      <ul>
        <li>탈퇴하시면 모든 데이터는 복구가 불가능합니다.</li>
        <li>신청현황, 후기를 포함한 모든 정보가 삭제됩니다.</li>
      </ul>
      <div className="agree-check-area">
        {!withdrawDisabled ? (
          <img
            className="checkbox"
            src="/icons/checkbox-checked.svg"
            alt="check"
            onClick={() => setWithdrawDisabled(!withdrawDisabled)}
          />
        ) : (
          <img
            className="checkbox"
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
  );
};

export default WithDrawAlertModal;
