import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { useFeedbackMentorSlotsQuery } from '@/api/feedback/feedback';
import {
  useLiveMentoringSlotsQuery,
  useSaveLiveMentoringSlotsMutation,
} from '@/api/live-mentoring/liveMentoring';
import BaseModal from '@/common/modal/BaseModal';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';
import LiveAvailabilityContent from '@/pages/schedule/live-availability/LiveAvailabilityContent';

import {
  toBlockedSlots,
  toGridSlots,
  toReservedSlots,
  toSlotSaveRequest,
} from '../utils/slotMapping';

interface LiveMentoringSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** 서버가 받는 `LocalDateTime` 문자열 형식. */
const LOCAL_DATE_TIME = "yyyy-MM-dd'T'HH:mm:ss";

/**
 * 저장 실패 사유별 안내. 서버 `LiveMentoringErrorCode` 를 그대로 키로 쓴다.
 * 공용 axios 인터셉터가 `code` 를 에러 객체 최상위에 올려준다.
 */
const SAVE_ERROR_MESSAGES: Record<string, string> = {
  LIVE_MENTORING_SLOT_LOCKED:
    '예약된 일정은 삭제할 수 없습니다. 최신 일정을 다시 불러왔어요.',
  LIVE_MENTORING_SLOT_CONFLICT:
    '이미 등록된 시간입니다. 최신 일정을 다시 불러왔으니 확인 후 다시 시도해주세요.',
  LIVE_MENTORING_INVALID_SLOT_TIME:
    '지금 이후의 30분 단위 시간만 열 수 있습니다. 이미 지난 시간이 선택돼 있지 않은지 확인해주세요.',
  LIVE_MENTORING_NOT_FOUND:
    '먼저 오픈 설정을 저장해 상품을 만든 뒤에 일정을 등록할 수 있습니다.',
};

/**
 * 1대1 라이브 멘토링 슬롯 편집 모달.
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
   * 지난 슬롯은 조회에서 제외한다. 서버는 저장 요청의 **모든** 항목에 "시작이 미래"를
   * 요구하므로(`validatePeriod`), 지난 슬롯을 그리드에 선택 상태로 올리면 사용자가
   * 손대지 않은 그 슬롯 때문에 저장 전체가 400 으로 실패한다. 지난 `OPEN` 슬롯은
   * 서버 공개 조회에서도 이미 제외되는 값이라 payload 에서 빠져 정리된다.
   *
   * 모달을 열 때 한 번만 계산한다 — 렌더마다 새 값을 만들면 query key 가 매번 바뀐다.
   */
  const notBefore = useMemo(
    () => format(new Date(), LOCAL_DATE_TIME),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isOpen],
  );

  const slotsQuery = useLiveMentoringSlotsQuery({
    startDate: notBefore,
    enabled: isOpen,
  });
  /*
   * 챌린지 라이브 피드백 슬롯도 함께 읽는다. 두 슬롯은 같은 `feedback_slot` 행을 쓰고
   * `UNIQUE(mentor_user_id, start_date)` 가 걸려 있어 같은 시각을 양쪽에 열 수 없는데,
   * 조회 쿼리는 서로를 감춘다. 그리드가 이걸 보여주지 않으면 멘토는 이미 챌린지로 연
   * 시간을 또 고르고 저장 순간에 원인 모를 409 를 만난다.
   */
  const challengeSlotsQuery = useFeedbackMentorSlotsQuery({
    startDate: notBefore,
    statusList: ['OPEN', 'RESERVED'],
    enabled: isOpen,
  });
  const saveSlots = useSaveLiveMentoringSlotsMutation();

  const serverSlots = slotsQuery.data;
  const challengeSlots = challengeSlotsQuery.data?.feedbackSlotList;

  const initialSlots = useMemo(
    () => toGridSlots(serverSlots ?? []),
    [serverSlots],
  );
  const reservedSlots = useMemo(
    () => toReservedSlots(serverSlots ?? []),
    [serverSlots],
  );
  const blockedSlots = useMemo(
    () => toBlockedSlots(challengeSlots ?? []),
    [challengeSlots],
  );

  const isLoading = slotsQuery.isPending || challengeSlotsQuery.isPending;
  const isError = slotsQuery.isError || challengeSlotsQuery.isError;

  const handleSave = async (selected: MentorOpenSlot[]) => {
    setSaveError(null);
    try {
      await saveSlots.mutateAsync(
        toSlotSaveRequest({ selected, serverSlots: serverSlots ?? [] }),
      );
    } catch (error) {
      const apiError = error as { code?: string; message?: string } | null;
      const code = apiError?.code;
      setSaveError(
        (code && SAVE_ERROR_MESSAGES[code]) ??
          apiError?.message ??
          '일정을 저장하지 못했습니다.',
      );
      /*
       * 잠금·충돌은 화면이 들고 있는 슬롯이 낡아서 난다(다른 탭에서 바꿨거나 방금 예약이
       * 들어왔거나). 최신 상태를 다시 읽어 두면 같은 선택으로 다시 눌러도 성공한다.
       * `resetKey` 를 건드리지 않으므로 사용자가 고른 셀은 그대로 남는다.
       */
      if (
        code === 'LIVE_MENTORING_SLOT_LOCKED' ||
        code === 'LIVE_MENTORING_SLOT_CONFLICT'
      ) {
        slotsQuery.refetch();
      }
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
            onClick={() => {
              slotsQuery.refetch();
              challengeSlotsQuery.refetch();
            }}
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
          <p className="text-xxsmall12 text-neutral-40 border-neutral-85 border-b px-6 py-3">
            라이브 피드백으로 이미 열어 둔 시간은 선택할 수 없어요. 같은 시각에
            두 일정을 함께 열 수 없습니다.
          </p>
          <LiveAvailabilityContent
            mode="modal"
            showHeader={false}
            initialSlots={initialSlots}
            reservedSlots={reservedSlots}
            blockedSlots={blockedSlots}
            onSave={handleSave}
            onClose={handleClose}
            resetKey={isOpen}
          />
        </>
      )}
    </BaseModal>
  );
};

export default LiveMentoringSlotModal;
