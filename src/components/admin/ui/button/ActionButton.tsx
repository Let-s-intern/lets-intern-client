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
      onClick={() => {
        onClick && onClick();
        to && (to === '-1' ? navigate(-1) : navigate(to));
      }}
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
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  width: ${(props) => props.$width};
  color: white;

  ${(props) =>
    props.$bgColor === 'green'
      ? 'background-color: #48bb78;'
      : props.$bgColor === 'red'
        ? 'background-color: #f56565;'
        : props.$bgColor === 'blue'
          ? 'background-color: #4f46e5;'
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
