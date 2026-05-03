import { useMemo, useState } from 'react';

import LiveAvailabilityContent from '@/pages/schedule/live-availability/LiveAvailabilityContent';
import {
  MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE,
  MENTOR_OPEN_SCHEDULES_BY_CHALLENGE,
  type MentorOpenSlot,
} from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';

/**
 * 좌측 메뉴 "라이브설정 > 가능한 시간 설정" 페이지.
 * 콘텐츠는 라이브 피드백 일정 모달(MentorOpenScheduleModal)과 동일한
 * LiveAvailabilityContent 컴포넌트를 페이지 모드로 재사용한다.
 *
 * BE 미연동 — 모든 챌린지의 mock 슬롯을 메모리에서 관리. 챌린지 전환은
 * 상단 챌린지 셀렉트로 수행하며, 저장 시 토스트 자리를 alert 로 임시 노출한다.
 */
const FeedbackLiveAvailabilityPage = () => {
  // mock: 챌린지 → 슬롯 맵
  const [slotsByChallenge, setSlotsByChallenge] = useState<
    Record<number, MentorOpenSlot[]>
  >(MENTOR_OPEN_SCHEDULES_BY_CHALLENGE);

  const challengeIds = useMemo(
    () => Object.keys(slotsByChallenge).map(Number),
    [slotsByChallenge],
  );

  const [activeChallengeId, setActiveChallengeId] = useState<number>(
    () => challengeIds[0] ?? 1,
  );

  const initialSlots = slotsByChallenge[activeChallengeId] ?? [];
  const appliedBookings =
    MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE[activeChallengeId] ?? [];

  // 다른 챌린지 점유 슬롯
  const blockedSlots = useMemo(() => {
    const list: Array<{
      date: string;
      time: string;
      challengeTitle?: string;
      challengeId?: number;
      menteeName?: string;
    }> = [];
    for (const [idText, slots] of Object.entries(slotsByChallenge)) {
      const id = Number(idText);
      if (id === activeChallengeId) continue;
      const applied = MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE[id] ?? [];
      for (const slot of slots) {
        const appliedMatch = applied.find(
          (a) => a.date === slot.date && a.time === slot.time,
        );
        list.push({
          date: slot.date,
          time: slot.time,
          challengeTitle: `챌린지 ${id}`,
          challengeId: id,
          menteeName: appliedMatch?.menteeName,
        });
      }
    }
    return list;
  }, [slotsByChallenge, activeChallengeId]);

  const handleSave = (slots: MentorOpenSlot[]) => {
    setSlotsByChallenge((prev) => ({ ...prev, [activeChallengeId]: slots }));
    // TODO: 토스트 컴포넌트 연결 (현재는 임시 알림)
    if (typeof window !== 'undefined') {
      window.alert(`가능한 시간 ${slots.length}개를 저장했습니다.`);
    }
  };

  const handleSwap = (
    fromChallengeId: number,
    slot: { date: string; time: string },
  ) => {
    setSlotsByChallenge((prev) => {
      const fromSlots = (prev[fromChallengeId] ?? []).filter(
        (s) => !(s.date === slot.date && s.time === slot.time),
      );
      const toSlots = [...(prev[activeChallengeId] ?? []), slot];
      return {
        ...prev,
        [fromChallengeId]: fromSlots,
        [activeChallengeId]: toSlots,
      };
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          가능한 시간 설정
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          라이브 피드백을 진행할 수 있는 시간대를 챌린지별로 설정하세요.
        </p>
      </div>

      {challengeIds.length > 1 && (
        <div className="flex items-center gap-3">
          <label
            htmlFor="active-challenge"
            className="text-xsmall14 text-neutral-30 font-medium"
          >
            챌린지 선택
          </label>
          <select
            id="active-challenge"
            value={activeChallengeId}
            onChange={(e) => setActiveChallengeId(Number(e.target.value))}
            className="border-neutral-80 text-xsmall14 text-neutral-10 h-9 rounded-md border bg-white px-3"
          >
            {challengeIds.map((id) => (
              <option key={id} value={id}>
                챌린지 {id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="border-neutral-85 overflow-hidden rounded-md border bg-white">
        <LiveAvailabilityContent
          mode="page"
          initialSlots={initialSlots}
          onSave={handleSave}
          challengeTitle={`챌린지 ${activeChallengeId}`}
          blockedSlots={blockedSlots}
          appliedBookings={appliedBookings}
          onSwapFromOtherChallenge={handleSwap}
          resetKey={activeChallengeId}
        />
      </div>
    </div>
  );
};

export default FeedbackLiveAvailabilityPage;
