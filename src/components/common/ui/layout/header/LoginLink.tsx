import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  redirect?: string;
  isNextRouter: boolean;
  force: boolean;
  className?: string;
}

function LoginLink({ redirect, isNextRouter, force, className }: Props) {
  return (
    <HybridLink
      className={twMerge(
        'rounded-xxs bg-white px-3 py-1.5 text-xsmall14 font-medium text-primary',
        className,
      )}
      isNextRouter={isNextRouter}
      force={force}
      href={`/login?redirect=${redirect}`}
    >
      로그인
    </HybridLink>
  );
}

export default LoginLink;
