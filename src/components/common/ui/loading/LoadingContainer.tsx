interface LoadingContainerProps {
  text?: string;
}

const LoadingContainer = ({ text }: LoadingContainerProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-5 py-10">
      <img src="/logo/logo-simple.svg" alt="로딩 중" />
      <div className="text-sm text-neutral-30">{text || '로딩 중...'}</div>
    </div>
  );
};

export default LoadingContainer;
