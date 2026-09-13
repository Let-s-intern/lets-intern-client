'use client';

import BackHeader from '@/common/header/BackHeader';
import LoadingContainer from '@/common/loading/LoadingContainer';
import useAuthStore from '@/store/useAuthStore';
import { ApiError } from '@letscareer/api';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ReactNode, useEffect, useState } from 'react';
import { usePlanUpgradeQuery } from './api/planUpgrade';
import type { PlanUpgrade } from './api/planUpgradeSchema';
import AddedBenefitBox from './ui/AddedBenefitBox';
import CurrentPlanRow from './ui/CurrentPlanRow';
import PlanOptionRadioGroup from './ui/PlanOptionRadioGroup';
import PriceDetailAccordion from './ui/PriceDetailAccordion';
import UnavailableNotice from './ui/UnavailableNotice';
import UpgradeBottomBar from './ui/UpgradeBottomBar';
import { formatDeadline, formatUpgradeCta } from './utils/planUpgradeText';
import { selectInitialPlan } from './utils/selectInitialPlan';

const MYPAGE_APPLICATION_PATH = '/mypage/application';

const OUTLINE_BUTTON_CLASS_NAME =
  'border-neutral-60 rounded-sm border bg-white px-3 py-2 text-sm font-medium';

/** 남의 신청(403)·없는 신청(404)은 다시 시도해도 같으므로 조회 실패와 따로 안내한다 */
const isApplicationNotFound = (error: unknown) => {
  const status =
    error instanceof ApiError
      ? error.status
      : error instanceof AxiosError
        ? error.response?.status
        : undefined;
  return status === 403 || status === 404;
};

const StatusMessage = ({
  message,
  children,
}: {
  message: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center gap-4 px-5 py-20 text-center">
    <p className="text-xsmall16 text-neutral-20">{message}</p>
    {children}
  </div>
);

interface PlanUpgradeFormProps {
  applicationId: string;
  planUpgrade: PlanUpgrade;
  planQuery: string | null;
}

/**
 * 조회가 끝난 뒤의 화면.
 *
 * 첫 선택은 `plan` 쿼리가 유효하면 그 플랜, 아니면 바로 위 플랜이다 (D18). 선택을 바꾸면
 * 혜택·추가 결제 금액·버튼 문구가 함께 바뀐다. 불가 사유가 있으면 선택지 대신 안내만 둔다.
 */
const PlanUpgradeForm = ({
  applicationId,
  planUpgrade,
  planQuery,
}: PlanUpgradeFormProps) => {
  const router = useRouter();
  const { challengeTitle, currentPlan, deadline, unavailableReason, options } =
    planUpgrade;

  const [selectedPlan, setSelectedPlan] = useState(() =>
    selectInitialPlan(options, planQuery),
  );
  const [isNavigating, setIsNavigating] = useState(false);

  const selectedOption = options.find(
    (option) => option.planType === selectedPlan,
  );

  const summary = (
    <>
      {challengeTitle && (
        <h2 className="text-small18 text-neutral-0 font-bold">
          {challengeTitle}
        </h2>
      )}
      <CurrentPlanRow
        planType={currentPlan.planType}
        paidAmount={currentPlan.paidAmount}
      />
    </>
  );

  if (unavailableReason || !selectedOption) {
    return (
      <>
        <div className="mx-5 mb-6 flex flex-col gap-6">
          {summary}
          {unavailableReason && (
            <UnavailableNotice reason={unavailableReason} deadline={deadline} />
          )}
        </div>
        <UpgradeBottomBar
          buttonText="마이페이지로 이동"
          onClick={() => router.push(MYPAGE_APPLICATION_PATH)}
        />
      </>
    );
  }

  const goToPayment = () => {
    setIsNavigating(true);
    router.push(
      `/plan-upgrade/${applicationId}/payment?plan=${selectedOption.planType}`,
    );
  };

  return (
    <>
      <div className="mx-5 mb-6 flex flex-col gap-6">
        {summary}
        <PlanOptionRadioGroup
          options={options}
          selectedPlan={selectedOption.planType}
          onChange={setSelectedPlan}
        />
        <AddedBenefitBox
          currentPlanType={currentPlan.planType}
          currentPlanDescription={currentPlan.description}
          feedbackMissions={selectedOption.feedbackMissions}
        />
        <div>
          <hr className="border-neutral-85" />
          <div className="flex flex-col gap-1 py-5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xsmall16 text-neutral-0">
                추가 결제 금액
              </span>
              <span className="text-medium24 text-primary font-bold">
                {selectedOption.additionalAmount.toLocaleString()}원
              </span>
            </div>
            {deadline && (
              <p className="text-xsmall14 text-neutral-40">
                {formatDeadline(deadline)}까지 업그레이드할 수 있어요
              </p>
            )}
          </div>
          <hr className="border-neutral-85" />
          <PriceDetailAccordion
            currentPlanType={currentPlan.planType}
            currentSalePrice={currentPlan.salePrice}
            targetPlanType={selectedOption.planType}
            targetSalePrice={selectedOption.salePrice}
            additionalAmount={selectedOption.additionalAmount}
          />
        </div>
      </div>
      <UpgradeBottomBar
        buttonText={formatUpgradeCta(selectedOption.additionalAmount)}
        onClick={goToPayment}
        disabled={isNavigating}
      />
    </>
  );
};

/** 조회 상태에 따라 로딩·실패·본문을 고른다 */
const PlanUpgradeQueryView = ({ applicationId }: { applicationId: string }) => {
  const searchParams = useSearchParams();
  const { data, isLoading, error, refetch } =
    usePlanUpgradeQuery(applicationId);

  if (isLoading) return <LoadingContainer />;

  if (!data) {
    if (isApplicationNotFound(error)) {
      return (
        <StatusMessage message="신청 정보를 찾을 수 없어요">
          <Link
            href={MYPAGE_APPLICATION_PATH}
            className={OUTLINE_BUTTON_CLASS_NAME}
          >
            마이페이지로
          </Link>
        </StatusMessage>
      );
    }
    return (
      <StatusMessage message="정보를 불러오지 못했어요">
        <button
          type="button"
          onClick={() => refetch()}
          className={OUTLINE_BUTTON_CLASS_NAME}
        >
          다시 시도
        </button>
      </StatusMessage>
    );
  }

  return (
    <PlanUpgradeForm
      applicationId={applicationId}
      planUpgrade={data}
      planQuery={searchParams.get('plan')}
    />
  );
};

interface PlanUpgradeContentProps {
  applicationId: string;
}

/**
 * 셀프 플랜 업그레이드 화면 (D16).
 *
 * 로그인을 확인한 뒤에만 조회한다. 비로그인이면 지금 주소로 돌아오게 로그인으로 보낸다.
 * 데스크톱은 모바일 레이아웃을 가운데 정렬로 그대로 쓴다.
 */
const PlanUpgradeContent = ({ applicationId }: PlanUpgradeContentProps) => {
  const router = useRouter();
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    // 스토어 초기화 전에는 isLoggedIn 이 잠시 false 라 초기화 뒤에만 판단한다
    if (!isInitialized || isLoggedIn) return;
    const { pathname, search } = window.location;
    router.push(`/login?redirect=${encodeURIComponent(pathname + search)}`);
  }, [isInitialized, isLoggedIn, router]);

  if (!isInitialized || !isLoggedIn) return <LoadingContainer />;

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(MYPAGE_APPLICATION_PATH);
  };

  return (
    <div className="mx-auto w-full max-w-[55rem] pb-[calc(env(safe-area-inset-bottom)+6rem)] md:pb-6 md:pt-5">
      <BackHeader onClick={goBack} className="mx-5">
        플랜 업그레이드 하기
      </BackHeader>
      <PlanUpgradeQueryView applicationId={applicationId} />
    </div>
  );
};

export default PlanUpgradeContent;
