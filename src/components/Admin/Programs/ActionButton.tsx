import { useNavigate } from 'react-router-dom';

interface ActionButtonProps {
  styleType: 'edit' | 'delete';
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
}

const ActionButton = ({
  styleType = 'edit',
  onClick,
  to,
  children,
}: ActionButtonProps) => {
  const navigate = useNavigate();

  const buttonStyle = {
    edit: 'bg-green-600',
    delete: 'bg-red-500',
  };

  return (
    <button
      className={`flex items-center justify-center rounded px-3 py-1 text-white ${buttonStyle[styleType]}`}
      onClick={() => {
        onClick && onClick();
        to && navigate(to);
      }}
    >
      {children}
    </button>
  );
};

export default ActionButton;
