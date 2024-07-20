import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PostApplicationInterface } from '../../../api/application';
import { useProgramQuery } from '../../../api/program';
import DescriptionBox from '../../../components/common/program/paymentSuccess/DescriptionBox';
import PaymentInfoRow from '../../../components/common/program/paymentSuccess/PaymentInfoRow';
import ProgramCard from '../../../components/common/program/ProgramCard';
import {
  getPaymentMethodLabel,
  paymentResultSearchParamsSchema,
} from '../../../data/getPaymentSearchParams';
import useRunOnce from '../../../hooks/useRunOnce';
import axios from '../../../utils/axios';
import { searchParamsToObject } from '../../../utils/network';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  // TODO: any 타입을 사용하지 않도록 수정
  const [result, setResult] = useState<any>(null);

  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    const result = paymentResultSearchParamsSchema.safeParse(obj);
    if (!result.success) {
      // eslint-disable-next-line no-console
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
        couponId: params.couponId === '' ? null : params.couponId,
        priceId: params.priceId,
        paymentKey: params.paymentKey,
        orderId: params.orderId,
        amount: params.amount.toString(),
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

  const program = useProgramQuery({
    programId: params?.programId ?? -1,
    type: params?.programType ?? 'live',
  });

  const isSuccess = typeof result === 'object' && result !== null;

  const returnLink = useMemo(() => {
    const base = `/program/${params?.programType}/${params?.programId}`;
    if (!params) {
      return base;
    }
    const searchParams = new URLSearchParams();
    searchParams.set('contentIndex', 'pay');
    searchParams.set('couponId', String(params.couponId));
    searchParams.set('couponPrice', String(params.couponPrice));
    searchParams.set('contactEmail', params.contactEmail);
    searchParams.set('question', params.question);
    searchParams.set('email', params.email);
    searchParams.set('phone', params.phone);
    searchParams.set('name', params.name);
    return `${base}?${searchParams.toString()}`;
  }, [params]);

  return (
    <div
      className="w-full px-5 py-10"
      data-program-text={program.query.data?.title}
    >
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
                  <div className="text-xsmall16 font-semibold text-neutral-0">
                    결제 프로그램
                  </div>
                  {params ? (
                    <ProgramCard
                      type={params.programType}
                      id={params.programId}
                      title={program.query.data?.title ?? ''}
                      thumbnail={program.query.data?.thumbnail ?? ''}
                      startDate={program.query.data?.startDate}
                      endDate={program.query.data?.endDate}
                      thumbnailLinkClassName="max-w-32"
                      progressType={
                        program.query.data &&
                        'progressType' in program.query.data &&
                        program.query.data.progressType
                          ? program.query.data.progressType
                          : 'none'
                      }
                      showType={params.programType === 'live'}
                    />
                  ) : null}

                  {isSuccess && (
                    <Link
                      to="/program"
                      className="other_program flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-neutral-100 px-6 py-3 text-lg font-medium text-primary-dark"
                    >
                      다른 프로그램 둘러보기
                    </Link>
                  )}
                </div>
                <div className="flex w-full flex-col justify-center gap-6">
                  <div className="font-semibold text-neutral-0">결제 상세</div>
                  <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
                    <div className="font-bold">총 결제금액</div>
                    <div className="font-bold">
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
                      title={`할인 (${Math.floor((Number(searchParams.get('discount')) / Number(searchParams.get('price'))) * 100)}%)`}
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
                  <hr className="border-neutral-85" />
                  <div className="flex w-full flex-col items-center justify-center">
                    {!isSuccess ? (
                      <PaymentInfoRow
                        title="결제수단"
                        // TODO: any 타입을 사용하지 않도록 수정
                        content={
                          result?.tossInfo?.method ??
                          (params
                            ? getPaymentMethodLabel(params.paymentMethodKey)
                            : '')
                        }
                      />
                    ) : null}
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
                          content={
                            result?.tossInfo?.method ??
                            (params
                              ? getPaymentMethodLabel(params.paymentMethodKey)
                              : '')
                          }
                        />
                        <div className="flex w-full items-center justify-start gap-x-2 px-3 py-2">
                          <div className="text-neutral-40">영수증</div>
                          <div className="flex grow items-center justify-end text-neutral-0">
                            <Link
                              to={result?.tossInfo.receipt.url ?? '#'}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-center rounded-sm border border-neutral-60 bg-white px-3 py-2 text-sm font-medium"
                            >
                              영수증 보기
                            </Link>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {isSuccess && (
                    <Link
                      to="/mypage/application"
                      className="mypage_button flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
                    >
                      마이페이지 바로가기
                    </Link>
                  )}
                  {!isSuccess && (
                    <Link
                      to={returnLink}
                      className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
                    >
                      다시 결제하기
                    </Link>
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
