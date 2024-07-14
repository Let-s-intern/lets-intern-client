import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { PostApplicationInterface } from '../../../api/application';
import useRunOnce from '../../../hooks/useRunOnce';
import axios from '../../../utils/axios';
import { searchParamsToObject } from '../../../utils/network';

const searchParamsSchema = z
  .object({
    programId: z.coerce.number(),
    programType: z.string(),
    couponId: z.union([z.literal('null'), z.coerce.number()]),
    priceId: z.coerce.number(),
    price: z.coerce.number(),
    discount: z.coerce.number(),
    couponPrice: z.coerce.number(),
    paymentKey: z.string(),
    orderId: z.string(),
    amount: z.string(),
    contactEmail: z.string(),
    question: z.string(),
  })
  .transform((data) => ({
    ...data,
    couponId: data.couponId === 'null' ? null : data.couponId,
  }));

const PaymentConfirm = () => {
  const navigate = useNavigate();
  // TODO: any 타입을 사용하지 않도록 수정
  const [result, setResult] = useState<any>(null);
  const [isConfirm, setIsConfirm] = useState(false);

  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    const result = searchParamsSchema.safeParse(obj);
    if (!result.success) {
      console.log(result.error);
      alert('잘못된 접근입니다.');
      return;
    }

    return result.data;
  }, []);

  useRunOnce(() => {
    if (!params) {
      return;
    }

    const body: PostApplicationInterface = {
      paymentInfo: {
        couponId: params.couponId,
        priceId: params.priceId,
        paymentKey: params.paymentKey,
        orderId: params.orderId,
        amount: params.amount,
      },
      contactEmail: params.contactEmail,
      motivate: '',
      question: params.question,
    };

    axios
      .post(
        `/application/${params.programId}?type=${params.programType.toUpperCase()}`,
        body,
      )
      .then((res) => {
        navigate(
          `/order/${params?.orderId}/success?${new URL(window.location.href).searchParams.toString()}`,
        );
      })
      .catch((e) => {
        console.error(e);
        navigate(
          `/order/${params?.orderId}/fail?${new URL(window.location.href).searchParams.toString()}`,
        );
      });
  });

  return (
    <div className="w-full px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          결제 확인 중입니다...
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirm;
