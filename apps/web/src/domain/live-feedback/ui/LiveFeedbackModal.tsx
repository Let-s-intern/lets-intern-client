'use client';

import { useEffect, useRef, useState } from 'react';

import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';

import BaseModal from '@/common/modal/BaseModal';
import { isAllowedNotionUrl } from '@/common/lexical/utils/notion';
import { twMerge } from '@/lib/twMerge';

import type { LiveRole } from '../hooks/liveRole';
import LiveSessionTimer from './LiveSessionTimer';
import NotionSubmissionPanel from './NotionSubmissionPanel';

/** 멘티 라이브 출석 상태 */
type AttendanceStatus = 'PENDING' | 'PRESENT' | 'ABSENT';

interface LiveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingUrl: string | null;
  spaceName?: string;
  /** 이 세션에서의 역할 — 멘토일 때만 출석 체크 노출. */
  role: LiveRole;
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
  /** 다음 base 를 BE 에 재등록하는 콜백 (`PATCH /feedback/{id}/meeting-url`). */
  registerBaseUrl?: (base: string) => Promise<void>;
  /** 모든 후보 소진(입장 가능한 서버 없음) 시 호출. */
  onExhausted?: () => void;
}

type MaterialPanel = 'qna' | 'submission';

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
    'rounded-lg px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50';
  const toggle = (status: AttendanceStatus) =>
    onSelect(selected === status ? null : status);
  return (
    <div className="flex items-center gap-2 rounded-full bg-black/45 py-1.5 pl-4 pr-1.5 text-white shadow-lg backdrop-blur-md">
      <span className="text-xs font-medium text-white/80">
        {menteeName} 님 출석
      </span>
      <span className="h-4 w-px bg-white/20" />
      <button
        type="button"
        onClick={() => toggle('PRESENT')}
        className={twMerge(
          baseChip,
          selected === 'PRESENT'
            ? 'bg-[#4d55f5] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        참석
      </button>
      <button
        type="button"
        onClick={() => toggle('ABSENT')}
        className={twMerge(
          baseChip,
          selected === 'ABSENT'
            ? 'bg-[#fc5555] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        불참
      </button>
    </div>
  );
};

/** 반투명 플로팅 버튼(아이콘 + 글자) — 자료 토글용. */
const SemiFab = ({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={twMerge(
      'flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-md transition',
      active ? 'bg-[#4d55f5]/90' : 'bg-black/55 hover:bg-black/70',
    )}
  >
    {children}
    <span>{label}</span>
  </button>
);

/** 화상 위에 뜨는 자료 패널. */
const FloatingPanel = ({
  title,
  onClose,
  className,
  children,
}: {
  title: string;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}) => (
  <div
    className={twMerge(
      'rounded-xxl flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-2xl',
      className,
    )}
  >
    <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-2.5">
      <span className="text-sm font-semibold text-neutral-800">{title}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label={`${title} 닫기`}
        className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
  </div>
);

const QnaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 5.5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9l-4 3.5V6.5a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9.2 9.4a2.8 2.8 0 0 1 5.4 1c0 1.6-2.3 2-2.3 3.2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle
      cx="12.1"
      cy="15.6"
      r="0.5"
      fill="currentColor"
      stroke="currentColor"
    />
  </svg>
);

const DocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M7 3.5h7L18.5 8v11.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <path
      d="M13.5 3.5V8H18M9 12h6M9 15h6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * 라이브 피드백 입장 모달 — 멘토 앱 모달과 동일 디자인.
 *
 * - 4:3 모달, 좌상단 로고+타이머 아크릴(JitsiEmbed topLeftSlot), 좌하단 자료 버튼/패널.
 * - 멘토 시점: 중앙 하단 출석 체크(토글). 저장은 닫힘/세션 종료 시 일괄(멘티 잠김 방지).
 * - 멘티 시점: 출석 체크 없이 동일 레이아웃.
 */
const LiveFeedbackModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
  role,
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
}: LiveFeedbackModalProps) => {
  const [openPanel, setOpenPanel] = useState<MaterialPanel | null>(null);

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

  const isMentor = role === 'MENTOR';
  const isMentee = role === 'MENTEE';
  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const hasSubmission = !!submissionUrl;
  const isNotionSubmission = hasSubmission && isAllowedNotionUrl(submissionUrl);

  // 멘티 시점이면 "나의 ~", 멘토 시점이면 "멘티 ~"로 표기.
  const qnaLabel = isMentee ? '나의 사전 QA' : '사전 QA';
  const submissionLabel = isMentee ? '나의 제출물' : '멘티 제출물';
  const qnaTitle = isMentee ? '나의 사전 Q&A' : '사전 Q&A';
  const submissionTitle = isMentee
    ? '나의 제출물'
    : `${menteeName} 님의 제출물`;

  const toggle = (panel: MaterialPanel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOverlayClick={false}
      className="rounded-xxl aspect-[4/3] h-[94vh] max-h-[980px] w-auto max-w-[96vw] overflow-hidden bg-neutral-900"
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
                  <LiveSessionTimer startDate={startDate} endDate={endDate} />
                ) : undefined
              }
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-300">
              회의실이 아직 준비되지 않았습니다.
              <br />
              멘토가 라이브 피드백에 입장하면 회의실이 열립니다.
            </div>
          )}
        </div>

        {/* 중앙 하단 — (멘토) 멘티 출석 체크 */}
        {isMentor && (
          <div
            className={twMerge(
              'absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-300',
              pendingAttendance && 'opacity-50 hover:opacity-100',
            )}
          >
            <MenteeAttendanceBar
              menteeName={menteeName}
              selected={pendingAttendance}
              onSelect={setPendingAttendance}
            />
          </div>
        )}
      </div>

      {/* 자료 버튼/패널 — 뷰포트 좌하단 고정 */}
      {(hasPreQuestion || hasSubmission) && (
        <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-3">
          {openPanel === 'qna' && hasPreQuestion && (
            <FloatingPanel
              title={qnaTitle}
              onClose={() => setOpenPanel(null)}
              className="max-h-[60vh] w-[340px] max-w-[80vw]"
            >
              <p className="whitespace-pre-wrap px-4 py-3 text-sm leading-6 text-neutral-700">
                {preQuestion}
              </p>
            </FloatingPanel>
          )}

          {openPanel === 'submission' && hasSubmission && (
            <FloatingPanel
              title={submissionTitle}
              onClose={() => setOpenPanel(null)}
              className="h-[70vh] w-[400px] max-w-[80vw]"
            >
              {isNotionSubmission ? (
                <NotionSubmissionPanel
                  link={submissionUrl!}
                  menteeName={menteeName}
                />
              ) : (
                <div className="p-4">
                  <a
                    href={submissionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                  >
                    새 탭에서 열기
                  </a>
                </div>
              )}
            </FloatingPanel>
          )}

          <div className="flex flex-col gap-2.5">
            {hasPreQuestion && (
              <SemiFab
                label={qnaLabel}
                active={openPanel === 'qna'}
                onClick={() => toggle('qna')}
              >
                <QnaIcon />
              </SemiFab>
            )}
            {hasSubmission && (
              <SemiFab
                label={submissionLabel}
                active={openPanel === 'submission'}
                onClick={() => toggle('submission')}
              >
                <DocIcon />
              </SemiFab>
            )}
          </div>
        </div>
      )}
    </BaseModal>
  );
};

export default LiveFeedbackModal;
