'use client';

import { useState } from 'react';

import {
  useCreateLiveMentoringEntryMeetingRoomMutation,
  useUpdateLiveMentoringEntryAttendanceMutation,
} from '@/api/live-mentoring/liveMentoring';
import type { LiveMentoringEntry } from '@/api/live-mentoring/liveMentoringSchema';

import { ensureLiveMeetingUrl } from '@letscareer/live-session/JitsiEmbed/jitsiHealthCheck';

interface Params {
  applicationId: number;
  entry: LiveMentoringEntry | null;
}

interface LiveMentoringEntryFlow {
  /** 인라인 Jitsi 가 열려 있는지. enter 성공 시 true. */
  isOpen: boolean;
  /** 헬스체크/등록 진행 중 여부. */
  isPreparing: boolean;
  /** 입장 트리거 — 헬스체크 → (멘토면) 자동 출석 → 인라인 오픈. */
  enter: () => Promise<void>;
  /** 인라인 Jitsi 닫기. */
  closeJitsi: () => void;
  /** 우선순위 순 jitsi base 후보 — JitsiEmbed failover 주입용. */
  baseCandidates: ReadonlyArray<string | undefined>;
  /** 다음 base 재등록(overwrite PATCH) — JitsiEmbed failover 주입용. */
  registerBaseUrl: (base: string) => Promise<void>;
}

/** 우선순위 순 jitsi base 후보 (env). 모듈 상수로 두어 안정적 참조. */
const JITSI_BASE_CANDIDATES: ReadonlyArray<string | undefined> = [
  process.env.NEXT_PUBLIC_JITSI_BASE_URL,
  process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL,
];

/**
 * 1대1 세션 라이브 입장 핵심 로직 (멘토·멘티 공통).
 *
 * 라이브 피드백의 `useLiveEntry` 와 같은 흐름이다. 다른 점은 딱 하나 —
 * "멘토만 자동 출석" 을 가를 때 **서버가 판정한 `entry.myRole`** 을 쓴다.
 * 라이브 피드백은 URL 의 role 세그먼트로 갈랐는데, 그 값은 알림톡 링크가 준
 * 값이라 사용자가 URL 을 바꿔 자신을 멘토로 위장하면 멘티가 자동 출석(mentorStatus)을
 * 켤 수 있었다. 여기서는 그 경로를 막는다.
 */
export function useLiveMentoringEntry({
  applicationId,
  entry,
}: Params): LiveMentoringEntryFlow {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const createMeetingRoom =
    useCreateLiveMentoringEntryMeetingRoomMutation(applicationId);
  const updateAttendance =
    useUpdateLiveMentoringEntryAttendanceMutation(applicationId);

  // 서버가 base + meetingRoom 을 합성하므로 FE 는 base URL 만 보낸다.
  // 최초 등록(ensureLiveMeetingUrl)과 실행 중 failover(JitsiEmbed)가 함께 쓴다.
  const registerBaseUrl = async (base: string) => {
    await createMeetingRoom.mutateAsync(base);
  };

  const enter = async () => {
    if (isPreparing) return;
    setIsPreparing(true);
    try {
      const result = await ensureLiveMeetingUrl({
        meetingUrl: entry?.meetingUrl ?? null,
        baseCandidates: JITSI_BASE_CANDIDATES,
        registerBaseUrl,
      });

      if (!result.ok) {
        window.alert(
          '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        );
        return;
      }

      // 멘토만 자동 출석. 출석 실패는 입장을 막지 않는다.
      if (entry?.myRole === 'MENTOR' && entry.mentorStatus !== 'PRESENT') {
        try {
          await updateAttendance.mutateAsync({ mentorStatus: 'PRESENT' });
        } catch {
          // 출석 기록 실패 — 입장은 계속 진행.
        }
      }

      setIsOpen(true);
    } catch (error) {
      console.error('라이브 입장 준비 중 오류:', error);
      window.alert(
        '회의실 연결을 준비하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsPreparing(false);
    }
  };

  const closeJitsi = () => setIsOpen(false);

  return {
    isOpen,
    isPreparing,
    enter,
    closeJitsi,
    baseCandidates: JITSI_BASE_CANDIDATES,
    registerBaseUrl,
  };
}
