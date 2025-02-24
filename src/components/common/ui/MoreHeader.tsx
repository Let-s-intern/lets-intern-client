import clsx from 'clsx';
import Link from 'next/link';
import { ReactNode } from 'react';

interface MoreHeaderProps {
  children?: ReactNode;
  subtitle?: string;
  href?: string;
  isBig?: boolean;
  isVertical?: boolean;
}

const MoreHeader = ({
  children,
  subtitle,
  href,
  isBig,
  isVertical,
}: MoreHeaderProps) => {
  return (
    <div
      className={clsx(
        'flex w-full justify-between',
        isVertical ? 'items-start' : 'items-center',
      )}
    >
      <div
        className={clsx(
          'flex flex-1 select-none gap-x-2 text-neutral-0',
          isVertical ? 'flex-col items-start gap-y-1' : 'items-center',
        )}
      >
        <h2
          className={clsx(
            'text-small20',
            isBig ? 'font-bold md:text-large26' : 'font-semibold',
          )}
        >
          {children}
        </h2>
        {subtitle && <p className="text-xsmall14">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          className={clsx(
            'font-medium text-neutral-45',
            isBig ? 'text-xsmall16' : 'text-xsmall14',
          )}
        >
          더보기
        </Link>
      )}
    </div>
  );
};

export default MoreHeader;
