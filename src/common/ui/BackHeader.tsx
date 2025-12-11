import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MdOutlineArrowBack } from 'react-icons/md';

interface BackHeaderProps {
  to?: string;
  children?: React.ReactNode;
  className?: string;
  hideBack?: boolean;
  onClick?: () => void;
}

const BackHeader = ({
  children,
  className,
  hideBack = false,
  to,
  onClick,
}: BackHeaderProps) => {
  const router = useRouter();

  const handleBackClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    } else if (!to) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <header className={twMerge('flex items-center gap-3 py-6', className)}>
      {!hideBack && (
        <Link href={to ?? '#'} onClick={handleBackClick}>
          <MdOutlineArrowBack size={'1.5rem'} />
        </Link>
      )}

      <h1 className="text-small20 font-semibold">{children}</h1>
    </header>
  );
};

export default BackHeader;
