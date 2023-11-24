import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

type BackgroundColor = 'red' | 'green' | 'blue' | 'lightBlue';

interface ActionButtonProps {
  bgColor?: BackgroundColor;
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
}

interface ActionButtonBlockProps {
  $bgColor?: BackgroundColor;
}

const ActionButtonBlock = styled.button<ActionButtonBlockProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  padding: 0.25rem 0.75rem;
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
      : ''}
`;

const ActionButton = ({
  bgColor = 'blue',
  onClick,
  to,
  children,
}: ActionButtonProps) => {
  const navigate = useNavigate();

  return (
    <ActionButtonBlock
      $bgColor={bgColor}
      onClick={() => {
        onClick && onClick();
        to && navigate(to);
      }}
    >
      {children}
    </ActionButtonBlock>
  );
};

export default ActionButton;
