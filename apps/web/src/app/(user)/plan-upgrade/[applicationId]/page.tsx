'use client';

import LoadingContainer from '@/common/loading/LoadingContainer';
import PlanUpgradeContent from '@/domain/challenge/plan-upgrade/PlanUpgradeContent';
import { useParams } from 'next/navigation';
import { Suspense } from 'react';

/** 셀프 플랜 업그레이드. `plan` 쿼리는 결제 단계에서 돌아올 때 선택을 복원한다 */
const PlanUpgradePage = () => {
  const { applicationId } = useParams<{ applicationId: string }>();

  return (
    <Suspense fallback={<LoadingContainer />}>
      <PlanUpgradeContent applicationId={applicationId} />
    </Suspense>
  );
};

export default PlanUpgradePage;
