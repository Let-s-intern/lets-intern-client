import Link from 'next/link';
import { ReactNode } from 'react';

interface MoreHeaderProps {
  children?: ReactNode;
  subtitle?: string;
  href?: string;
}

const MoreHeader = ({ children, subtitle, href }: MoreHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 select-none items-center gap-x-2 text-neutral-0">
        <h2 className="text-small20 font-semibold">{children}</h2>
        {subtitle && <p className="text-xsmall14">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="py-2 pl-3 text-xsmall14 font-medium text-neutral-45"
        >
          더보기
        </Link>
      )}
    </div>
  );
};

export default MoreHeader;
