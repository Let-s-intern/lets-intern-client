
const EmptyContainer = () => {
  return (
    <div className='flex flex-col gap-y-5 w-full items-center justify-center py-10'>
      <img src='/logo/logo-simple.svg' alt='데이터 없음' />
      <div className='text-sm text-neutral-30'>일치하는 정보가 없습니다.</div>
    </div>
  );
};

export default EmptyContainer;