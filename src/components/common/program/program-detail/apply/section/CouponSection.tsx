import Input from '../../../../ui/input/Input';

const CouponSection = () => {
  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold text-neutral-0">쿠폰 등록</div>
      <div className="flex gap-2.5">
        <Input className="w-full" placeholder="쿠폰 코드 입력" />
        <button className="shrink-0 rounded-sm bg-primary px-4 py-1.5 text-sm font-medium text-neutral-100">
          쿠폰 등록
        </button>
      </div>
    </div>
  );
};

export default CouponSection;
