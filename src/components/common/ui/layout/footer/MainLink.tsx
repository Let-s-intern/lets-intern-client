import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { AnchorHTMLAttributes, MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

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
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        ...restProps,
        href,
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (force) {
            e.preventDefault();
            window.location.href = href;
          }
        },
      }
    : { ...restProps, to: href, reloadDocument: force };

  return (
    <LinkComponent className={linkClassName} {...linkProps}>
      {children}
    </LinkComponent>
  );
}

export default MainLink;
