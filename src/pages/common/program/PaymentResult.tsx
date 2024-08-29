import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
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
import useProgramStore from '../../../store/useProgramStore';
import axios from '../../../utils/axios';
import { searchParamsToObject } from '../../../utils/network';

const PaymentResult = () => {
  const { data: programApplicationData, initProgramApplicationForm } =
    useProgramStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  // TODO: any 타입을 사용하지 않도록 수정
  const [result, setResult] = useState<any>(null);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    // console.log(obj);
    const result = paymentResultSearchParamsSchema.safeParse(obj);
    // console.log(result);
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error(result.error);
      alert('잘못된 접근입니다.');
      return;
    }

    return result.data;
  }, []);

  useRunOnce(() => {
    if (!params || !programApplicationData) {
      return;
    }

    if (
      new URL(window.location.href).searchParams.get('postApplicationDone') ===
      'true'
    ) {
      // 즉시 리다이렉트 하면 알 수 없는 이유로 제대로 navigate 되지 않음. SSR 관련 이슈로 추정
      setTimeout(() => {
        navigate(
          `/program/${programApplicationData.programType}/${programApplicationData.programId}`,
        );
      }, 100);
      return;
    }

    const body: PostApplicationInterface = {
      paymentInfo: {
        couponId: programApplicationData.couponId
          ? Number(programApplicationData.couponId)
          : null,
        priceId: programApplicationData.priceId ?? -1,
        paymentKey:
          programApplicationData.isFree === true || !params.paymentKey
            ? null
            : params.paymentKey,
        orderId: params.orderId,
        amount:
          programApplicationData.isFree === true || !params.amount
            ? (programApplicationData.totalPrice?.toString() ?? '0')
            : (params.amount?.toString() ?? '0'),
      },
      contactEmail: programApplicationData.contactEmail ?? '',
      motivate: '',
      question: programApplicationData.question ?? '',
    };

    axios
      .post(
        `/application/${programApplicationData.programId}?type=${programApplicationData.programType?.toUpperCase()}`,
        body,
      )
      .then((res) => {
        setResult(res.data.data);
        window.dataLayer?.push({
          event: 'payment_success',
          program_name: programApplicationData.programTitle,
          program_id: programApplicationData.programId,
          program_type: programApplicationData.programType,
          payment_method: params.paymentMethodKey,
          payment_amount: params.amount,
        });
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setResult('error');
      })
      .finally(() => {
        // postApplicationDone 를 true로 설정하여 추후 뒤로가기로 왔을 때 api를 타지 않도록 함
        setSearchParams(
          (prev) => {
            prev.set('postApplicationDone', 'true');
            return prev;
          },
          { replace: true },
        );
      });
  });

  const program = useProgramQuery({
    programId: programApplicationData.programId ?? -1,
    type: programApplicationData.programType ?? 'live',
  });

  const isSuccess = typeof result === 'object' && result !== null;

  const returnLink = useMemo(() => {
    const base = `/program/${programApplicationData.programType}/${programApplicationData.programId}`;
    if (!params) {
      return base;
    }

    return `${base}?${searchParams.toString()}`;
  }, [params]);

  return (
    <div
      className="w-full px-5 py-10"
      data-program-text={program.query.data?.title}
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex w-full items-center justify-start py-6 text-small20 font-bold text-neutral-0">
          결제 확인하기
        </div>
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          {!result ? (
            <div>결제 확인 중입니다.</div>
          ) : (
            <>
              <DescriptionBox type={isSuccess ? 'SUCCESS' : 'FAIL'} />
              <div className="flex w-full flex-col items-center justify-start gap-y-10 py-8">
                <div className="flex w-full flex-col items-start justify-center gap-6">
                  <div className="text-xsmall16 font-semibold text-neutral-0">
                    결제 프로그램
                  </div>
                  {params ? (
                    <ProgramCard
                      type={programApplicationData.programType || 'live'}
                      id={programApplicationData.programId || 0}
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
                      showType={programApplicationData.programType === 'live'}
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
                      title="참여비용"
                      content={
                        programApplicationData.price?.toLocaleString() + '원'
                      }
                    />
                    <PaymentInfoRow
                      title={`할인 (${programApplicationData.price === 0 ? 0 : Math.floor(((programApplicationData.discount ?? 0) / (programApplicationData.price ?? 1)) * 100)}%)`}
                      content={
                        '-' +
                        (
                          programApplicationData.discount ?? 0
                        ).toLocaleString() +
                        '원'
                      }
                    />
                    <PaymentInfoRow
                      title={`쿠폰할인`}
                      content={`-${(programApplicationData.couponPrice === -1 ? (programApplicationData.price || 0) - (programApplicationData.discount || 0) : programApplicationData.couponPrice)?.toLocaleString()}원`}
                    />
                  </div>
                  <hr className="border-neutral-85" />
                  <div className="flex w-full flex-col items-center justify-center">
                    {programApplicationData.isFree === true ? (
                      <PaymentInfoRow
                        title="결제일자"
                        content={dayjs(new Date()).format(
                          'YYYY.MM.DD(ddd) HH:mm',
                        )}
                      />
                    ) : !isSuccess ? (
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
                    ) : (
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
