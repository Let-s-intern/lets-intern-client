import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentFail = () => {
  const searchParams = useSearchParams();
  useEffect(() => {
    console.log(searchParams);
  }, [searchParams]);

  return <div>결제실패페이지입니다.</div>;
};

export default PaymentFail;
