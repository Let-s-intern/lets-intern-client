import { twMerge } from '@/lib/twMerge';

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

const Header = ({ children, className }: HeaderProps) => {
  return (
    <header className={twMerge('py-4 md:p-5', className)}>
      <h1 className="text-xsmall16 md:text-small18 font-semibold md:font-medium">
        {children}
      </h1>
    </header>
  );
};

export default Header;
