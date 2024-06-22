
const LoadingContainer = () => {
  return (
    <div className='flex flex-col gap-y-5 w-full items-center justify-center py-10'>
      <img src='/logo/logo-simple.svg' alt='로딩 중' />
      <div className='text-sm text-neutral-30'>로딩 중...</div>
    </div>
  );
};

export default LoadingContainer;