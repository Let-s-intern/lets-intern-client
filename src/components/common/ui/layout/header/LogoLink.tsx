import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  isNextRouter: boolean;
  className?: string;
}

function LogoLink({ isNextRouter, className }: Props) {
  return (
    <h1 className={twMerge('h-[25px] text-transparent', className)}>
      <HybridLink isNextRouter={isNextRouter} href="/">
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-[24px] w-auto"
        />
        렛츠커리어
      </HybridLink>
    </h1>
  );
}

export default LogoLink;
