import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  redirect?: string;
  className?: string;
  onClick?: () => void;
}

function LoginLink({ redirect, className, onClick }: Props) {
  const searchParams = new URLSearchParams();
  if (redirect) {
    searchParams.set('redirect', redirect);
  }

  return (
    <HybridLink
      className={twMerge(
        'px-3 py-1.5 text-xsmall14 font-medium transition hover:opacity-80',
        className,
      )}
      href={`/login?${searchParams.toString()}`}
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      로그인
    </HybridLink>
  );
}

export default LoginLink;
