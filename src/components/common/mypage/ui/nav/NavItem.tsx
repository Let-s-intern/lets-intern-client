import { useNavigate } from 'react-router-dom';

interface NavItemProps {
  to?: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, active, children }: NavItemProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`flex w-full cursor-pointer items-center justify-center gap-x-2 rounded-md px-3 py-4 ${
        active
          ? 'bg-primary-20 font-semibold text-primary'
          : 'bg-transparent font-medium text-neutral-0/75'
      }`}
      onClick={() => {
        if (to) {
          navigate(to);
        }
      }}
    >
      {children}
    </div>
  );
};

export default NavItem;
