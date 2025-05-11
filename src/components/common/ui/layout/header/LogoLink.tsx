import Link from 'next/link';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
  isNextRouter: boolean;
}

function LogoLink({ isNextRouter }: Props) {
  const LinkComponent: any = isNextRouter ? Link : RouterLink;
  const linkProps = isNextRouter ? { href: '/' } : { to: '/' };

  return (
    <h1 className="h-[22px] text-transparent">
      <LinkComponent {...linkProps}>
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-[22px] w-auto"
        />
        렛츠커리어
      </LinkComponent>
    </h1>
  );
}

export default LogoLink;
