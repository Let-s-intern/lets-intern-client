import { twMerge } from '@/lib/twMerge';

interface LoadingContainerProps {
  text?: string;
  className?: string;
}

const LoadingContainer = ({ text, className }: LoadingContainerProps) => {
  return (
    <div
      className={twMerge(
        'flex w-full flex-col items-center justify-center gap-y-5 py-10',
        className,
      )}
    >
      <img
        src="/logo/logo-simple.svg"
        className="h-[2.125rem] w-[2.125rem] animate-pulse"
        alt="로딩 중"
      />
      <div className="text-sm text-neutral-30">{text || '로딩 중...'}</div>
    </div>
  );
};

export default LoadingContainer;
