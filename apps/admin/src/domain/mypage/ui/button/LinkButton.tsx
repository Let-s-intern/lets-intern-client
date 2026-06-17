import HybridLink from '@/common/HybridLink';
import clsx from 'clsx';

interface LinkButtonProps {
  className?: string;
  children: React.ReactNode;
  to: string;
  target?: string;
  rel?: string;
}

const LinkButton = ({
  className,
  children,
  to,
  target,
  rel,
}: LinkButtonProps) => {
  return (
    <HybridLink
      href={to}
      className={clsx(
        'border-primary-xlight text-xsmall14 text-neutral-35 md:text-xsmall16 flex w-full items-center justify-center gap-1 rounded-sm border-2 bg-neutral-100 px-5 py-1 font-semibold md:w-auto md:py-2',
        className,
      )}
      target={target}
      rel={rel}
    >
      {children}
    </HybridLink>
  );
};

export default LinkButton;
