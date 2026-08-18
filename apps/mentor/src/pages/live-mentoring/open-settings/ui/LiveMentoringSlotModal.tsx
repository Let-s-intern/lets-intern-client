import { useMemo, useState } from 'react';

import {
  useCreateFeedbackMentorSlotsMutation,
  useDeleteFeedbackMentorSlotsMutation,
  useFeedbackMentorSlotsQuery,
} from '@/api/feedback/feedback';
import BaseModal from '@/common/modal/BaseModal';
import { diffGridAgainstBeSlots } from '@/pages/feedback-live-availability/utils/slotConverter';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';
import LiveAvailabilityContent from '@/pages/schedule/live-availability/LiveAvailabilityContent';

import { toGridSlots, toReservedSlots } from '../utils/slotMapping';

interface LiveMentoringSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 저장 실패 사유별 안내. 서버 `FeedbackErrorCode` 를 그대로 키로 쓴다.
 * 공용 axios 인터셉터가 `code` 를 에러 객체 최상위에 올려준다.
 *
 * 1대1 전용 슬롯 API 가 사라지면서 `LIVE_MENTORING_SLOT_*` 코드는 더 이상 오지 않는다.
 */
const SAVE_ERROR_MESSAGES: Record<string, string> = {
  CONFLICT_FEEDBACK_SLOT:
    '이미 등록된 시간입니다. 최신 일정을 다시 불러왔으니 확인 후 다시 시도해주세요.',
  RESERVED_FEEDBACK_SLOT:
    '예약된 일정은 변경할 수 없습니다. 최신 일정을 다시 불러왔어요.',
  FEEDBACK_SLOT_NOT_FOUND:
    '이미 삭제된 일정입니다. 최신 일정을 다시 불러왔어요.',
};

/**
 * 1대1 라이브 멘토링 슬롯 편집 모달.
 *
 * 슬롯은 챌린지 라이브 피드백과 같은 `feedback_slot` 한 벌을 공유한다. 용도 구분이
 * 없어졌으므로 이 화면과 `/feedback/live-availability` 는 같은 API 로 같은 목록을 본다.
 * 저장도 챌린지 쪽과 같은 증분 방식이다 — 추가분만 `POST`, 해제분만 `DELETE`.
 *
 * 그리드는 챌린지 라이브 피드백과 같은 `LiveAvailabilityContent` 를 쓴다. 다만 챌린지
 * 전용 prop(`livePeriods`·`slotOpenWindow`·`challengeTitles`·`appliedBookings`·
 * `requiredSlotCount`·`onSwapFromOtherChallenge`·`focusDate`)은 넘기지 않는다 —
 * 특히 `slotOpenWindow` 를 넘기면 미션 기준 오픈 창 게이팅이 켜져 슬롯을 아예 고를 수 없다.
 *
 * `MentorOpenScheduleModal` 대신 직접 조립하는 이유는 로딩·에러 처리 때문이다. 그 래퍼는
 * `resetKey` 를 `isOpen` 으로 고정하므로, 슬롯 응답이 모달을 연 뒤에 도착하면 그리드가
 * 빈 상태로 굳어 이미 열어 둔 일정이 사라진 것처럼 보인다.
 */
const LiveMentoringSlotModal = ({
  isOpen,
  onClose,
}: LiveMentoringSlotModalProps) => {
  const [saveError, setSaveError] = useState<string | null>(null);

  /*
   * 조회 범위를 자르지 않는다. 저장이 전체 치환이던 시절에는 "조회하지 못한 슬롯이
   * 저장으로 삭제된다"는 문제가 있어 `notBefore` 스냅샷으로 지난 슬롯을 걸렀지만,
   * 증분 저장에는 치환 범위라는 개념 자체가 없다. 범위를 고정하면 query key 도
   * 안정돼 모달을 열 때마다 새로 받아오지 않는다.
   */
  const slotsQuery = useFeedbackMentorSlotsQuery({
    statusList: ['OPEN', 'RESERVED'],
    enabled: isOpen,
  });
  const createSlots = useCreateFeedbackMentorSlotsMutation();
  const deleteSlots = useDeleteFeedbackMentorSlotsMutation();

  // `?? []` 를 렌더 본문에 두면 매 렌더 새 배열이 나와 아래 useMemo 가 전부 무효화된다.
  const beSlots = useMemo(
    () => slotsQuery.data?.feedbackSlotList ?? [],
    [slotsQuery.data],
  );

  const initialSlots = useMemo(() => toGridSlots(beSlots), [beSlots]);
  const reservedSlots = useMemo(() => toReservedSlots(beSlots), [beSlots]);

  const isLoading = slotsQuery.isPending;
  const isError = slotsQuery.isError;
  const isSaving = createSlots.isPending || deleteSlots.isPending;

  const handleSave = async (selected: MentorOpenSlot[]) => {
    setSaveError(null);
    const { creates, deletes } = diffGridAgainstBeSlots({ selected, beSlots });
    if (creates.length === 0 && deletes.length === 0) return;

    try {
      /*
       * 추가를 먼저 보낸다. 같은 시각을 지웠다 다시 여는 편집은 생기지 않지만,
       * 순서를 고정해 두면 실패 지점이 한 군데로 좁혀진다.
       */
      if (creates.length > 0) await createSlots.mutateAsync(creates);
      if (deletes.length > 0) await deleteSlots.mutateAsync(deletes);
    } catch (error) {
      const apiError = error as { code?: string; message?: string } | null;
      const code = apiError?.code;
      setSaveError(
        (code && SAVE_ERROR_MESSAGES[code]) ??
          apiError?.message ??
          '일정을 저장하지 못했습니다.',
      );
      /*
       * 충돌·미존재는 화면이 들고 있는 슬롯이 낡아서 난다(다른 탭에서 바꿨거나 방금
       * 예약이 들어왔거나). 최신 상태를 다시 읽어 두면 같은 선택으로 다시 눌러도
       * 성공한다. `resetKey` 를 건드리지 않으므로 사용자가 고른 셀은 그대로 남는다.
       */
      slotsQuery.refetch();
      // 다시 throw 해야 그리드가 모달을 닫지 않고 위 안내를 보여준다.
      throw error;
    }
  };

  const handleClose = () => {
    setSaveError(null);
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      className="flex h-[85vh] max-w-[980px] flex-col overflow-hidden"
    >
      <div className="border-neutral-85 flex items-center justify-between gap-4 border-b px-6 py-5">
        <h2 className="text-medium20 text-neutral-10 font-semibold">
          1대1 멘토링 일정 오픈하기
        </h2>
        <button
          type="button"
          onClick={handleClose}
          aria-label="닫기"
          className="text-neutral-40 hover:text-neutral-10 -mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-20">
          <p className="text-xsmall14 text-neutral-40">일정을 불러오는 중...</p>
        </div>
      ) : isError ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
          <p className="text-xsmall14 text-neutral-40">
            일정을 불러오지 못했습니다.
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
            <div
              role="alert"
              className="text-xsmall14 border-b border-red-100 bg-red-50 px-6 py-3 text-red-600"
            >
              {saveError}
            </div>
          )}
          {isSaving && (
            <div className="border-primary-90 bg-primary-5 text-xsmall14 text-primary-90 border-b px-6 py-3">
              저장 중입니다...
            </div>
          )}
          <p className="text-xxsmall12 text-neutral-40 border-neutral-85 border-b px-6 py-3">
            여기서 연 시간은 라이브 피드백 일정과 같은 목록이에요. 어느 화면에서
            열어도 결과가 같습니다.
          </p>
          {/*
            그리드는 루트가 `h-full` 이라 부모 높이를 그대로 요구한다. 모달은
            `h-[85vh] overflow-hidden` 이고 위에 헤더·안내문이 이미 자리를 먹으므로,
            남은 공간을 주지 않으면 합이 85vh 를 넘어 하단 저장 버튼이 잘린다.
            `min-h-0` 이 없으면 flex 자식이 콘텐츠 크기 아래로 줄지 않는다.
          */}
          <div className="flex min-h-0 flex-1 flex-col">
            <LiveAvailabilityContent
              mode="modal"
              showHeader={false}
              initialSlots={initialSlots}
              reservedSlots={reservedSlots}
              onSave={handleSave}
              onClose={handleClose}
              resetKey={isOpen}
            />
          </div>
        </>
      )}
    </BaseModal>
  );
};

export default LiveMentoringSlotModal;
