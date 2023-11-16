import { useNavigate } from 'react-router-dom';

import { ActionButtonProps } from '../interface';

const ActionButton = ({
  style = 'edit',
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
      className={`flex items-center justify-center rounded px-3 py-1 text-white ${buttonStyle[style]}`}
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
