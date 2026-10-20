import { useCallback, useEffect, useRef, useState } from 'react';

import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import mentorConfig from '@/constants/config';
import { isBlankFeedback } from '../utils/feedbackContent';
import {
  clearFeedbackDraft,
  saveFeedbackDraft,
} from '../utils/feedbackLocalDraft';

interface UseFeedbackAutosaveParams {
  /** 저장 대상 출석 id. 서면 모달·라이브 모달이 같은 서버 레코드를 쓰므로 초안 키도 같다. */
  attendanceId: number | null;
  /** 지금 에디터 본문. */
  content: string;
  /** 마지막으로 서버에 저장된 본문 — 이것과 다를 때만 저장한다. */
  savedContent: string;
  /** 작성 가능한 상태인지(제출 완료·지각 제출·모달 닫힘이면 false). */
  enabled: boolean;
  /** 서버 자동 저장 성공 — 호출부가 저장본 기준을 갱신한다. */
  onServerSaved: (content: string) => void;
}

interface PendingDraft {
  attendanceId: number;
  content: string;
  savedContent: string;
}

const isSameFeedback = (a: string, b: string) =>
  a === b || (isBlankFeedback(a) && isBlankFeedback(b));

function writeLocalDraft({
  attendanceId,
  content,
  savedContent,
}: PendingDraft) {
  if (isSameFeedback(content, savedContent)) clearFeedbackDraft(attendanceId);
  else saveFeedbackDraft(attendanceId, content);
}

/**
 * 서면 피드백 자동 저장 — 로컬 초안과 서버 임시저장을 함께 한다.
 *
 * - 로컬: 입력이 멈추고 `localDraftDebounceMs` 뒤 브라우저에 남긴다. 탭 숨김·페이지
 *   이탈·멘티 전환·비활성화 때는 기다리지 않고 바로 남긴다.
 * - 서버: 저장되지 않은 변경이 생기면 `serverAutosaveIntervalMs` 마다 최신 본문을 보낸다.
 *   쉬지 않고 입력해도 저장되도록 디바운스가 아니라 주기로 보낸다.
 *
 * 서버에는 `feedbackStatus` 없이 본문만 보낸다. 서버는 멘토 수정을 제출 완료 뒤에도
 * 막지 않아서, 상태값을 실으면 제출 직후 도착한 자동 저장이 COMPLETED 를 IN_PROGRESS 로
 * 되돌린다. 본문만 보내면 서버가 WAITING 일 때만 IN_PROGRESS 로 올린다.
 */
export function useFeedbackAutosave({
  attendanceId,
  content,
  savedContent,
  enabled,
  onServerSaved,
}: UseFeedbackAutosaveParams) {
  const { mutate } = usePatchAttendanceMentorMutation();
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  const latestRef = useRef({ attendanceId, content, enabled, onServerSaved });
  latestRef.current = { attendanceId, content, enabled, onServerSaved };

  // ── 로컬 초안 ────────────────────────────────────────────────────────────
  const pendingDraftRef = useRef<PendingDraft | null>(null);

  const flushLocalDraft = useCallback(() => {
    if (!pendingDraftRef.current) return;
    writeLocalDraft(pendingDraftRef.current);
    pendingDraftRef.current = null;
  }, []);

  useEffect(() => {
    if (!enabled || attendanceId == null) return;
    pendingDraftRef.current = { attendanceId, content, savedContent };
    const timer = setTimeout(
      flushLocalDraft,
      mentorConfig.feedback.localDraftDebounceMs,
    );
    return () => clearTimeout(timer);
  }, [enabled, attendanceId, content, savedContent, flushLocalDraft]);

  // 멘티 전환·비활성화·언마운트 때 남은 입력을 이전 키로 남긴다.
  useEffect(() => flushLocalDraft, [enabled, attendanceId, flushLocalDraft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushLocalDraft();
    };
    window.addEventListener('pagehide', flushLocalDraft);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('pagehide', flushLocalDraft);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [flushLocalDraft]);

  // ── 서버 자동 임시저장 ────────────────────────────────────────────────────
  const isInFlightRef = useRef(false);
  const shouldSaveToServer =
    enabled && attendanceId != null && !isSameFeedback(content, savedContent);

  useEffect(() => {
    if (!shouldSaveToServer) return;
    const timer = setTimeout(() => {
      const latest = latestRef.current;
      if (!latest.enabled || latest.attendanceId == null) return;
      if (isInFlightRef.current) return;

      const sentAttendanceId = latest.attendanceId;
      const sentContent = latest.content;
      isInFlightRef.current = true;
      setIsAutoSaving(true);
      mutate(
        { attendanceId: sentAttendanceId, feedback: sentContent },
        {
          onSuccess: () => {
            // 응답 전에 다른 멘티로 옮겼으면 그 화면의 저장본 기준을 건드리지 않는다.
            if (latestRef.current.attendanceId !== sentAttendanceId) return;
            latestRef.current.onServerSaved(sentContent);
          },
          // 실패는 알리지 않는다. 로컬 초안이 남아 있고 다음 주기에 다시 보낸다.
          onSettled: () => {
            isInFlightRef.current = false;
            setIsAutoSaving(false);
          },
        },
      );
    }, mentorConfig.feedback.serverAutosaveIntervalMs);
    return () => clearTimeout(timer);
    // content 는 일부러 뺐다. 넣으면 입력마다 타이머가 다시 시작돼 쉬지 않고 쓰는
    // 동안 한 번도 저장되지 않는다. 보낼 때는 latestRef 로 최신 본문을 읽는다.
  },[shouldSaveToServer, attendanceId, savedContent, mutate]);

  return { isAutoSaving };
}
