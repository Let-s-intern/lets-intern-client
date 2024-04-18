import clsx from 'clsx';
import { useEffect, useState } from 'react';
import axios from '../../../../../../utils/axios';
import { AxiosError } from 'axios';

interface CouponSubmitProps {
  formData: any;
  setCouponDiscount: (discount: number) => void;
  setFormData: (formData: any) => void;
  className?: string;
  price: number;
  programDiscount: number;
  programType: string;
}

const CouponSubmit = ({
  formData,
  setCouponDiscount,
  setFormData,
  className,
  price,
  programDiscount,
  programType,
}: CouponSubmitProps) => {
  const [submittedCode, setSubmittedCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<'green' | 'red' | 'none'>(
    'none',
  );
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');

  const handleSubmitButtonClicked = async () => {
    try {
      let typeId;
      switch (programType) {
        case 'CHALLENGE_FULL':
          typeId = 2;
          break;
        case 'CHALLENGE_HALF':
          typeId = 2;
          break;
        case 'BOOTCAMP':
          typeId = 3;
          break;
        case 'LETS_CHAT':
          typeId = 4;
          break;
      }
      const res = await axios.get('/coupon/code', {
        params: {
          code: couponCode,
          type: typeId,
        },
      });
      if (res.data.discount) {
        setMessageColor('green');
        setMessage('쿠폰이 성공적으로 등록되었습니다.');
        if (res.data.discount === -1) {
          setCouponDiscount(price - programDiscount);
        } else {
          setCouponDiscount(res.data.discount);
        }
        setIsSuccess(true);
        setSubmittedCode(couponCode);
        setFormData({
          ...formData,
          code: couponCode,
          couponProgramType: typeId,
        });
      }
    } catch (error) {
      const errorData = (error as AxiosError).response?.data;
      const errorCode = (errorData as { code: string }).code;
      if (errorCode === 'COUPON_404_1') {
        setMessage('유효하지 않은 쿠폰입니다.');
      } else if (errorCode === 'COUPON_409_1') {
        setMessage('아직 사용할 수 없는 쿠폰입니다.');
      } else if (errorCode === 'COUPON_409_2') {
        setMessage('기간이 지난 쿠폰입니다.');
      } else if (errorCode === 'COUPON_409_3') {
        setMessage('이미 쿠폰을 사용하셨습니다.');
      } else if (errorCode === 'COUPON_400_1') {
        setMessage('유효하지 않은 쿠폰입니다');
      } else {
        setMessage('쿠폰 등록 중 오류가 발생했습니다.');
      }
      setMessageColor('red');
      setSubmittedCode(couponCode);
      setCouponDiscount(0);
    }
  };

  const handleCancel = () => {
    setCouponCode('');
    setMessage('');
    setMessageColor('none');
    setIsSuccess(false);
    setSubmittedCode('');
    setCouponDiscount(0);
    const newFormData = { ...formData };
    delete newFormData.code;
    setFormData(newFormData);
  };

  useEffect(() => {
    if (couponCode !== submittedCode) {
      setMessage('');
      setMessageColor('none');
      setIsSuccess(false);
      setCouponDiscount(0);
    }
    // eslint-disable-next-line
  }, [couponCode]);

  return (
    <div className={className}>
      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="쿠폰 코드를 입력하세요."
          className="min-w-0 flex-1 rounded-xs border border-[#C4C4C4] px-3 py-2 text-sm outline-primary"
          disabled={isSuccess}
        />
        {isSuccess ? (
          <button
            type="button"
            className="rounded-xs bg-[#BDBDBD] px-3 text-sm font-semibold text-white"
            onClick={handleCancel}
          >
            취소
          </button>
        ) : (
          <button
            type="button"
            className={clsx(
              'rounded-xs px-3 text-sm font-semibold text-white',
              {
                'bg-primary': couponCode.length > 0,
                'bg-[#BDBDBD]': couponCode.length === 0,
              },
            )}
            onClick={handleSubmitButtonClicked}
          >
            등록
          </button>
        )}
      </div>
      {message && (
        <div className="mt-1">
          <span
            className={clsx('text-sm', {
              'text-[#0D9E00]': messageColor === 'green',
              'text-[#FF0000]': messageColor === 'red',
            })}
          >
            {message}
          </span>
        </div>
      )}
    </div>
  );
};

export default CouponSubmit;
