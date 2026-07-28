import Link from 'next/link';

interface CouponBannerProps {
  compact?: boolean;
}

const TEXT = {
  default: '으로\n더 저렴하게 커리어 성장을\n쌓아가보세요!',
  compact: '으로\n다음 챌린지를 저렴하게!',
};

const CouponBanner = ({ compact = false }: CouponBannerProps) => {
  const rest = compact ? TEXT.compact : TEXT.default;

  return (
    <div className="bg-primary-90 relative overflow-hidden rounded-sm">
      <img
        src="/images/coupon-rotation.svg"
        alt=""
        aria-hidden="true"
        className="absolute left-8 top-0"
      />
      <div className="relative z-10 flex flex-col items-center gap-3 p-3 pt-[18px] text-center">
        <p
          className={`text-static-100 whitespace-pre-line leading-snug tracking-[-0.084px] ${compact ? 'text-xsmall14' : 'text-xsmall16'}`}
        >
          <span className="font-bold">재구매 할인 쿠폰</span>
          <span className="font-medium">{rest}</span>
        </p>
        <Link
          href="/mypage/coupon"
          className="text-primary text-xsmall14 rounded-xs bg-primary-10 w-full px-4 py-2 font-normal"
        >
          쿠폰함 확인하기
        </Link>
      </div>
    </div>
  );
};

export default CouponBanner;
