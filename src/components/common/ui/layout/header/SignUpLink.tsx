import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  isNextRouter: boolean;
  force: boolean;
  className?: string;
}

function SignUpLink({ isNextRouter, force, className }: Props) {
  return (
    <HybridLink
      className={twMerge(
        'rounded-xxs bg-primary px-3 py-1.5 text-xsmall14 font-medium text-white',
        className,
      )}
      isNextRouter={isNextRouter}
      force={force}
      href="/signup"
    >
      회원가입
    </HybridLink>
  );
}

export default SignUpLink;
