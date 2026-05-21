import { useMemo, useState } from 'react';

import BaseModal from '@/common/modal/BaseModal';
import {
  useCreateFeedbackMentorSlotsMutation,
  useDeleteFeedbackMentorSlotsMutation,
  useFeedbackMentorSlotsQuery,
} from '@/api/feedback/feedback';
import LiveAvailabilityContent from '@/pages/schedule/live-availability/LiveAvailabilityContent';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';

import { diffGridAgainstBeSlots, toBeSlotCells } from './utils/slotConverter';

interface FeedbackAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 모달 오픈 시 그리드 포커스 주차의 기준 날짜 (예: 라이브 피드백 기간 startDate) */
  focusDate?: string;
}

/**
 * 캘린더 라이브 피드백 기간 바 클릭 시 노출되는 슬롯 등록 모달.
 *
 * `/feedback/live-availability` 페이지와 동일한 BE API hook 을 재사용한다.
 * 모달 unmount 시 React Query 자체가 mutation 을 정리하므로 별도 cleanup 불필요.
 */
const FeedbackAvailabilityModal = ({
  isOpen,
  onClose,
  focusDate,
}: FeedbackAvailabilityModalProps) => {
  const [resetCounter, setResetCounter] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  const slotsQuery = useFeedbackMentorSlotsQuery({
    statusList: ['OPEN', 'RESERVED'],
    enabled: isOpen,
  });
  const createSlots = useCreateFeedbackMentorSlotsMutation();
  const deleteSlots = useDeleteFeedbackMentorSlotsMutation();

  const beSlots = slotsQuery.data?.feedbackSlotList ?? [];
  const beCells = useMemo(() => toBeSlotCells(beSlots), [beSlots]);

  const initialSlots: MentorOpenSlot[] = useMemo(
    () =>
      beCells
        .filter((c) => c.status === 'OPEN')
        .map((c) => ({ date: c.date, time: c.time })),
    [beCells],
  );

  const reservedSlots = useMemo(
    () =>
      beCells
        .filter((c) => c.status === 'RESERVED')
        .map((c) => ({ date: c.date, time: c.time })),
    [beCells],
  );

  const isSaving = createSlots.isPending || deleteSlots.isPending;

  const handleSave = async (slots: MentorOpenSlot[]) => {
    setSaveError(null);
    const { creates, deletes } = diffGridAgainstBeSlots({
      selected: slots,
      beSlots,
    });

    if (creates.length === 0 && deletes.length === 0) {
      // 변경 없음 — 모달 닫기는 LiveAvailabilityContent 가 onSave 완료 후 처리
      return;
    }

    const results = await Promise.allSettled([
      creates.length > 0
        ? createSlots.mutateAsync(creates)
        : Promise.resolve(),
      deletes.length > 0
        ? deleteSlots.mutateAsync(deletes)
        : Promise.resolve(),
    ]);

    const failures: string[] = [];
    if (results[0].status === 'rejected' && creates.length > 0) {
      failures.push(`슬롯 ${creates.length}개 생성 실패`);
    }
    if (results[1].status === 'rejected' && deletes.length > 0) {
      failures.push(`슬롯 ${deletes.length}개 삭제 실패`);
    }

    if (failures.length > 0) {
      setSaveError(failures.join(' · '));
      setResetCounter((n) => n + 1);
      // throw 하여 LiveAvailabilityContent 가 onClose 를 호출하지 않게 한다
      throw new Error(failures.join(' · '));
    }

    setResetCounter((n) => n + 1);
    // 정상 완료 — LiveAvailabilityContent 가 mode='modal' 이면 onClose 를 호출
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="flex h-[85vh] max-w-[980px] flex-col overflow-hidden"
    >
      {slotsQuery.isPending ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-xsmall14 text-neutral-40">
            슬롯 정보를 불러오는 중...
          </p>
        </div>
      ) : slotsQuery.isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
          <p className="text-xsmall14 text-neutral-40">
            슬롯 정보를 불러오지 못했습니다.
          </p>
          <button
            type="button"
            onClick={() => slotsQuery.refetch()}
            className="border-neutral-80 text-xsmall14 text-neutral-40 rounded-md border px-4 py-2"
          >
            다시 시도
          </button>
        </div>
      ) : (
        <>
          {saveError && (
            <div className="border-red-100 bg-red-50 text-xsmall14 border-b px-6 py-3 text-red-600">
              저장 중 문제가 발생했어요: {saveError}
            </div>
          )}
          {isSaving && (
            <div className="border-primary-90 bg-primary-5 text-xsmall14 text-primary-90 border-b px-6 py-3">
              저장 중입니다...
            </div>
          )}
          <LiveAvailabilityContent
            mode="modal"
            initialSlots={initialSlots}
            reservedSlots={reservedSlots}
            onSave={handleSave}
            onClose={onClose}
            resetKey={`${isOpen}-${resetCounter}`}
            focusDate={focusDate}
          />
        </>
      )}
    </BaseModal>
  );
};

export default FeedbackAvailabilityModal;
