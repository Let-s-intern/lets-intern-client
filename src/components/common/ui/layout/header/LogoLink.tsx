import { twMerge } from '@/lib/twMerge';
import Link from 'next/link';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  isNextRouter: boolean;
  className?: string;
}

function LogoLink({ isNextRouter, className }: Props) {
  const LinkComponent: React.ElementType = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter ? { href: '/' } : { to: '/' };

  return (
    <h1 className={twMerge('h-[25px] text-transparent', className)}>
      <LinkComponent {...linkProps}>
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-[25px] w-auto"
        />
        렛츠커리어
      </LinkComponent>
    </h1>
  );
}

export default LogoLink;
