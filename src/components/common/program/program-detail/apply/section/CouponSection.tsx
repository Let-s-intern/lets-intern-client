import { useState } from 'react';

import axios from '../../../../../../utils/axios';
import Input from '../../../../ui/input/Input';
import { PayInfo } from '../../section/ApplySection';
import { isAxiosError } from 'axios';

interface CouponSectionProps {
  setPayInfo: (payInfo: (prevPayInfo: PayInfo) => PayInfo) => void;
  programType: string;
}

const CouponSection = ({ setPayInfo, programType }: CouponSectionProps) => {
  const [code, setCode] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clickApply = async () => {
    if (code === '') return;
    await fetchCouponAvailability();
  };

  const fetchCouponAvailability = async () => {
    try {
      const res = await axios.get(`/coupon`, {
        params: {
          code: code,
          programType: programType.toUpperCase(),
        },
      });
      setPayInfo((prevPayInfo: PayInfo) => ({
        ...prevPayInfo,
        couponId: res.data.data.couponId,
        couponPrice: res.data.data.discount,
      }));
      setValidationMsg('');
      setSuccessMsg('쿠폰이 등록되었습니다.');
    } catch (error) {
      if (isAxiosError(error)) {
        setSuccessMsg('');
        setValidationMsg(error.response?.data.message);
      }
      setPayInfo((prevPayInfo: PayInfo) => ({
        ...prevPayInfo,
        couponId: null,
        couponPrice: 0,
      }));
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setValidationMsg('');
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="font-semibold text-neutral-0">쿠폰 등록</div>
      <div className="flex gap-2.5">
        <Input
          className="w-full"
          type="text"
          placeholder="쿠폰 코드 입력"
          value={code}
          onChange={handleCodeChange}
        />
        <button
          className="flex shrink-0 items-center justify-center rounded-sm bg-primary px-4 py-1.5 text-sm font-medium text-neutral-100"
          onClick={clickApply}
        >
          쿠폰 등록
        </button>
      </div>
      {validationMsg && (
        <div className="text-0.875 h-3 text-system-error">{validationMsg}</div>
      )}
      {successMsg && (
        <div className="text-0.875 h-3 text-system-positive-blue">{successMsg}</div>
      )}
    </div>
  );
};

export default CouponSection;
