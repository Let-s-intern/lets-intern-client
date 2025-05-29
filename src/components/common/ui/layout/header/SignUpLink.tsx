import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  isNextRouter: boolean;
  force: boolean;
  className?: string;
}

function SignUpLink({ isNextRouter, force, className }: Props) {
  const LinkComponent: React.ElementType = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        href: '/signup',
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (force) {
            e.preventDefault();
            window.location.href = '/signup';
          }
        },
      }
    : { to: '/signup' };

  return (
    <LinkComponent
      className={twMerge(
        'rounded-xxs bg-primary px-3 py-1.5 text-xsmall14 font-medium text-white',
        className,
      )}
      {...linkProps}
    >
      회원가입
    </LinkComponent>
  );
}

export default SignUpLink;
