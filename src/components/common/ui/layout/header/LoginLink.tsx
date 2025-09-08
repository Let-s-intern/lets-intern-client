import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  redirect?: string;
  isNextRouter: boolean;
  force: boolean;
  className?: string;
  onClick?: () => void;
}

function LoginLink({
  redirect,
  isNextRouter,
  force,
  className,
  onClick,
}: Props) {
  return (
    <HybridLink
      className={twMerge(
        'px-3 py-1.5 text-xsmall14 font-medium transition hover:opacity-80',
        className,
      )}
      isNextRouter={isNextRouter}
      force={force}
      href={`/login?redirect=${redirect}`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      로그인
    </HybridLink>
  );
}

export default LoginLink;
