// TODO: props로 variant 등 추가 예정
interface SolidButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const SolidButton = ({ children, onClick, icon }: SolidButtonProps) => {
  return (
    <button
      className="flex cursor-pointer items-center gap-1 rounded-xs bg-primary-10 px-3 py-2 text-primary hover:bg-primary-15"
      onClick={onClick}
    >
      {icon}
      <span className="text-sm font-medium">{children}</span>
    </button>
  );
};

export default SolidButton;
