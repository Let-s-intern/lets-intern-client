import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  className?: string;
  onClick?: () => void;
}

function SignUpLink({ className, onClick }: Props) {
  return (
    <HybridLink
      className={twMerge(
        'text-xsmall14 text-primary px-3 py-1.5 font-medium transition hover:opacity-80',
        className,
      )}
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
