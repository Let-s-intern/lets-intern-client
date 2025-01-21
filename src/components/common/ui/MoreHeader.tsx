import Link from 'next/link';

interface MoreHeaderProps {
  title: string;
  subtitle: string;
  href: string;
}

const MoreHeader = ({ title, subtitle, href }: MoreHeaderProps) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center select-none gap-x-2">
        <h2 className="text-small20 font-semibold">{title}</h2>
        <p className="text-xsmall14">{subtitle}</p>
      </div>
      <Link
        href={href}
        className="text-xsmall14 font-medium py-2 pl-3 text-neutral-45"
      >
        더보기
      </Link>
    </div>
  );
};

export default MoreHeader;
