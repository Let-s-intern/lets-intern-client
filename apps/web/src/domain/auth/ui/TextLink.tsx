import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface TextLinkProps {
  to: string;
  className?: string;
  dark?: boolean;
  children: React.ReactNode;
}

const TextLink = ({ to, dark, className, children }: TextLinkProps) => {
  return (
    <Link
      href={to}
      className={twMerge(
        'text-sm underline',
        dark ? 'text-neutral-grey' : 'text-primary',
        className,
      )}
    >
      {children}
    </Link>
  );
};

export default TextLink;
