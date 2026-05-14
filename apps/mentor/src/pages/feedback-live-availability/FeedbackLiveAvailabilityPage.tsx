import { useMemo, useState } from 'react';

import LiveAvailabilityContent from '@/pages/schedule/live-availability/LiveAvailabilityContent';
import {
  MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE,
  MENTOR_OPEN_SCHEDULES_BY_CHALLENGE,
  type MentorOpenSlot,
} from '@/pages/schedule/challenge-content/mentorOpenScheduleMock';
import { LIVE_FEEDBACK_MOCK_DATA } from '@/pages/schedule/challenge-content/liveFeedbackMock';

/**
 * 좌측 메뉴 "피드백 > 라이브 피드백 일정 열기" 페이지.
 * 콘텐츠는 캘린더에서 띄우는 라이브 피드백 일정 모달(MentorOpenScheduleModal)과
 * 동일한 LiveAvailabilityContent 컴포넌트를 page 모드로 재사용한다 (단일 소스).
 *
 * BE 미연동 — 모든 챌린지의 mock 슬롯을 메모리에서 관리. 챌린지 전환은
 * 상단 챌린지 셀렉트로 수행하며, 저장 시 토스트 자리를 alert 로 임시 노출한다.
 */
const FeedbackLiveAvailabilityPage = () => {
  // mock: 챌린지 → 슬롯 맵
  const [slotsByChallenge, setSlotsByChallenge] = useState<
    Record<number, MentorOpenSlot[]>
  >(MENTOR_OPEN_SCHEDULES_BY_CHALLENGE);

  const [activeChallengeId] = useState<number>(
    () => Object.keys(MENTOR_OPEN_SCHEDULES_BY_CHALLENGE).map(Number)[0] ?? 1,
  );

  const initialSlots = slotsByChallenge[activeChallengeId] ?? [];
  const appliedBookings =
    MENTOR_OPEN_APPLIED_BOOKINGS_BY_CHALLENGE[activeChallengeId] ?? [];

  // 라이브 피드백이 진행되는 모든 챌린지 이름 — 상단 태그 표시용
  const liveChallengeTitles = useMemo(() => {
    const map = new Map<number, string>();
    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      if (bar.barType === 'live-feedback-period') {
        map.set(bar.challengeId, bar.challengeTitle);
      }
    }
    return Array.from(map.values());
  }, []);

  // 챌린지 id → 표시용 타이틀 lookup
  const challengeTitleById = useMemo(() => {
    const map = new Map<number, string>();
    for (const bar of LIVE_FEEDBACK_MOCK_DATA) {
      if (bar.barType === 'live-feedback-period') {
        map.set(bar.challengeId, bar.challengeTitle);
      }
    }
    return map;
  }, []);

  // 다른 챌린지 점유 슬롯
  // eslint 경고 회피: 위에서 만든 challengeTitleById를 useMemo dep에 넣기 위함
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
          challengeTitle: challengeTitleById.get(id) ?? `챌린지 ${id}`,
          challengeId: id,
          menteeName: appliedMatch?.menteeName,
        });
      }
    }
    return list;
  }, [slotsByChallenge, activeChallengeId, challengeTitleById]);

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
    <div className="flex h-full min-h-0 flex-col gap-6">
      <div className="flex shrink-0 flex-col gap-2">
        <h1 className="text-medium22 text-neutral-10 font-semibold leading-8">
          라이브 피드백 일정 열기
        </h1>
        <p className="text-xsmall14 text-neutral-40">
          라이브 피드백을 진행할 수 있는 시간대를 챌린지별로 설정하세요.
        </p>
      </div>

      <div className="border-neutral-85 flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-md border bg-white">
        <LiveAvailabilityContent
          mode="page"
          initialSlots={initialSlots}
          onSave={handleSave}
          challengeTitles={liveChallengeTitles}
          blockedSlots={blockedSlots}
          appliedBookings={appliedBookings}
          onSwapFromOtherChallenge={handleSwap}
          resetKey={activeChallengeId}
          showHeader={false}
        />
      </div>
    </div>
  );
};

export default FeedbackLiveAvailabilityPage;
