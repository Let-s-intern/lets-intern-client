// TODO: props로 variant 등 추가 예정
interface OutlinedButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const OutlinedButton = ({ children, onClick, icon }: OutlinedButtonProps) => {
  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-xxs border border-primary px-3 py-1.5 text-primary hover:bg-neutral-100"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};

export default OutlinedButton;
