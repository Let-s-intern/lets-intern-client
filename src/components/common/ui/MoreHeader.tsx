import Link from 'next/link';
import { twJoin } from 'tailwind-merge';

interface MoreHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  titleClass?: string;
}

const MoreHeader = ({ title, subtitle, href, titleClass }: MoreHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 select-none items-center gap-x-2">
        <h2 className={twJoin('text-small20 font-semibold', titleClass)}>
          {title}
        </h2>
        <p className="text-xsmall14">{subtitle}</p>
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
