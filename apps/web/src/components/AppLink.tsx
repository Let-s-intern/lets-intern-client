import NextLink from 'next/link';
import React from 'react';
import { Link } from '@letscareer/ui/Link';

type AppLinkProps = Omit<React.ComponentProps<typeof Link>, 'as'>;

export function AppLink(props: AppLinkProps) {
  const { href, children, className, ...rest } = props;
  return (
    <Link href={href} className={className} as={NextLink as any} {...rest}>
      {children}
    </Link>
  );
}
