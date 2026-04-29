import { twMerge } from '@/lib/twMerge';
import HybridLink from '../../HybridLink';

interface Props {
  className?: string;
}

function LogoLink({ className }: Props) {
  return (
    <h1 className={twMerge('h-5 text-transparent md:h-[24px]', className)}>
      <HybridLink href="/">
        <img
          src="/logo/horizontal-logo.svg"
          alt="렛츠커리어"
          className="h-5 w-auto md:h-[24px]"
        />
        렛츠커리어
      </HybridLink>
    </h1>
  );
}

export default LogoLink;
