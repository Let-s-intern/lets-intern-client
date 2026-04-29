import { useRouter } from 'next/navigation';

interface NavItemProps {
  to?: string;
  active?: boolean;
  children: React.ReactNode;
}

const NavItem = ({ to, active, children }: NavItemProps) => {
  const router = useRouter();

  return (
    <div
      className={`flex w-auto cursor-pointer items-center justify-start gap-x-2 whitespace-nowrap border-b-4 py-4 pl-4 pr-3 text-base md:border-b-0 md:border-l-4 md:pl-10 ${
        active
          ? 'border-static-0 text-static-0 font-semibold'
          : 'text-neutral-0/75 border-transparent font-medium'
      }`}
      onClick={() => {
        if (to) {
          router.push(to);
        }
      }}
    >
      {children}
    </div>
  );
};

export default NavItem;
