'use client';

import { useProgramApplicationQuery } from '@/api/application';
import {
  useGetUserMagnetDetailQuery,
  useGetUserMagnetQuestionsQuery,
  usePostMagnetApplicationMutation,
} from '@/api/magnet/magnet';
import { useGetLiveQuery } from '@/api/program';
import { useGetMembershipPrivilege } from '@/domain/all-in-one-pass/api/privilege';
import dayjs from '@/lib/dayjs';
import { generateOrderId } from '@/lib/order';
import useAuthStore from '@/store/useAuthStore';
import { setProgramApplicationForm } from '@/store/useProgramStore';
import { extractHttpStatus } from '@/utils/sentry';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LETSCON_LOGIN_URL } from '../data/links';
import { LETSCON_MAGNET_ID, LETSCON_OFFLINE_LIVE_ID } from '../data/live';
import { buildApplicationForm } from '../lib/applicationForm';
import {
  buildSessionAnswer,
  type LetsconSelection,
} from '../lib/applySelection';
import { getApplyStatus, type LetsconApplyStatus } from '../lib/applyStatus';

export interface LetsconApply {
  /** 페이지 CTA 상태. 오프라인까지 신청했으면 더 신청할 것이 없다 */
  status: LetsconApplyStatus;
  offline: LetsconApplyStatus;
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  submit: (selection: LetsconSelection) => Promise<void>;
  isSubmitting: boolean;
  /** 온라인 신청이 끝나 시트가 완료 안내를 보여 준다 */
  isCompleted: boolean;
  hasSubmitError: boolean;
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

/** 호출할 때마다 조회와 재조회가 함께 돈다. LetsconPage 에서 한 번만 부르고 props 로 내린다 */
export const useLetsconApply = (): LetsconApply => {
  const router = useRouter();
  const { isLoggedIn, isInitialized } = useAuthStore();
  const offline = useLetsconLive(LETSCON_OFFLINE_LIVE_ID);

  const magnetId = LETSCON_MAGNET_ID ?? 0;
  const hasMagnetId = LETSCON_MAGNET_ID !== null;
  const magnet = useGetUserMagnetDetailQuery(magnetId, {
    enabled: hasMagnetId,
  });
  const questions = useGetUserMagnetQuestionsQuery(magnetId, {
    enabled: hasMagnetId,
  });
  const { mutateAsync: postMagnetApplication, isPending } =
    usePostMagnetApplicationMutation();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSubmitError, setHasSubmitError] = useState(false);
  const [isMovingToPayment, setIsMovingToPayment] = useState(false);
  // 비활성 표시가 그려지기 전의 연속 클릭도 한 번만 처리한다
  const isSubmittingRef = useRef(false);

  const getOfflineStatus = () =>
    getApplyStatus({
      hasLiveId: offline.liveId !== null,
      isLoading: offline.isLoading || !isInitialized,
      hasLiveInfo: Boolean(offline.live && offline.application),
      applied: offline.application?.applied ?? false,
      deadline: offline.live?.deadline ?? null,
      now: dayjs(),
    });

  const getOnlineStatus = () => {
    const endDate = magnet.data?.magnetInfo.endDate;
    return getApplyStatus({
      hasLiveId: hasMagnetId,
      isLoading: magnet.isLoading || !isInitialized,
      hasLiveInfo: Boolean(magnet.data),
      applied: false,
      deadline: endDate ? dayjs(endDate) : null,
      now: dayjs(),
    });
  };

  const goToOfflinePayment = () => {
    // 화면을 열어 둔 사이 마감될 수 있어 누른 시각으로 다시 판정한다
    if (getOfflineStatus() !== 'available') return false;

    const { liveId, live, application, hasPrivilege } = offline;
    if (liveId === null || !application) return false;

    const form = buildApplicationForm({
      application,
      liveId,
      title: live?.title,
      orderId: generateOrderId(),
      hasPrivilege,
    });
    if (!form) return false;

    setProgramApplicationForm(form);
    router.push('/payment-input');
    return true;
  };

  const saveOnlineApplication = async (selection: LetsconSelection) => {
    const [question] = questions.data?.magnetQuestionList ?? [];
    try {
      await postMagnetApplication({
        magnetId,
        body: {
          magnetAnswerList: question
            ? [
                {
                  magnetQuestionId: question.magnetQuestionId,
                  answer: buildSessionAnswer(selection),
                },
              ]
            : [],
        },
      });
    } catch (error) {
      // 온라인만 신청했던 사람이 오프라인을 추가할 수 있어 이미 신청함은 실패가 아니다
      if (extractHttpStatus(error) !== 409) throw error;
    }
  };

  const runSubmit = async (selection: LetsconSelection) => {
    setHasSubmitError(false);
    try {
      await saveOnlineApplication(selection);
    } catch {
      setHasSubmitError(true);
      return;
    }

    if (selection.mode === 'online') {
      setIsCompleted(true);
      return;
    }

    setIsMovingToPayment(true);
    if (!goToOfflinePayment()) {
      setIsMovingToPayment(false);
      setHasSubmitError(true);
    }
  };

  const submit = async (selection: LetsconSelection) => {
    if (!isLoggedIn) {
      router.push(LETSCON_LOGIN_URL);
      return;
    }
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    await runSubmit(selection);
    isSubmittingRef.current = false;
  };

  const openSheet = () => {
    if (!isLoggedIn) {
      router.push(LETSCON_LOGIN_URL);
      return;
    }
    setIsCompleted(false);
    setHasSubmitError(false);
    setIsSheetOpen(true);
  };

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const offlineStatus = getOfflineStatus();

  return {
    status: offlineStatus === 'applied' ? 'applied' : getOnlineStatus(),
    offline: offlineStatus,
    isSheetOpen,
    openSheet,
    closeSheet,
    submit,
    isSubmitting: isPending || isMovingToPayment,
    isCompleted,
    hasSubmitError,
  };
};
