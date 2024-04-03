import clsx from 'clsx';
import { useEffect, useState } from 'react';
import axios from '../../../../../../../utils/axios';
import { AxiosError } from 'axios';

interface CouponSubmitProps {
  setCouponDiscount: (discount: number) => void;
}

const CouponSubmit = ({ setCouponDiscount }: CouponSubmitProps) => {
  const [code, setCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState<'green' | 'red' | 'none'>(
    'none',
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmitButtonClicked = async () => {
    try {
      const res = await axios.get('/coupon/code', {
        params: {
          code,
        },
      });
      if (res.data.discount) {
        setMessageColor('green');
        setMessage('쿠폰이 성공적으로 등록되었습니다.');
        setCouponDiscount(res.data.discount);
        setIsSuccess(true);
        setSubmittedCode(code);
      }
    } catch (error) {
      const errorData = (error as AxiosError).response?.data;
      const errorCode = (errorData as { code: string }).code;
      if (errorCode === 'COUPON_404_1') {
        setMessage('존재하지 않는 쿠폰입니다.');
      } else if (errorCode === 'COUPON_409_2') {
        setMessage('이미 사용된 쿠폰입니다.');
      } else {
        setMessage('쿠폰 등록 중 오류가 발생했습니다.');
      }
      setMessageColor('red');
      setSubmittedCode(code);
      setCouponDiscount(0);
    }
  };

  const handleCancel = () => {
    setCode('');
    setMessage('');
    setMessageColor('none');
    setIsSuccess(false);
    setSubmittedCode('');
    setCouponDiscount(0);
  };

  useEffect(() => {
    if (code !== submittedCode) {
      setMessage('');
      setMessageColor('none');
      setIsSuccess(false);
      setCouponDiscount(0);
    }
  }, [code]);

  return (
    <div className="mt-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="쿠폰 코드를 입력하세요."
          className="flex-1 rounded border border-[#C4C4C4] px-3 py-2 text-sm outline-primary"
          disabled={isSuccess}
        />
        {isSuccess ? (
          <button
            type="button"
            className="rounded bg-[#BDBDBD] px-3 text-sm font-semibold text-white"
            onClick={handleCancel}
          >
            취소
          </button>
        ) : (
          <button
            type="button"
            className={clsx('rounded px-3 text-sm font-semibold text-white', {
              'bg-primary': code.length > 0,
              'bg-[#BDBDBD]': code.length === 0,
            })}
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
