import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useCreateFeedbackMentorSlotsMutation,
  useDeleteFeedbackMentorSlotsMutation,
  useFeedbackMentorSlotsQuery,
} from '@/api/feedback/feedback';
import OutlinedButton from '@/common/button/OutlinedButton';
import LiveAvailabilityContent from '@/pages/schedule/live-availability/LiveAvailabilityContent';
import { useLiveFeedbackData } from '@/pages/schedule/hooks/useLiveFeedbackData';
import type { MentorOpenSlot } from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';

import { diffGridAgainstBeSlots, toBeSlotCells } from './utils/slotConverter';

/**
 * 좌측 메뉴 "피드백 > 라이브 피드백 일정 열기" 페이지.
 * BE `/feedback/mentor/slot` CRUD 와 연결. 모든 챌린지를 합쳐 단일 그리드로 표시한다.
 *
 * - OPEN 슬롯: 그리드에 선택된 상태로 표시, 토글 해제 시 DELETE 대상
 * - RESERVED 슬롯: 회색 잠금 표시, 토글 불가
 * - 신규 선택 셀: 저장 시 POST 대상
 *
 * 챌린지 단위 분리 (mentor2.4 / 2.6) 는 BE 미배포 영역이라 이번 push 에서는 mock 유지가 아니라
 * 분리 자체를 폐기하고 통합 일정으로 운영한다.
 */
const FeedbackLiveAvailabilityPage = () => {
  const navigate = useNavigate();

  // 그리드 RESETKEY — 저장 실패 시 직전 BE 상태로 되돌리기 위해 사용
  const [resetCounter, setResetCounter] = useState(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  const slotsQuery = useFeedbackMentorSlotsQuery({
    statusList: ['OPEN', 'RESERVED'],
  });
  const createSlots = useCreateFeedbackMentorSlotsMutation();
  const deleteSlots = useDeleteFeedbackMentorSlotsMutation();

  const beSlots = slotsQuery.data?.feedbackSlotList ?? [];

  // BE 응답을 그리드용 cell 로 변환
  const beCells = useMemo(() => toBeSlotCells(beSlots), [beSlots]);

  // 그리드 초기 선택 = OPEN 슬롯만. RESERVED 는 reservedSlots prop 으로 잠금 분기 처리.
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

  // 챌린지별 라이브 피드백 기간 바 — 날짜 헤더 아래 요일 컬럼에 걸쳐 표시.
  // slotOpenWindow: 모든 미션 오픈 윈도를 합성한 단일 게이팅 윈도(미션 일자 없으면 null).
  const { bars, slotOpenWindow } = useLiveFeedbackData();
  const livePeriods = useMemo(
    () =>
      bars
        .filter((b) => b.barType === 'live-feedback-period')
        .map((b) => ({
          challengeTitle: b.challengeTitle,
          th: b.th,
          startDate: b.startDate,
          endDate: b.endDate,
          reservedCount: b.submittedCount,
          capacity: b.submittedCount + b.notSubmittedCount,
        })),
    [bars],
  );

  const isSaving = createSlots.isPending || deleteSlots.isPending;

  const handleSave = async (slots: MentorOpenSlot[]) => {
    setSaveError(null);
    const { creates, deletes } = diffGridAgainstBeSlots({
      selected: slots,
      beSlots,
    });

    // 변경이 없으면 호출 생략
    if (creates.length === 0 && deletes.length === 0) {
      return;
    }

    // 독립 비동기 작업을 Promise.all 로 병렬 처리 (Vercel async-parallel)
    // 둘 중 하나가 실패해도 다른 하나의 결과는 유지 — allSettled 사용
    const results = await Promise.allSettled([
      creates.length > 0 ? createSlots.mutateAsync(creates) : Promise.resolve(),
      deletes.length > 0 ? deleteSlots.mutateAsync(deletes) : Promise.resolve(),
    ]);

    const createResult = results[0];
    const deleteResult = results[1];
    const failures: string[] = [];
    if (createResult.status === 'rejected' && creates.length > 0) {
      failures.push(`슬롯 ${creates.length}개 생성 실패`);
    }
    if (deleteResult.status === 'rejected' && deletes.length > 0) {
      failures.push(`슬롯 ${deletes.length}개 삭제 실패`);
    }

    if (failures.length > 0) {
      setSaveError(failures.join(' · '));
      // 실패 시 그리드를 최신 BE 상태로 리셋 (성공한 변경은 invalidate 로 이미 반영)
      setResetCounter((n) => n + 1);
      return;
    }

    // 성공 시 resetCounter 를 건드리지 않는다.
    // resetKey 변경은 아직 refetch 되지 않은 stale initialSlots 로 그리드를 되돌려
    // 방금 저장한 선택을 지운다(저장이 한 번에 반영되지 않는 버그의 원인).
    // 즉시 반영은 LiveAvailabilityContent 의 savedKeys 갱신이 담당한다.
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="flex shrink-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
            라이브 피드백 일정 열기
          </h1>
          <p className="text-xsmall14 text-neutral-40">
            라이브 피드백을 진행할 수 있는 시간대를 설정하세요.
          </p>
        </div>
        <OutlinedButton
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0"
          onClick={() => navigate('/feedback/live-reservation')}
        >
          예약현황 보기
        </OutlinedButton>
      </div>

      <div className="border-neutral-85 flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-md border bg-white">
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
              <div className="text-xsmall14 border-b border-red-100 bg-red-50 px-6 py-3 text-red-600">
                저장 중 문제가 발생했어요: {saveError}
              </div>
            )}
            {isSaving && (
              <div className="border-primary-90 bg-primary-5 text-xsmall14 text-primary-90 border-b px-6 py-3">
                저장 중입니다...
              </div>
            )}
            <LiveAvailabilityContent
              mode="page"
              initialSlots={initialSlots}
              reservedSlots={reservedSlots}
              onSave={handleSave}
              resetKey={resetCounter}
              showHeader={false}
              livePeriods={livePeriods}
              slotOpenWindow={slotOpenWindow}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackLiveAvailabilityPage;
