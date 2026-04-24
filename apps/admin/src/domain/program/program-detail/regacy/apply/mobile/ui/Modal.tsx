import styled, { css } from 'styled-components';
import { VscTriangleDown } from 'react-icons/vsc';

import ScrollBox from './Scrollbox';
import { useEffect, useRef } from 'react';

interface ModalProps {
  position: 'bottom' | 'center';
  nextButtonText?: string;
  isNextButtonDisabled?: boolean;
  onNextButtonClick: () => void;
  children: React.ReactNode;
  onFoldButtonClick?: () => void;
  hasFoldButton?: boolean;
  nextButtonClass?: string;
  nextButtonId?: string;
  message?: string;
  messageError?: unknown;
  applyPageIndex: number;
}

interface NextButtonProps {
  $disabled: boolean;
}

const Modal = ({
  position,
  nextButtonText = '다음',
  isNextButtonDisabled = false,
  onNextButtonClick,
  children,
  onFoldButtonClick,
  hasFoldButton = true,
  nextButtonClass,
  nextButtonId,
  message,
  messageError,
  applyPageIndex,
}: ModalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, 0);
    }
  }, [scrollRef, applyPageIndex]);

  return (
    <div
      className={`flex w-full cursor-auto flex-col items-center${
        position === 'bottom' ? ' fixed bottom-0' : ''
      }`}
    >
      <div
        className={`relative w-full bg-white shadow${
          position === 'bottom'
            ? ' fixed bottom-0 max-w-2xl rounded-tl-lg rounded-tr-lg'
            : ' rounded mx-5 max-w-md sm:mx-0'
        }`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {hasFoldButton && (
          <TopFoldButtonArea>
            <TopButton type="button" onClick={onFoldButtonClick}>
              <i>
                <VscTriangleDown />
              </i>
            </TopButton>
          </TopFoldButtonArea>
        )}
        <ScrollBox
          className="max-h-[400px] overflow-y-scroll px-6 py-8"
          ref={scrollRef}
        >
          {children}
        </ScrollBox>
        {message && (
          <BottomMessage $error={messageError}>{message}</BottomMessage>
        )}
        <NextButton
          type="button"
          $disabled={isNextButtonDisabled}
          onClick={(e) => {
            e.preventDefault();
            if (!isNextButtonDisabled) {
              onNextButtonClick();
            }
          }}
          className={nextButtonClass ? nextButtonClass : ''}
          {...(nextButtonId && { id: nextButtonId })}
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

const TopFoldButtonArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  transform: translateY(-100%);
`;

const TopButton = styled.button`
  width: 4rem;
  cursor: pointer;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  background-color: #ffffff;
  padding: 0.125rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BottomMessage = styled.span<{ $error: unknown }>`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  color: ${(props) => (props.$error ? css`#ef4444` : css`#7f7afc`)};
`;
