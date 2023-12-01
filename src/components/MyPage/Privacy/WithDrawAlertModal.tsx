import styled from 'styled-components';
import AlertModal from '../../AlertModal';
import { useState } from 'react';

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
    >
      <div>
        <Ul>
          <li>탈퇴하시면 모든 데이터는 복구가 불가능합니다.</li>
          <li>신청현황, 후기를 포함한 모든 정보가 삭제됩니다.</li>
        </Ul>
        <AgreeArea>
          {!withdrawDisabled ? (
            <CheckIcon
              src="/icons/checkbox-checked.svg"
              alt="check"
              onClick={() => setWithdrawDisabled(!withdrawDisabled)}
            />
          ) : (
            <CheckIcon
              src="/icons/checkbox-unchecked.svg"
              alt="check"
              onClick={() => setWithdrawDisabled(!withdrawDisabled)}
            />
          )}
          <Label
            htmlFor="agree"
            onClick={() => setWithdrawDisabled(!withdrawDisabled)}
          >
            안내사항을 모두 확인하였으며, 이에 동의합니다.
          </Label>
        </AgreeArea>
      </div>
    </AlertModal>
  );
};

export default WithDrawAlertModal;

const Ul = styled.ul`
  list-style: disc;
  padding-inline-start: 30px;
  text-align: left;
  font-size: 0.875rem;
`;

const AgreeArea = styled.div`
  margin-top: 1rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const CheckIcon = styled.img`
  cursor: pointer;
`;

const Label = styled.label`
  cursor: pointer;
`;
