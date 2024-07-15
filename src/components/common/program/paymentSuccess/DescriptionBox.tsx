const DescriptionBox = ({ isSuccess }: { isSuccess: boolean }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-md bg-neutral-100 py-6">
      <div className="text-small20 font-semibold text-primary">
        {isSuccess ? '결제가 완료되었어요  🎉' : '결제가 승인되지 않았어요 ❗️'}
      </div>
      <div className="text-xsmall16 text-neutral-20">
        {isSuccess
          ? '눈부신 커리어의 첫걸음을 응원해요. '
          : '다시 시도해주세요.'}
      </div>
    </div>
  );
};

export default DescriptionBox;
