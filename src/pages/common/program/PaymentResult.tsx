import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import { PostApplicationInterface } from '../../../api/application';
import { useChallengeQuery } from '../../../api/challenge';
import { useLiveQuery } from '../../../api/program';
import DescriptionBox from '../../../components/common/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import useRunOnce from '../../../hooks/useRunOnce';
import axios from '../../../utils/axios';
import { searchParamsToObject } from '../../../utils/network';

const searchParamsSchema = z
  .object({
    programId: z.coerce.number(),
    programType: z.string(),
    couponId: z.union([z.literal(''), z.coerce.number()]),
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
    couponId: data.couponId === '' ? null : data.couponId,
  }));

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  // TODO: any 타입을 사용하지 않도록 수정
  const [result, setResult] = useState<any>(null);

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
        setResult(res.data.data);
      })
      .catch((e) => {
        setResult('error');
      });
  });

  const { data: live } = useLiveQuery({
    enabled:
      typeof params?.programId === 'number' && params?.programType === 'live',
    liveId: params?.programId || 0,
  });

  const { data: challenge } = useChallengeQuery({
    enabled:
      typeof params?.programId === 'number' &&
      params?.programType === 'challenge',
    challengeId: params?.programId || 0,
  });

  const isSuccess = typeof result === 'object' && result !== null;

  const program = params?.programType === 'live' ? live : challenge;
  const programLink = `/program/${params?.programType}/${params?.programId}`;

  return (
    <div className="w-full px-5 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-small20 flex w-full items-center justify-start py-6 font-bold text-neutral-0">
          결제 확인하기
        </div>
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          {!result ? (
            <div>결제 확인 중입니다.</div>
          ) : (
            <>
              <DescriptionBox isSuccess={isSuccess} />
              <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
                <div className="flex w-full flex-col items-start justify-center gap-6">
                  <div className="font-semibold text-neutral-0">
                    결제 프로그램
                  </div>
                  <div className="flex w-full items-center justify-start gap-x-4">
                    <div className="flex">
                      <Link to={programLink}>
                        <img
                          src={program?.thumbnail ?? ''}
                          alt="thumbnail"
                          className="h-24 w-24 object-cover"
                        />
                      </Link>
                      <div className="ml-5">
                        <h2 className="mb-3 text-xl font-bold hover:underline">
                          <Link to={programLink}>{program?.title}</Link>
                        </h2>
                        <p className="text-neutral-40">{program?.shortDesc}</p>
                      </div>
                    </div>
                  </div>
                  {isSuccess && (
                    <button className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark">
                      다른 프로그램 둘러보기
                    </button>
                  )}
                </div>
                <div className="flex w-full flex-col items-start justify-center gap-6">
                  <div className="font-semibold text-neutral-0">결제 상세</div>
                  <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
                    <div className="font-bold">총 결제금액</div>
                    <div>
                      {Number(searchParams.get('amount')).toLocaleString() +
                        '원'}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-center justify-center">
                    <PaymentInfoRow
                      title="상품금액"
                      content={
                        Number(searchParams.get('price')).toLocaleString() +
                        '원'
                      }
                    />
                    <PaymentInfoRow
                      title={`할인 (${Math.floor(Number(searchParams.get('discount')) / Number(searchParams.get('price')))}%)`}
                      content={
                        '-' +
                        Number(searchParams.get('discount')).toLocaleString() +
                        '원'
                      }
                    />
                    <PaymentInfoRow
                      title={`쿠폰할인`}
                      content={
                        '-' +
                        Number(
                          searchParams.get('couponPrice'),
                        ).toLocaleString() +
                        '원'
                      }
                    />
                  </div>
                  <hr className="bg-neutral-85" />
                  <div className="flex w-full flex-col items-center justify-center">
                    {isSuccess && (
                      <>
                        <PaymentInfoRow
                          title="결제일자"
                          content={dayjs(
                            // TODO: any 타입을 사용하지 않도록 수정
                            result?.tossInfo.approvedAt,
                          ).format('YYYY.MM.DD(ddd) HH:mm')}
                        />
                        <PaymentInfoRow
                          title="결제수단"
                          // TODO: any 타입을 사용하지 않도록 수정
                          content={result?.tossInfo.method}
                        />
                        <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                          <div className="text-neutral-40">영수증</div>
                          <div className="flex grow items-center justify-end text-neutral-0">
                            <button
                              className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-3 py-2 text-sm font-medium"
                              onClick={() => {
                                window.open(
                                  // TODO: any 타입을 사용하지 않도록 수정
                                  result?.tossInfo.receipt.url,
                                  '_blank',
                                );
                              }}
                            >
                              영수증 보기
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {isSuccess && (
                    <button className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark">
                      다른 프로그램 둘러보기
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
