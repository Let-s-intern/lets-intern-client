'use client';

import {
  useMypageApplicationsQueryKey,
  usePostApplicationMutation,
  useProgramApplicationQuery,
  type PostApplicationInterface,
} from '@/api/application';
import { generateOrderId } from '@/lib/order';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export type UsageApplyType = 'guidebook' | 'live';

interface ApplyTarget {
  programId: number;
  title: string;
}

/** 나의 혜택 이용 탭의 0원 신청 — payment-input 건너뛰고 amount 0으로 직접 신청(권한 재검증은 서버). */
export const usePassProgramApply = (programType: UsageApplyType) => {
  const queryClient = useQueryClient();
  const [target, setTarget] = useState<ApplyTarget | null>(null);
  const [completed, setCompleted] = useState(false);
  const [completedTitle, setCompletedTitle] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  // 모달 열릴 때만 신청폼 조회(원가·priceId·contactEmail)
  const { data: form } = useProgramApplicationQuery(
    programType,
    target?.programId ?? -1,
    { enabled: !!target },
  );
  const priceInfo = form?.price as
    | {
        price?: number | null;
        discount?: number | null;
        priceId?: number | null;
      }
    | null
    | undefined;
  const originalPrice = Math.max(
    (priceInfo?.price ?? 0) - (priceInfo?.discount ?? 0),
    0,
  );

  const { mutateAsync } = usePostApplicationMutation();

  const confirmApply = async () => {
    if (!target || isApplying || !form) return;
    setIsApplying(true);
    try {
      const priceId = priceInfo?.priceId ?? form.priceList?.[0]?.priceId ?? -1;
      const requestBody: PostApplicationInterface = {
        paymentInfo: {
          couponId: null,
          priceId,
          paymentKey: null,
          orderId: generateOrderId(),
          amount: '0',
        },
        contactEmail: form.contactEmail ?? '',
        motivate: '',
        question: '',
      };
      await mutateAsync({
        programId: target.programId,
        programType,
        requestBody,
      });
      await queryClient.invalidateQueries({
        queryKey: [useMypageApplicationsQueryKey],
      });
      setCompletedTitle(target.title);
      setTarget(null);
      setCompleted(true);
    } catch {
      window.alert(
        '신청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.',
      );
    } finally {
      setIsApplying(false);
    }
  };

  return {
    target,
    completed,
    completedTitle,
    isApplying,
    originalPrice,
    requestApply: (programId: number, title: string) =>
      setTarget({ programId, title }),
    cancel: () => setTarget(null),
    closeComplete: () => setCompleted(false),
    confirmApply,
  };
};
