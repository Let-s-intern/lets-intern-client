'use client';

import {
  PostApplicationResult,
  useProgramApplicationQueryKey,
} from '@/api/application';
import { useProgramQuery } from '@/api/program';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import {
  getPaymentMethodLabel,
  paymentResultSearchParamsSchema,
} from '@/data/getPaymentSearchParams';
import ApplicationSummaryCard from '@/domain/program/paymentSuccess/ApplicationSummaryCard';
import DescriptionBox from '@/domain/program/paymentSuccess/DescriptionBox';
import {
  getOrderErrorMessage,
  getVodPassResultNotice,
  isVodPassProductChangedError,
} from '@/domain/program/paymentSuccess/orderResult';
import PassUpsellCard from '@/domain/program/pass-upgrade/PassUpsellCard';
import { getAppliedVersionTitle } from '@/domain/program/program-detail/apply/utils/challengeVersion';
import { buildPostApplicationBody } from '@/domain/program/program-detail/apply/utils/postApplicationBody';
import { isVodPassSelected } from '@/domain/program/vodPassPurchase';
import { ChallengePriceInfo } from '@/schema';
import useProgramStore from '@/store/useProgramStore';
import axios from '@/utils/axios';
import { searchParamsToObject } from '@/utils/network';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuCheck } from 'react-icons/lu';

const PaymentResultContent = () => {
  const { data: programApplicationData, _hasHydrated } = useProgramStore();
  const hasRequested = useRef(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [result, setResult] = useState<PostApplicationResult | null | 'error'>(
    null,
  );
  // 실패 사유를 구분할 수 있을 때만 값이 있다. 없으면 기존 실패 화면 그대로다
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const params = useMemo(() => {
    const obj = searchParamsToObject(searchParams);
    const result = paymentResultSearchParamsSchema.safeParse(obj);

    if (!result.success) {
      console.error(result.error);
      alert('잘못된 접근입니다.');
      return;
    }

    return result.data;
  }, [searchParams]);

  useEffect(() => {
    if (!params || !programApplicationData || !_hasHydrated) {
      return;
    }

    if (hasRequested.current) {
      return;
    }
    hasRequested.current = true;

    // eslint-disable-next-line no-console
    console.log('programApplicationData', programApplicationData);

    if (searchParams.get('postApplicationDone') === 'true') {
      // 즉시 리다이렉트 하면 알 수 없는 이유로 제대로 navigate 되지 않음. SSR 관련 이슈로 추정
      setTimeout(() => {
        router.push(
          `/program/${programApplicationData.programType}/${programApplicationData.programId}`,
        );
      }, 100);
      return;
    }

    const body = buildPostApplicationBody(programApplicationData, params);

    axios
      .post(
        `/application/${programApplicationData.programId}?type=${programApplicationData.programType?.toUpperCase()}`,
        body,
      )
      .then((res) => {
        // TODO: 스키마 parse 적용하기. 로직을 바꾸기 부담스러워서 일단 parse를 실제로 진행하지는 않고
        // 타입만 가져다 쓰는 중.
        setResult(res.data.data);
        window.dataLayer?.push({
          event: 'program_payment_success',
          program_name: programApplicationData.programTitle,
          program_id: programApplicationData.programId,
          program_type: programApplicationData.programType,
          payment_method: params.paymentMethodKey,
          payment_amount: params.amount,
          order_id: params.orderId,
        });
      })
      .catch((e) => {
        console.error(e);
        setErrorMessage(getOrderErrorMessage(e));
        if (isVodPassProductChangedError(e)) {
          // 돌아가서 이용권을 다시 고를 때 최신 가격·기간이 보이도록 신청폼을 새로 받게 한다
          queryClient.invalidateQueries({
            queryKey: [useProgramApplicationQueryKey],
          });
        }
        setResult('error');
      })
      .finally(() => {
        // postApplicationDone 를 true로 설정하여 추후 뒤로가기로 왔을 때 api를 타지 않도록 함
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('postApplicationDone', 'true');
        router.replace(
          `${window.location.pathname}?${newSearchParams.toString()}`,
        );
      });
  }, [
    _hasHydrated,
    params,
    programApplicationData,
    queryClient,
    router,
    searchParams,
  ]);

  const programQuery = useProgramQuery({
    programId: programApplicationData.programId ?? -1,
    type: programApplicationData.programType ?? 'live',
  });

  let programTitle = '';
  let programThumbnail = '';
  let programStartDate: import('dayjs').Dayjs | null = null;
  let programEndDate: import('dayjs').Dayjs | null = null;
  let programProgressType = programApplicationData.progressType ?? 'none';
  let programAccessMethod = '';
  let challengeVersionTitle: string | null = null;

  if (programQuery.type === 'live') {
    const data = programQuery.query.data;
    programTitle = data?.title ?? '';
    programThumbnail = data?.thumbnail ?? '';
    programStartDate = data?.startDate ?? null;
    programEndDate = data?.endDate ?? null;
    programProgressType = data?.progressType ?? 'none';
  } else if (programQuery.type === 'challenge') {
    const data = programQuery.query.data;
    programTitle = data?.title ?? '';
    programThumbnail = data?.thumbnail ?? '';
    programStartDate = data?.startDate ?? null;
    programEndDate = data?.endDate ?? null;
    // 진행 방식 줄에 쓴다. 버전이 없는 신청(LIGHT 등)이면 null 이다
    const priceInfo =
      data && 'priceInfo' in data && Array.isArray(data.priceInfo)
        ? (data.priceInfo as ChallengePriceInfo[])
        : [];
    challengeVersionTitle = getAppliedVersionTitle(
      data && 'versionList' in data ? (data.versionList ?? []) : [],
      priceInfo.find((info) => info.priceId === programApplicationData.priceId)
        ?.challengePricePlanType,
      programApplicationData.challengeVersionId ?? null,
    );
  } else if (programQuery.type === 'guidebook') {
    const data = programQuery.query.data;
    programTitle = data?.title ?? '';
    programThumbnail = data?.thumbnail ?? '';
    programAccessMethod = data?.accessMethod ?? '';
  } else if (programQuery.type === 'vod') {
    const data = programQuery.query.data;
    programTitle = data?.title ?? '';
    programThumbnail = data?.thumbnail ?? '';
    programAccessMethod = data?.accessMethod ?? '';
  }

  const isSuccess = typeof result === 'object' && result !== null;
  const vodPassResult =
    typeof result === 'object' && result !== null ? result.vodPass : null;
  const hasVodPass =
    isVodPassSelected(programApplicationData) || vodPassResult != null;

  const returnLink = useMemo(() => {
    const base = `/program/${programApplicationData.programType}/${programApplicationData.programId}`;
    if (!params) {
      return base;
    }

    return `${base}?${searchParams.toString()}`;
  }, [params, searchParams]);

  const isChallenge = programApplicationData.programType === 'challenge';
  const paidAmount = Number(searchParams.get('amount'));

  // 신청 내역 카드의 행. 데이터가 있는 것만 그린다
  const summaryRows: { label: string; value: string }[] = [];
  if (isChallenge) {
    if (challengeVersionTitle) {
      summaryRows.push({ label: '진행 방식', value: challengeVersionTitle });
    }
    if (programStartDate) {
      summaryRows.push({
        label: '챌린지 시작일',
        value: programStartDate.format('YYYY.MM.DD (dd)'),
      });
    }
  } else if (programQuery.type === 'live') {
    if (programStartDate && programEndDate) {
      summaryRows.push({
        label: '진행 일정',
        value: `${programStartDate.format('YYYY.MM.DD')} - ${programEndDate.format('YYYY.MM.DD')}`,
      });
    }
    if (programProgressType !== 'none') {
      summaryRows.push({
        label: '진행 방식',
        value:
          programProgressType === 'ALL'
            ? '온라인/오프라인'
            : programProgressType === 'ONLINE'
              ? '온라인'
              : '오프라인',
      });
    }
  } else if (programAccessMethod) {
    summaryRows.push({ label: '열람 방식', value: programAccessMethod });
  }
  if (hasVodPass && (programApplicationData.vodPassMonths ?? 0) > 0) {
    summaryRows.push({
      label: '추가 상품',
      value: `VOD 이용권 ${programApplicationData.vodPassMonths}개월`,
    });
  }
  if (result && !isSuccess && params) {
    summaryRows.push({
      label: '결제수단',
      value: getPaymentMethodLabel(params.paymentMethodKey),
    });
  }

  // 대시보드 입장·결제 내역 링크. 응답에 신청·결제 ID 가 없으면 목록으로 보낸다
  const challengePayment =
    typeof result === 'object' && result !== null
      ? result.payments?.find((payment) => payment.type === 'CHALLENGE')
      : undefined;
  const dashboardHref =
    isChallenge && challengePayment
      ? `/challenge/${challengePayment.applicationId}/${programApplicationData.programId}`
      : null;
  const creditHref = challengePayment
    ? `/mypage/credit/${challengePayment.paymentId}`
    : '/mypage/credit';

  return (
    <div
      className="w-full px-5 py-10 md:py-16"
      data-program-text={programTitle}
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex min-h-52 w-full flex-col items-center justify-center">
          {!result ? (
            <div>결제 확인 중입니다.</div>
          ) : (
            <>
              {isSuccess ? (
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-primary-10 md:h-16 md:w-16">
                    <LuCheck
                      className="h-7 w-7 text-primary md:h-8 md:w-8"
                      aria-hidden="true"
                    />
                  </div>
                  <h1 className="mt-2 text-medium24 font-bold text-neutral-0 md:text-xlarge28">
                    {isChallenge
                      ? '챌린지 신청이 완료됐어요'
                      : '신청이 완료됐어요'}
                  </h1>
                  <p className="text-xsmall14 text-neutral-30 md:text-xsmall16">
                    신청이 정상적으로 접수됐어요.
                    {isChallenge && (
                      <>
                        <br />
                        시작 안내는 카카오톡으로 보내드릴게요.
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <DescriptionBox type="FAIL" />
              )}
              {errorMessage && (
                <p className="mt-3 text-center text-xsmall14 text-neutral-20">
                  {errorMessage}
                </p>
              )}
              <div className="mt-10 flex w-full flex-col gap-10 md:mt-14 md:flex-row md:items-start md:justify-center md:gap-8">
                <div className="flex w-full flex-col gap-4 md:max-w-[484px] md:flex-1">
                  <p className="text-small18 font-bold text-neutral-0 md:text-small20">
                    신청 내역
                  </p>
                  <ApplicationSummaryCard
                    thumbnail={programThumbnail}
                    title={programTitle}
                    rows={summaryRows}
                    amountLabel={isSuccess ? '결제 완료 금액' : '결제 금액'}
                    amount={paidAmount.toLocaleString() + '원'}
                  />
                  {isSuccess && hasVodPass && (
                    <p className="text-xsmall14 text-neutral-40">
                      {getVodPassResultNotice(vodPassResult)}
                    </p>
                  )}
                  {isSuccess ? (
                    <div className="flex w-full gap-3">
                      {dashboardHref ? (
                        <Link
                          href={dashboardHref}
                          className="challenge_dashboard_button flex flex-[1.5] items-center justify-center rounded-[8px] bg-primary px-4 py-3.5 text-xsmall16 font-semibold text-white"
                        >
                          챌린지 대시보드 입장하기
                        </Link>
                      ) : (
                        <Link
                          href="/mypage/career/board"
                          className="mypage_button flex flex-[1.5] items-center justify-center rounded-[8px] bg-primary px-4 py-3.5 text-xsmall16 font-semibold text-white"
                        >
                          마이페이지 바로가기
                        </Link>
                      )}
                      <Link
                        href={creditHref}
                        className="credit_detail_button flex flex-1 items-center justify-center rounded-[8px] border border-neutral-80 bg-white px-4 py-3.5 text-xsmall16 font-medium text-neutral-0"
                      >
                        결제 내역 확인하기
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={returnLink}
                      className="flex w-full justify-center rounded-[8px] bg-primary px-6 py-3.5 text-xsmall16 font-semibold text-white"
                    >
                      다시 결제하기
                    </Link>
                  )}
                  {isSuccess && isChallenge && programStartDate && (
                    <div className="flex flex-col gap-2 rounded-[16px] border border-neutral-90 bg-neutral-95 px-5 py-6 md:px-7">
                      <p className="flex items-center gap-1.5 text-xsmall16 font-bold text-neutral-0">
                        <LuCheck
                          className="h-5 w-5 text-primary"
                          aria-hidden="true"
                        />
                        이렇게 시작해요!
                      </p>
                      <p className="text-xsmall14 text-neutral-30 md:text-xsmall16">
                        {programStartDate.format('M/D(dd)')} 시작 안내를
                        카톡으로 보내드려요.
                        <br />
                        상세 일정과 미션은 챌린지 대시보드에서 볼 수 있어요.
                      </p>
                    </div>
                  )}
                  {isSuccess && (
                    <Link
                      href="/program"
                      className="other_program self-center text-xsmall14 text-neutral-40 underline"
                    >
                      다른 프로그램 둘러보기
                    </Link>
                  )}
                </div>
                {/* 챌린지 결제 성공 시 오른쪽에 올인원 패스 업셀. 대상이 아니면 카드가 비어 칸이 사라진다 */}
                {isSuccess && isChallenge && (
                  <div className="w-full empty:hidden md:max-w-[484px] md:flex-1">
                    <PassUpsellCard
                      challengeId={programApplicationData.programId ?? 0}
                      paidAmount={paidAmount}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const PaymentResult = () => (
  <AsyncBoundary pendingFallback={null}>
    <PaymentResultContent />
  </AsyncBoundary>
);

export default PaymentResult;
