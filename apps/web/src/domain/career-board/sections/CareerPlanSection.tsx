'use client';

import { userQueryOptions } from '@/api/user/user';
import { AsyncBoundary } from '@/common/boundary/AsyncBoundary';
import LoadingContainer from '@/common/loading/LoadingContainer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CareerCard from '../../mypage/career/card/CareerCard';
import { useCareerDataStatus } from '../contexts/CareerDataStatusContext';

const TITLE = '커리어 계획';
const HREF = '/mypage/career/plan';

const CareerPlanSection = () => {
  const router = useRouter();

  return (
    <AsyncBoundary
      pendingFallback={
        <CareerCard
          title={TITLE}
          labelOnClick={() => router.push(HREF)}
          body={<LoadingContainer text="커리어 계획 조회 중" />}
        />
      }
      rejectedFallback={({ resetErrorBoundary }) => (
        <CareerCard
          title={TITLE}
          labelOnClick={() => router.push(HREF)}
          body={<SectionErrorFallback onRetry={resetErrorBoundary} />}
        />
      )}
    >
      <CareerPlanContent />
    </AsyncBoundary>
  );
};

export default CareerPlanSection;

const CareerPlanContent = () => {
  const router = useRouter();
  const { data: userData } = useSuspenseQuery(userQueryOptions);
  const { setHasCareerData } = useCareerDataStatus();

  const wishField = userData?.wishField ?? null;
  const wishJob = userData?.wishJob ?? null;
  const wishIndustry = userData?.wishIndustry ?? null;
  const wishCompany = userData?.wishCompany ?? null;

  const hasData =
    (wishField && wishField.trim()) ||
    (wishJob && wishJob.trim()) ||
    (wishIndustry && wishIndustry.trim()) ||
    (wishCompany && wishCompany.trim());

  useEffect(() => {
    if (hasData) {
      setHasCareerData(true);
    }
  }, [hasData, setHasCareerData]);

  return (
    <CareerCard
      title={TITLE}
      labelOnClick={() => router.push(HREF)}
      body={
        hasData ? (
          <CareerPlanBody
            wishField={wishField}
            wishJob={wishJob}
            wishIndustry={wishIndustry}
            wishCompany={wishCompany}
          />
        ) : (
          <CareerCard.Empty
            description="아직 커리어 방향을 설정하지 않았어요."
            buttonText="커리어 계획하기"
            buttonHref={HREF}
            onClick={() => router.push(HREF)}
          />
        )
      }
    />
  );
};

const SectionErrorFallback = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-8">
    <p className="text-xsmall14 text-neutral-40">불러오지 못했어요.</p>
    <button
      type="button"
      onClick={onRetry}
      className="rounded-xs border-neutral-80 text-xsmall14 text-neutral-20 border px-4 py-2 font-medium"
    >
      다시 시도
    </button>
  </div>
);

interface CareerPlanBodyProps {
  wishField: string | null;
  wishJob: string | null;
  wishIndustry: string | null;
  wishCompany: string | null;
}

const CareerPlanBody = ({
  wishField,
  wishJob,
  wishIndustry,
  wishCompany,
}: CareerPlanBodyProps) => {
  const jobRoleText = (() => {
    const parts: string[] = [];
    if (wishField && wishField.trim()) parts.push(wishField.trim());
    if (wishJob && wishJob.trim()) parts.push(wishJob.trim());
    return parts.length > 0 ? parts.join(' / ') : null;
  })();

  return (
    <div className="flex h-[179px] flex-col gap-2">
      <PlanFieldItem label="희망 직군 / 직무" value={jobRoleText || '미설정'} />
      <PlanFieldItem
        label="희망 산업"
        value={wishIndustry?.trim() || '미설정'}
      />
      <PlanFieldItem
        label="희망 기업"
        value={wishCompany?.trim() || '미설정'}
      />
    </div>
  );
};

interface PlanFieldItemProps {
  label: string;
  value: string;
}

const PlanFieldItem = ({ label, value }: PlanFieldItemProps) => {
  return (
    <>
      <div className="flex flex-col gap-1">
        <span className="font-regular text-xxsmall12 text-[#4138A3]">
          {label}
        </span>
        <span className="text-neutral-0 truncate text-sm">{value}</span>
      </div>
      <div className="border-b border-[#EFEFEF]" />
    </>
  );
};
