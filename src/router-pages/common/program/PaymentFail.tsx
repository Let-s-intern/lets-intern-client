import { useProgramQuery } from '@/api/program';
import PaymentInfoRow from '@/components/common/program/paymentSuccess/PaymentInfoRow';
import ProgramCard from '@/components/common/program/ProgramCard';
import { paymentFailSearchParamsSchema } from '@/data/getPaymentSearchParams';
import useProgramStore from '@/store/useProgramStore';
import { searchParamsToObject } from '@/utils/network';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

/** 처음부터 결제 실패 케이스일 시 이 페이지로 옵니다. 검증 단계에서의 실패는 PaymentResult 에서 진행함. */
const PaymentFail = () => {
  const { data: programApplicationData } = useProgramStore();

  const params = useMemo(() => {
    const obj = searchParamsToObject(
      new URL(window.location.href).searchParams,
    );
    const result = paymentFailSearchParamsSchema.safeParse(obj);
    if (!result.success) {
      // eslint-disable-next-line no-console
      console.error(result.error);
      alert('잘못된 접근입니다.');
      return;
    }

    return result.data;
  }, []);

  const program = useProgramQuery({
    programId: programApplicationData.programId ?? 0,
    type: programApplicationData.programType ?? 'live',
  });

  const returnLink = useMemo(() => {
    const base = `/program/${programApplicationData.programType}/${programApplicationData.programId}`;
    if (!params) {
      return base;
    }
    const searchParams = new URLSearchParams();
    searchParams.set('contentIndex', 'pay');
    return `${base}?${searchParams.toString()}`;
  }, [params]);

  return (
    <div
      className="mx-auto max-w-5xl px-5"
      data-program-text={program.query.data?.title}
    >
      <div className="flex w-full items-center justify-start py-6 text-small20 font-bold text-neutral-0">
        결제 확인하기
      </div>
      <div className="flex min-h-52 w-full flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center justify-center rounded-md bg-neutral-100 py-6">
          <div className="text-small20 font-semibold text-primary">
            결제가 실패했습니다❗️
          </div>
          <div className="text-xsmall16 text-neutral-20">{params?.message}</div>
        </div>
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
                progressType={programApplicationData.progressType ?? 'none'}
                showType={programApplicationData.programType === 'live'}
              />
            ) : null}
          </div>
          <div className="flex w-full flex-col justify-center gap-6">
            <div className="font-semibold text-neutral-0">결제 상세</div>
            <div className="flex w-full items-center justify-between gap-x-4 bg-neutral-90 px-3 py-5">
              <div className="font-bold">총 결제금액</div>
              <div className="font-bold">
                {(programApplicationData.totalPrice || 0).toLocaleString() +
                  '원'}
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center">
              <PaymentInfoRow
                title="참여비용"
                content={
                  (programApplicationData.price || 0).toLocaleString() + '원'
                }
              />
              <PaymentInfoRow
                title={`할인 (${programApplicationData.price === 0 ? 0 : Math.floor(((programApplicationData.discount ?? 0) / (programApplicationData.price ?? 1)) * 100)}%)`}
                content={
                  '-' +
                  (programApplicationData.discount ?? 0).toLocaleString() +
                  '원'
                }
              />
              <PaymentInfoRow
                title={`쿠폰할인`}
                content={`-${(Number(programApplicationData.couponId) === -1 ? (programApplicationData.price || 0) - (programApplicationData.discount || 0) : programApplicationData.couponPrice || 0)?.toLocaleString()}원`}
              />
            </div>
            <hr className="border-neutral-85" />
            <div className="flex w-full flex-col items-center justify-center"></div>
            <Link
              reloadDocument
              to={returnLink}
              className="flex w-full flex-1 justify-center rounded-md border-2 border-primary bg-primary px-6 py-3 text-lg font-medium text-neutral-100"
            >
              다시 결제하기
            </Link>{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
