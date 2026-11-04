'use client';

// 캘린더 '참여하기' 신청 플로우 — 챌린지 바텀시트 + 라이브 0원 모달(나의 패스 이용 재사용).
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import PassChallengeApplySheet from '../../usage/PassChallengeApplySheet';
import UsageApplyModals from '../../usage/UsageApplyModals';
import { usePassChallengeApply } from '../../usage/usePassChallengeApply';
import { usePassProgramApply } from '../../usage/usePassProgramApply';

interface CalendarApplyApi {
  applyChallenge: (programId: number) => void;
  applyLive: (programId: number, title: string) => void;
}

const NOOP: CalendarApplyApi = {
  applyChallenge: () => {},
  applyLive: () => {},
};

const CalendarApplyContext = createContext<CalendarApplyApi | null>(null);

/** Provider 밖(테스트 등)에서도 안전하게 동작하도록 no-op 폴백 */
export const useCalendarApply = (): CalendarApplyApi =>
  useContext(CalendarApplyContext) ?? NOOP;

export function CalendarApplyProvider({
  passTitle,
  children,
}: {
  passTitle?: string;
  children: ReactNode;
}) {
  const challengeApply = usePassChallengeApply();
  const liveApply = usePassProgramApply('live');

  const api = useMemo<CalendarApplyApi>(
    () => ({
      applyChallenge: challengeApply.openSheet,
      applyLive: (programId, title) => liveApply.requestApply(programId, title),
    }),
    [challengeApply.openSheet, liveApply],
  );

  return (
    <CalendarApplyContext.Provider value={api}>
      {children}
      <PassChallengeApplySheet controller={challengeApply} />
      <UsageApplyModals
        programType="live"
        apply={liveApply}
        passTitle={passTitle}
      />
    </CalendarApplyContext.Provider>
  );
}
