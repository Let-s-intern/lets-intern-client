import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { MdOutlineArrowBack } from 'react-icons/md';

interface BackHeaderProps {
  to?: string;
  children?: React.ReactNode;
  hideBack?: boolean;
  className?: string;
  onClick?: () => void;
}

const NextBackHeader = ({
  children,
  className,
  to,
  hideBack = false,
  onClick,
}: BackHeaderProps) => {
  return (
    <section className={twMerge('my-6 flex items-center gap-3', className)}>
      {!hideBack && (
        <Link href={to ?? '#'} onClick={onClick}>
          <MdOutlineArrowBack size={'1.5rem'} />
        </Link>
      )}

      <h1 className="text-small20 font-semibold">{children}</h1>
    </section>
  );
};

export default NextBackHeader;
