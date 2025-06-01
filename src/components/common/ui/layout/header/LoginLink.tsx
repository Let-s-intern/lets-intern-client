import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  redirect?: string;
  isNextRouter: boolean;
  force: boolean;
  className?: string;
}

function LoginLink({ redirect, isNextRouter, force, className }: Props) {
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        href: { pathname: '/login', query: { redirect } },
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (force) {
            e.preventDefault();
            window.location.href = `/login?redirect=${redirect}`;
          }
        },
      }
    : { to: `/login?redirect=${redirect}` };

  return (
    <LinkComponent
      className={twMerge(
        'rounded-xxs bg-white px-3 py-1.5 text-xsmall16 font-medium text-primary',
        className,
      )}
      {...linkProps}
    >
      로그인
    </LinkComponent>
  );
}

export default LoginLink;
