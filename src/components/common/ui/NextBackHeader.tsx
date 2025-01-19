import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';

interface BackHeaderProps {
  to?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const NextBackHeader = ({
  children,
  className,
  to,
  onClick,
}: BackHeaderProps) => {
  return (
    <header className={twMerge('my-6 flex items-center gap-3', className)}>
      <Link href={to ?? '#'} onClick={onClick}>
        <MdOutlineArrowBack size={'1.5rem'} />
      </Link>

      <h1 className="font-semibold text-small20">{children}</h1>
    </header>
  );
};

export default NextBackHeader;
