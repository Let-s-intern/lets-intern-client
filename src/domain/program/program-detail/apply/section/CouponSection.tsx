import { ICouponForm } from '@/types/interface';
import axios from '@/utils/axios';
import { isAxiosError } from 'axios';
import { useState } from 'react';
import Input from '../../../../../common/ui/input/Input';

export interface CouponSectionProps {
  setCoupon: (
    coupon: ((prevCoupon: ICouponForm) => ICouponForm) | ICouponForm,
  ) => void;
  maxAmount?: number; // 최대로 적용할 수 있는 쿠폰 금액
  programType: string;
}

const CouponSection = ({
  setCoupon,
  programType,
  maxAmount = Infinity,
}: CouponSectionProps) => {
  const [code, setCode] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isCoupon, setIsCoupon] = useState(false);

  const clickApply = async () => {
    if (isCoupon) {
      setCoupon({
        id: null,
        price: 0,
      });
      setCode('');
      setIsCoupon(false);
      setSuccessMsg('');
      setValidationMsg('');
      return;
    }

    if (code === '') return;
    await fetchCouponAvailability();
  };

  const fetchCouponAvailability = async () => {
    try {
      const res = await axios.get(`/coupon`, {
        params: {
          code,
          programType: programType.toUpperCase(),
        },
      });
      const { couponId, discount } = res.data.data;
      setCoupon({
        id: couponId,
        price: discount === -1 ? maxAmount : Math.min(discount, maxAmount),
      });
      setValidationMsg('');
      setSuccessMsg('쿠폰이 등록되었습니다.');
      setIsCoupon(true);
    } catch (error) {
      if (isAxiosError(error)) {
        setSuccessMsg('');
        setValidationMsg(error.response?.data.message);
      }
      setCoupon((prevCoupon: ICouponForm) => ({
        ...prevCoupon,
        couponId: null,
        couponPrice: 0,
      }));
      setIsCoupon(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setValidationMsg('');
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-2.5">
        <Input
          className="w-full"
          type="text"
          placeholder="쿠폰 번호를 입력해주세요."
          value={code}
          onChange={handleCodeChange}
        />
        <button
          className={`flex shrink-0 items-center justify-center rounded-sm ${isCoupon ? 'border-2 border-primary bg-neutral-100 text-primary' : 'bg-primary text-neutral-100'} px-4 py-1.5 text-sm font-medium`}
          onClick={clickApply}
        >
          {isCoupon ? '쿠폰 취소' : '쿠폰 적용'}
        </button>
      </div>
      {validationMsg && (
        <div className="text-0.875 h-3 text-system-error">{validationMsg}</div>
      )}
      {successMsg && (
        <div className="text-0.875 h-3 text-system-positive-blue">
          {successMsg}
        </div>
      )}
    </div>
  );
};

export default CouponSection;
