'use client';

import { useEffect, useRef, useState } from 'react';

import {
  JitsiEmbed,
  LiveFeedbackMaterials,
  LiveSessionTimer,
} from '@letscareer/live-session/JitsiEmbed';

import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';

import type { LiveMentoringEntryRole } from '@/api/live-mentoring/liveMentoringSchema';

/** 멘티 라이브 출석 상태 */
type AttendanceStatus = 'PENDING' | 'PRESENT' | 'ABSENT';

interface LiveMentoringSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingUrl: string | null;
  spaceName?: string;
  /**
   * 이 세션에서 조회자의 역할. **서버가 판정한 값이다** — URL 의 role 세그먼트가
   * 아니다. 멘토일 때만 출석 체크 바를 노출한다.
   */
  myRole: LiveMentoringEntryRole;
  menteeName: string;
  preQuestion?: string;
  submissionUrl?: string;
  startDate?: string;
  endDate?: string;
  menteeStatus?: AttendanceStatus;
  /** 출석 저장(모달 닫힘/종료 시 일괄). */
  onSaveAttendance?: (status: AttendanceStatus) => void;
  /** 우선순위 순 jitsi base 후보 — 현재 서버 실패 시 다음 후보로 failover. */
  baseCandidates?: ReadonlyArray<string | undefined>;
  /** 다음 base 를 BE 에 재등록하는 콜백. */
  registerBaseUrl?: (base: string) => Promise<void>;
  /** 모든 후보 소진(입장 가능한 서버 없음) 시 호출. */
  onExhausted?: () => void;
}

/** 출석 체크 바 — 참석/불참 토글. 한번 더 누르면 해제(저장은 지연). */
const MenteeAttendanceBar = ({
  menteeName,
  selected,
  onSelect,
}: {
  menteeName: string;
  selected: AttendanceStatus | null;
  onSelect: (status: AttendanceStatus | null) => void;
}) => {
  const baseChip =
    'shrink-0 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition disabled:opacity-50 md:py-1.5';
  const toggle = (status: AttendanceStatus) =>
    onSelect(selected === status ? null : status);
  return (
    <div
      className={twMerge(
        'flex max-w-[calc(100vw-1rem)] items-center gap-1.5 rounded-full py-1 pl-3 pr-1 shadow-lg backdrop-blur-md transition-colors',
        selected
          ? 'border border-transparent bg-white/10 text-white'
          : 'border border-white/40 bg-white/70 text-neutral-800',
      )}
    >
      <span
        className={twMerge(
          'shrink-0 whitespace-nowrap text-xs font-semibold',
          selected ? 'text-white/80' : 'text-neutral-900',
        )}
      >
        {menteeName}님의 출석여부를 체크해 주세요
      </span>
      <span
        className={twMerge(
          'h-4 w-px shrink-0',
          selected ? 'bg-white/25' : 'bg-neutral-400',
        )}
      />
      <button
        type="button"
        onClick={() => toggle('PRESENT')}
        className={twMerge(
          baseChip,
          selected === 'PRESENT'
            ? 'bg-[#4d55f5]/70 text-white'
            : selected
              ? 'text-white/70 hover:bg-white/10'
              : 'bg-black/5 text-neutral-800 hover:bg-black/10',
        )}
      >
        출석
      </button>
      <button
        type="button"
        onClick={() => toggle('ABSENT')}
        className={twMerge(
          baseChip,
          selected === 'ABSENT'
            ? 'bg-[#fc5555]/70 text-white'
            : selected
              ? 'text-white/70 hover:bg-white/10'
              : 'bg-black/5 text-neutral-800 hover:bg-black/10',
        )}
      >
        결석
      </button>
    </div>
  );
};

/**
 * 1대1 세션 입장 모달 — 라이브 피드백 입장 모달(`LiveFeedbackModal`)과 같은 디자인.
 *
 * `.claude/rules/core.md` 에 따라 그 컴포넌트를 임포트하지 않고 도메인 안에 따로
 * 둔다. 대신 실제 회의 임베드(`JitsiEmbed`, `LiveSessionTimer`,
 * `LiveFeedbackMaterials`)는 `@letscareer/live-session` 공용 패키지를 그대로
 * 쓴다 — 멘토 앱·챌린지 라이브 피드백이 이미 쓰는 인프라를 다시 구현할 이유가 없다.
 *
 * - 4:3 모달, 좌상단 로고+타이머 아크릴(JitsiEmbed topLeftSlot).
 * - 좌하단 자료 버튼/패널(사전질문·제출물)은 공용 `LiveFeedbackMaterials` 사용.
 * - 멘토 시점: 중앙 하단 출석 체크(토글). 저장은 닫힘/세션 종료 시 일괄.
 * - 멘티 시점: 출석 체크 없이 동일 레이아웃.
 */
const LiveMentoringSessionModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
  myRole,
  menteeName,
  preQuestion,
  submissionUrl,
  startDate,
  endDate,
  menteeStatus,
  onSaveAttendance,
  baseCandidates,
  registerBaseUrl,
  onExhausted,
}: LiveMentoringSessionModalProps) => {
  const [pendingAttendance, setPendingAttendance] =
    useState<AttendanceStatus | null>(
      menteeStatus === 'PRESENT' || menteeStatus === 'ABSENT'
        ? menteeStatus
        : null,
    );
  const pendingRef = useRef(pendingAttendance);
  pendingRef.current = pendingAttendance;
  const savedRef = useRef(menteeStatus);
  savedRef.current = menteeStatus;
  const onSaveRef = useRef(onSaveAttendance);
  onSaveRef.current = onSaveAttendance;

  const flushAttendance = () => {
    const next = pendingRef.current;
    if (next && next !== savedRef.current) onSaveRef.current?.(next);
  };
  const handleClose = () => {
    flushAttendance();
    onClose();
  };

  useEffect(() => {
    if (!isOpen || !endDate) return;
    const ms = new Date(endDate).getTime() - Date.now();
    if (ms <= 0) {
      flushAttendance();
      return;
    }
    const id = setTimeout(flushAttendance, ms);
    return () => clearTimeout(id);
    // flushAttendance 는 ref 기반 — isOpen/endDate 변화에만 재설정.
  }, [isOpen, endDate]);

  const isMentor = myRole === 'MENTOR';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      overlayClassName="bg-black/50 backdrop-blur-sm"
      className="rounded-xxl relative z-10 h-[96dvh] max-h-[96dvh] w-[98vw] overflow-hidden bg-black md:mt-3 md:aspect-[4/3] md:h-[96vh] md:max-h-[1080px] md:w-auto md:max-w-[96vw] md:self-start"
    >
      <div className="relative h-full w-full">
        <div className="absolute inset-0">
          {meetingUrl ? (
            <JitsiEmbed
              roomUrl={meetingUrl}
              spaceName={spaceName}
              onClose={handleClose}
              baseCandidates={baseCandidates}
              registerBaseUrl={registerBaseUrl}
              onExhausted={onExhausted}
              topLeftSlot={
                startDate && endDate ? (
                  <LiveSessionTimer endDate={endDate} />
                ) : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-300">
              회의실이 아직 준비되지 않았습니다.
              <br />
              상대가 입장하면 회의실이 열립니다.
            </div>
          )}
        </div>

        {isMentor && (
          <div
            data-testid="mentor-attendance-anchor"
            className="absolute left-3 top-[98px] z-10 md:bottom-20 md:left-1/2 md:top-auto md:-translate-x-1/2"
          >
            <MenteeAttendanceBar
              menteeName={menteeName}
              selected={pendingAttendance}
              onSelect={setPendingAttendance}
            />
          </div>
        )}
      </div>

      <LiveFeedbackMaterials
        viewer={myRole}
        menteeName={menteeName}
        preQuestion={preQuestion}
        submissionUrl={submissionUrl}
      />
    </BaseModal>
  );
};

export default LiveMentoringSessionModal;
