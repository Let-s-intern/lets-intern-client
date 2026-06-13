'use client';

import { useState } from 'react';

import {
  usePatchFeedbackMeetingUrl,
  usePatchMentorFeedbackStatus,
} from '@/api/feedback/feedback';
import type { FeedbackInfo } from '@/api/feedback/feedbackSchema';

import { ensureLiveMeetingUrl } from '@letscareer/ui/JitsiEmbed/jitsiHealthCheck';

import type { LiveRole } from './liveRole';

interface Params {
  feedbackId: number;
  feedbackInfo: FeedbackInfo | null;
  role: LiveRole;
}

interface LiveEntry {
  /** 인라인 Jitsi 가 열려 있는지. enter 성공 시 true. */
  isOpen: boolean;
  /** 헬스체크/등록 진행 중 여부. */
  isPreparing: boolean;
  /** 입장 트리거 — 헬스체크 → (멘토면) 자동 출석 → 인라인 오픈. */
  enter: () => Promise<void>;
  /** 인라인 Jitsi 닫기. */
  closeJitsi: () => void;
}

/**
 * 라이브 입장 핵심 로직 (멘토·멘티 공통).
 *
 * - `ensureLiveMeetingUrl` 로 회의실을 확보한다. 이미 meetingUrl 이 있으면 그대로,
 *   없으면 healthy base 를 PATCH 로 등록해 BE 가 합성하도록 한다(데드락 방지).
 *   등록 후 useFeedbackDetailQuery 가 invalidate → refetch 되어 합성 meetingUrl 이 채워진다.
 * - role==='MENTOR' 이면 입장 성공 시 mentorStatus=PRESENT 로 자동 출석한다.
 *   출석 PATCH 실패는 입장을 막지 않는다(에러 swallow).
 *
 * 실제 회의실 URL 은 refetch 된 `feedbackInfo.meetingUrl` 을 컨테이너가 사용하므로,
 * 이 훅은 "열림 여부"만 소유한다(URL 의 단일 출처는 쿼리).
 */
export function useLiveEntry({
  feedbackId,
  feedbackInfo,
  role,
}: Params): LiveEntry {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  const patchMeetingUrl = usePatchFeedbackMeetingUrl(feedbackId);
  const patchMentorStatus = usePatchMentorFeedbackStatus(feedbackId);

  const enter = async () => {
    if (isPreparing) return;
    setIsPreparing(true);
    try {
      const result = await ensureLiveMeetingUrl({
        meetingUrl: feedbackInfo?.meetingUrl,
        baseCandidates: [
          process.env.NEXT_PUBLIC_JITSI_BASE_URL,
          process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL,
        ],
        // BE 가 base + meetingRoom 을 합성하므로 FE 는 base URL 만 보낸다.
        registerBaseUrl: async (base) => {
          await patchMeetingUrl.mutateAsync({ meetingUrl: base });
        },
      });

      if (!result.ok) {
        window.alert(
          '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        );
        return;
      }

      // 멘토만 자동 출석. 출석 실패는 입장을 막지 않는다.
      if (role === 'MENTOR') {
        try {
          await patchMentorStatus.mutateAsync({ mentorStatus: 'PRESENT' });
        } catch {
          // 출석 기록 실패 — 입장은 계속 진행.
        }
      }

      setIsOpen(true);
    } finally {
      setIsPreparing(false);
    }
  };

  const closeJitsi = () => setIsOpen(false);

  return { isOpen, isPreparing, enter, closeJitsi };
}
