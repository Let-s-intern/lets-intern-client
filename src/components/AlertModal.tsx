import { Fragment } from 'react';
import styled, { css } from 'styled-components';

interface AlertModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  highlight?: 'confirm' | 'cancel';
  title: string;
  confirmText?: string;
  cancelText?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

interface ButtonProps {
  $highlight: 'confirm' | 'cancel';
  $disabled?: boolean;
}

const AlertModal = ({
  onConfirm,
  onCancel,
  highlight = 'cancel',
  title,
  confirmText = '확인',
  cancelText = '취소',
  children,
  disabled = false,
}: AlertModalProps) => {
  return (
    <ModalBackdrop>
      <ModalContainer>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button
            type="button"
            $highlight={highlight}
            $disabled={disabled}
            onClick={() => !disabled && onConfirm()}
          >
            {confirmText}
          </Button>
          <Button type="button" $highlight={highlight} onClick={onCancel}>
            {cancelText}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default AlertModal;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.h3`
  margin: 0;
  font-weight: 500;
  text-align: center;
`;

const ModalBody = styled.div`
  margin-top: 1.25rem;
  text-align: center;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: pre-line;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<ButtonProps>`
  margin: 0 5px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  ${({ $highlight }) =>
    $highlight === 'confirm'
      ? css`
          &:nth-child(1) {
            color: #6963ed;
          }
        `
      : css`
          &:nth-child(2) {
            color: #6963ed;
          }
        `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      &:nth-child(1) {
        color: #bcbcbc;
        cursor: auto;
      }
    `}
`;
