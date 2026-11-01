'use client';

import { useProgramApplicationQuery } from '@/api/application';
import { useGetLiveQuery } from '@/api/program';
import { useGetMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';
import dayjs from '@/lib/dayjs';
import { generateOrderId } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import { setProgramApplicationForm } from '@/store/useProgramStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LETSCON_LOGIN_URL } from '../data/links';
import { LETSCON_LIVE_IDS, type LetsconLiveKind } from '../data/live';
import { buildApplicationForm } from '../lib/applicationForm';
import { getApplyStatus, type LetsconApplyStatus } from '../lib/applyStatus';

export interface LetsconApply {
  online: LetsconApplyStatus;
  offline: LetsconApplyStatus;
  apply: (kind: LetsconLiveKind) => void;
}

const useLetsconLive = (liveId: number | null) => {
  const { isLoggedIn } = useAuthStore();
  const enabled = liveId !== null;
  const id = liveId ?? 0;

  const live = useGetLiveQuery({ liveId: id, enabled });
  const application = useProgramApplicationQuery('live', id, { enabled });
  const privilege = useGetMembershipPrivilege('LIVE', id);

  const { refetch: refetchApplication } = application;
  const { refetch: refetchPrivilege } = privilege;

  // 비로그인 때 캐시된 값이 남지 않도록 로그인하면 다시 받는다
  useEffect(() => {
    if (isLoggedIn && enabled) {
      refetchApplication();
      refetchPrivilege();
    }
  }, [isLoggedIn, enabled, refetchApplication, refetchPrivilege]);

  return {
    liveId,
    live: live.data,
    application: application.data,
    hasPrivilege: privilege.data?.hasPrivilege ?? false,
    isLoading: live.isLoading || application.isLoading || privilege.isLoading,
  };
};

type LetsconLive = ReturnType<typeof useLetsconLive>;

/** 호출할 때마다 조회와 재조회가 함께 돈다. LetsconPage 에서 한 번만 부르고 props 로 내린다 */
export const useLetsconApply = (): LetsconApply => {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuthStore();
  const online = useLetsconLive(LETSCON_LIVE_IDS.online);
  const offline = useLetsconLive(LETSCON_LIVE_IDS.offline);

  const getStatus = ({ liveId, live, application, isLoading }: LetsconLive) =>
    getApplyStatus({
      hasLiveId: liveId !== null,
      isLoading: isLoading || !isInitialized,
      hasLiveInfo: Boolean(live && application),
      applied: application?.applied ?? false,
      deadline: live?.deadline ?? null,
      now: dayjs(),
    });

  const apply = (kind: LetsconLiveKind) => {
    const target = kind === 'online' ? online : offline;
    // 화면을 열어 둔 사이 마감될 수 있어 누른 시각으로 다시 판정한다
    if (getStatus(target) !== 'available') return;

    if (!isLoggedIn) {
      router.push(LETSCON_LOGIN_URL);
      return;
    }

    const { liveId, live, application, hasPrivilege } = target;
    if (liveId === null || !application) return;

    const form = buildApplicationForm({
      application,
      liveId,
      title: live?.title,
      orderId: generateOrderId(),
      hasPrivilege,
    });
    if (!form) return;

    setProgramApplicationForm(form);
    router.push('/payment-input');
  };

  return {
    online: getStatus(online),
    offline: getStatus(offline),
    apply,
  };
};
