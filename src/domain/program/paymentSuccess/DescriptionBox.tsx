const DescriptionBox = ({ type }: { type: 'SUCCESS' | 'FAIL' | 'DELETE' }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-md bg-neutral-100 py-6">
      <div className="text-small20 font-semibold text-primary">
        {type === 'SUCCESS'
          ? '결제가 완료되었어요  🎉'
          : type === 'FAIL'
            ? '결제가 승인되지 않았어요 ❗️'
            : '결제 취소 ❗️'}
      </div>
      <div className="text-xsmall16 text-neutral-20">
        {type === 'SUCCESS'
          ? '눈부신 커리어의 첫걸음을 응원해요. '
          : type === 'FAIL'
            ? '다시 시도해주세요.'
            : '결제한 프로그램을 환불받고 싶어요.'}
      </div>
    </div>
  );
};

export default DescriptionBox;
