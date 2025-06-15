import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  isNextRouter: boolean;
  force: boolean;
  className?: string;
  onClick?: () => void;
}

function SignUpLink({ isNextRouter, force, className, onClick }: Props) {
  return (
    <HybridLink
      className={twMerge(
        'rounded-xxs bg-primary px-3 py-1.5 text-xsmall16 font-medium text-white',
        className,
      )}
      isNextRouter={isNextRouter}
      force={force}
      href="/signup"
      onClick={() => {
        if (onClick) onClick();
      }}
    >
      회원가입
    </HybridLink>
  );
}

export default SignUpLink;
