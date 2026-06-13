import { useState } from 'react';

import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';

import type { FeedbackAttendanceStatus } from '@/api/feedback/feedbackSchema';
import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';
import MenteeLinkPanel from '@/pages/feedback/ui/MenteeLinkPanel';
import { isNotionUrl } from '@/pages/feedback/utils/notion';

import LiveSessionTimer from './LiveSessionTimer';

/**
 * Jitsi 회의실 모달.
 *
 * 방 URL 은 BE 가 합성한 `meetingUrl`(= jitsi base + 랜덤 `meetingRoom`)을 그대로 사용한다.
 * 멘토/멘티/어드민이 동일 `feedbackId` 의 동일 `meetingUrl` 을 받으므로 같은 방으로 수렴하며,
 * 방 이름이 서버 생성 랜덤값이라 외부에서 추측·접속할 수 없다.
 *
 * 레이아웃:
 * - 화상은 중앙에 최대폭 제한으로 배치(좌우 레터박스) — 너무 넓게 늘려 확대돼 보이는 것 방지.
 * - 상단 중앙: 세션 타이머 + (멘토) 멘티 출석 체크 — 반투명 플로팅.
 * - 좌하단: 사전 Q&A · 제출물을 각각 여는 반투명 동그란 버튼. 누르면 해당 자료만 띄운다.
 */
interface JitsiEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** BE 가 합성한 회의실 URL. 아직 생성 전이면 null. */
  meetingUrl: string | null;
  /** 모달 헤더 표시용 라벨 (선택). URL 에는 영향 없음. */
  spaceName?: string;
  /** 멘티 사전 질문 — 사전 Q&A 버튼/패널. */
  preQuestion?: string;
  /** 멘티 제출물 URL — 제출물 버튼/패널. */
  submissionUrl?: string;
  /** 멘티 이름 — 자료/출석 체크 문구용. */
  menteeName: string;
  /** 세션 시작 ISO — 타이머용. */
  startDate?: string;
  /** 세션 종료 ISO — 타이머용. */
  endDate?: string;
  /** 멘토 시점 여부 — true일 때만 멘티 출석 체크 바 노출. */
  isMentor?: boolean;
  /** 멘티 라이브 출석 현재값 — 버튼 현재 상태 표시용. */
  menteeStatus?: FeedbackAttendanceStatus;
  /** 멘티 출석 상태 저장 핸들러. */
  onSaveAttendance?: (status: FeedbackAttendanceStatus) => void;
  /** 출석 저장 진행 중 여부 — 버튼 로딩. */
  isSavingAttendance?: boolean;
}

/** 멘티 라이브 출석 현재값 → 표시 라벨. */
function attendanceLabel(status?: FeedbackAttendanceStatus): string {
  switch (status) {
    case 'PRESENT':
      return '참석';
    case 'ABSENT':
      return '불참';
    default:
      return '확인 전';
  }
}

interface MenteeAttendanceBarProps {
  menteeName: string;
  menteeStatus?: FeedbackAttendanceStatus;
  isSaving?: boolean;
  onSave?: (status: FeedbackAttendanceStatus) => void;
}

/** 화상 위에 떠 있는 멘티 출석 체크 바 — 참석/불참 선택. */
const MenteeAttendanceBar = ({
  menteeName,
  menteeStatus,
  isSaving,
  onSave,
}: MenteeAttendanceBarProps) => {
  const baseChip =
    'rounded-lg px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50';
  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-black/45 py-1.5 pl-4 pr-1.5 text-white shadow-lg backdrop-blur-md">
      <span className="text-xs font-medium text-white/70">
        {menteeName} 님 출석
      </span>
      <span className="text-xs font-semibold text-white/90">
        {attendanceLabel(menteeStatus)}
      </span>
      <span className="h-4 w-px bg-white/20" />
      <button
        type="button"
        disabled={isSaving}
        onClick={() => onSave?.('PRESENT')}
        className={twMerge(
          baseChip,
          menteeStatus === 'PRESENT'
            ? 'bg-[#4d55f5] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        참석
      </button>
      <button
        type="button"
        disabled={isSaving}
        onClick={() => onSave?.('ABSENT')}
        className={twMerge(
          baseChip,
          menteeStatus === 'ABSENT'
            ? 'bg-[#fc5555] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        불참
      </button>
    </div>
  );
};

type MaterialPanel = 'qna' | 'submission';

/** 반투명 동그란 플로팅 버튼 — 자료 토글용. */
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
    aria-label={label}
    aria-pressed={active}
    className={twMerge(
      'flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg backdrop-blur-md transition',
      active ? 'bg-[#4d55f5]/85' : 'bg-black/45 hover:bg-black/60',
    )}
  >
    {children}
  </button>
);

/** 화상 위에 뜨는 자료 패널 — 내용은 축소 없이 원본 크기로 표시. */
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
      'flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl',
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

const JitsiEmbedModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
  preQuestion,
  submissionUrl,
  menteeName,
  startDate,
  endDate,
  isMentor,
  menteeStatus,
  onSaveAttendance,
  isSavingAttendance,
}: JitsiEmbedModalProps) => {
  const [openPanel, setOpenPanel] = useState<MaterialPanel | null>(null);

  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const hasSubmission = !!submissionUrl;
  const isNotionSubmission = hasSubmission && isNotionUrl(submissionUrl);

  const toggle = (panel: MaterialPanel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="aspect-video max-h-[92vh] w-[1280px] max-w-[95vw] overflow-hidden rounded-2xl bg-neutral-900 md:rounded-3xl"
    >
      <div className="relative h-full w-full">
        {/* 모달 자체가 16:9 → 화상이 박스를 꽉 채워 확대/크롭·레터박스 없이 보인다. */}
        <div className="absolute inset-0">
          {meetingUrl ? (
            <JitsiEmbed
              roomUrl={meetingUrl}
              spaceName={spaceName}
              onClose={onClose}
            />
          ) : (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-300">
              회의실이 아직 준비되지 않았습니다.
              <br />
              멘토가 라이브 피드백에 입장하면 회의실이 열립니다.
            </div>
          )}
        </div>

        {/* 상단 중앙 플로팅 — 타이머 + (멘토) 출석 체크 */}
        <div className="pointer-events-none absolute left-1/2 top-3 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
          {startDate && endDate && (
            <LiveSessionTimer startDate={startDate} endDate={endDate} />
          )}
          {isMentor && (
            <MenteeAttendanceBar
              menteeName={menteeName}
              menteeStatus={menteeStatus}
              isSaving={isSavingAttendance}
              onSave={onSaveAttendance}
            />
          )}
        </div>
      </div>

      {/* 자료 버튼/패널 — 모달 바깥(뷰포트 좌하단)에 고정. 넓은 화면에서 화상을 가리지 않는다. */}
      {(hasPreQuestion || hasSubmission) && (
        <div className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-3">
          {openPanel === 'qna' && hasPreQuestion && (
            <FloatingPanel
              title="사전 Q&A"
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
              title={`${menteeName} 님의 제출물`}
              onClose={() => setOpenPanel(null)}
              className="h-[70vh] w-[400px] max-w-[80vw]"
            >
              {isNotionSubmission ? (
                <MenteeLinkPanel
                  hideHeader
                  fit="scale"
                  scale={0.7}
                  onClose={() => setOpenPanel(null)}
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
                label="사전 Q&A 보기"
                active={openPanel === 'qna'}
                onClick={() => toggle('qna')}
              >
                <QnaIcon />
              </SemiFab>
            )}
            {hasSubmission && (
              <SemiFab
                label="제출물 보기"
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

export default JitsiEmbedModal;
