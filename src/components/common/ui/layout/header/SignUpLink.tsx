import Link from 'next/link';
import { MouseEvent } from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  isNextRouter: boolean;
}

function SignUpLink({ isNextRouter }: Props) {
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter
    ? {
        href: '/signup',
        onClick: (e: MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          e.preventDefault();
          window.location.href = '/signup';
        },
      }
    : { to: '/signup' };

  return (
    <LinkComponent
      className="rounded-xxs bg-primary px-3 py-1.5 text-xsmall14 font-medium text-white"
      {...linkProps}
    >
      회원가입
    </LinkComponent>
  );
}

export default SignUpLink;
