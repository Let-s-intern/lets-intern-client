import styled from 'styled-components';
import { ModalProps } from '../interface';
import ScrollBox from './Scrollbox';

interface NextButtonProps {
  $disabled: boolean;
}

const Modal = ({
  position,
  nextButtonText = '다음',
  isNextButtonDisabled = false,
  onNextButtonClick,
  children,
}: ModalProps) => {
  return (
    <div
      className={`flex w-full cursor-auto justify-center${
        position === 'bottom' ? ' fixed bottom-0' : ''
      }`}
    >
      <div
        className={`w-full bg-white shadow${
          position === 'bottom'
            ? ' fixed bottom-0 max-w-2xl rounded-tl-2xl rounded-tr-2xl'
            : ' mx-5 max-w-md rounded sm:mx-0'
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ScrollBox className="max-h-[400px] overflow-y-scroll px-6 py-8">
          {children}
        </ScrollBox>
        <NextButton
          type="submit"
          $disabled={isNextButtonDisabled}
          onClick={() => {
            if (!isNextButtonDisabled) {
              onNextButtonClick();
            }
          }}
        >
          {nextButtonText}
        </NextButton>
      </div>
    </div>
  );
};

export default Modal;

const NextButton = styled.button<NextButtonProps>`
  width: 100%;
  background-color: ${({ $disabled }) => ($disabled ? `#A5A1FA;` : `#6963f6;`)};
  padding: 0.75rem 0;
  font-weight: 500;
  color: white;
  cursor: ${({ $disabled }) => ($disabled ? `auto` : `pointer`)};
`;
