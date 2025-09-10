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
        'px-3 py-1.5 text-xsmall14 font-medium text-primary transition hover:opacity-80',
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
