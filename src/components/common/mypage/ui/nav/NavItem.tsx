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
      className={`flex w-full cursor-pointer items-center justify-center gap-x-2 border-b-4 px-3 py-4 md:border-b-0 md:border-l-4 ${
        active
          ? 'border-static-0 font-semibold text-static-0'
          : 'border-transparent font-medium text-neutral-0/75'
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
