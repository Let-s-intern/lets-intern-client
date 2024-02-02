import styled from 'styled-components';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { Modal } from '@mui/material';

import ActionButton from '../../../ui/button/ActionButton';

interface UserMemoModalProps {
  memoValue: string;
  isModalOpen: boolean;
  onClose: () => void;
  handleMemoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleMemoCreate: (e: any) => void;
}

const UserMemoModal = (props: UserMemoModalProps) => {
  return (
    <Modal
      open={props.isModalOpen}
      onClose={props.onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContent>
        <ModalHeader>
          <ModalTitle>메모</ModalTitle>
          <ModalCloseButton onClick={props.onClose}>
            <i>
              <IoIosCloseCircleOutline />
            </i>
          </ModalCloseButton>
        </ModalHeader>
        <MemoForm onSubmit={props.handleMemoCreate}>
          <MemoLabel htmlFor="content">내용</MemoLabel>
          <MemoInput
            id="content"
            placeholder="메모를 입력하세요."
            value={props.memoValue}
            onChange={props.handleMemoChange}
          ></MemoInput>
          <ButtonWrapper>
            <ActionButton bgColor="green">등록</ActionButton>
          </ButtonWrapper>
        </MemoForm>
      </ModalContent>
    </Modal>
  );
};

export default UserMemoModal;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 600px;
`;

const ModalHeader = styled.div`
  width: 100%;
  background-color: #cdcdcdff;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MemoForm = styled.form`
  background-color: white;
  padding: 1rem 1.5rem;
`;

const MemoLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #505050;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
`;

const ModalCloseButton = styled.button`
  font-size: 1.5rem;
`;

const MemoInput = styled.textarea`
  outline: none;
  resize: none;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
`;

const ButtonWrapper = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: center;
`;
