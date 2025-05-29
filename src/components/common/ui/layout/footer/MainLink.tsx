import { twMerge } from '@/lib/twMerge';
import { AnchorHTMLAttributes } from 'react';
import HybridLink from '../../HybridLink';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  isNextRouter: boolean;
  force?: boolean;
}

function MainLink({
  isNextRouter,
  force,
  className,
  href = '#',
  children,
  ...restProps
}: Props) {
  const linkClassName = twMerge('w-fit text-xsmall14 font-medium', className);

  return (
    <HybridLink
      className={linkClassName}
      isNextRouter={isNextRouter}
      force={force}
      href={href}
      {...restProps}
    >
      {children}
    </HybridLink>
  );
}

export default MainLink;
