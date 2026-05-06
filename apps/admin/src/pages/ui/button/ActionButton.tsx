import { twMerge } from '@/lib/twMerge';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type BackgroundColor = 'red' | 'green' | 'blue' | 'lightBlue' | 'gray';

interface ActionButtonProps {
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  bgColor?: BackgroundColor;
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  className?: string;
  disabled?: boolean;
}

interface ActionButtonBlockProps {
  $bgColor?: BackgroundColor;
  $width?: string;
}

const ActionButton = ({
  type = 'submit',
  width = '5rem',
  bgColor = 'blue',
  onClick,
  to,
  children,
  className,
  disabled,
}: ActionButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // onClick 콜백이 있으면 실행
    onClick?.();

    if (to) {
      if (to === '-1') {
        navigate(-1);
      } else {
        navigate(to);
      }
    }
  };

  return (
    <ActionButtonBlock
      type={type}
      className={twMerge(
        'transition',
        !disabled && 'hover:opacity-80',
        className,
      )}
      $bgColor={bgColor}
      $width={width}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </ActionButtonBlock>
  );
};

export default ActionButton;

const ActionButtonBlock = styled.button<ActionButtonBlockProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  min-width: ${(props) => props.$width};
  white-space: nowrap;
  color: white;

  ${(props) =>
    props.$bgColor === 'green'
      ? 'background-color: #48bb78;'
      : props.$bgColor === 'red'
        ? 'background-color: #f56565;'
        : props.$bgColor === 'blue'
          ? 'background-color: #1976D2;'
          : props.$bgColor === 'lightBlue'
            ? 'background-color: #4299e1;'
            : props.$bgColor === 'gray'
              ? 'background-color: #718096;'
              : ''}

  &:disabled {
    background-color: #e2e8f0;
    color: #a0aec0;
  }
`;
