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

interface MenteeAttendanceBarProps {
  menteeName: string;
  menteeStatus?: FeedbackAttendanceStatus;
  isSaving?: boolean;
  /** 참석/불참 선택 후 "확인" 클릭 시 호출. 저장 + 바 닫기. */
  onConfirm?: (status: FeedbackAttendanceStatus) => void;
}

/** 출석 체크 바 — 참석/불참 선택 후 "확인"으로 확정한다. */
const MenteeAttendanceBar = ({
  menteeName,
  menteeStatus,
  isSaving,
  onConfirm,
}: MenteeAttendanceBarProps) => {
  const [selected, setSelected] = useState<FeedbackAttendanceStatus | null>(
    menteeStatus === 'PRESENT' || menteeStatus === 'ABSENT'
      ? menteeStatus
      : null,
  );
  const baseChip =
    'rounded-lg px-4 py-1.5 text-sm font-semibold transition disabled:opacity-50';
  return (
    <div className="flex items-center gap-2 rounded-full bg-black/45 py-1.5 pl-4 pr-1.5 text-white shadow-lg backdrop-blur-md">
      <span className="text-xs font-medium text-white/80">
        {menteeName} 님 출석
      </span>
      <span className="h-4 w-px bg-white/20" />
      <button
        type="button"
        disabled={isSaving}
        onClick={() => setSelected('PRESENT')}
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
        disabled={isSaving}
        onClick={() => setSelected('ABSENT')}
        className={twMerge(
          baseChip,
          selected === 'ABSENT'
            ? 'bg-[#fc5555] text-white'
            : 'text-white/80 hover:bg-white/10',
        )}
      >
        불참
      </button>
      <button
        type="button"
        disabled={!selected || isSaving}
        onClick={() => selected && onConfirm?.(selected)}
        className="rounded-lg bg-white px-4 py-1.5 text-sm font-bold text-neutral-900 transition hover:bg-neutral-100 disabled:opacity-40"
      >
        확인
      </button>
    </div>
  );
};

type MaterialPanel = 'qna' | 'submission';

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

  // 멘티 출석 바 — 이미 기록됐으면 처음부터 숨김, 확인 누르면 닫는다.
  const [attendanceDismissed, setAttendanceDismissed] = useState(
    menteeStatus === 'PRESENT' || menteeStatus === 'ABSENT',
  );
  const handleConfirmAttendance = (status: FeedbackAttendanceStatus) => {
    onSaveAttendance?.(status);
    setAttendanceDismissed(true);
  };

  const hasPreQuestion = !!preQuestion && preQuestion.trim().length > 0;
  const hasSubmission = !!submissionUrl;
  const isNotionSubmission = hasSubmission && isNotionUrl(submissionUrl);

  const toggle = (panel: MaterialPanel) =>
    setOpenPanel((prev) => (prev === panel ? null : panel));

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      className="aspect-[4/3] h-[94vh] max-h-[980px] w-auto max-w-[96vw] overflow-hidden rounded-2xl bg-neutral-900 md:rounded-3xl"
    >
      <div className="relative h-full w-full">
        {/* 모달 자체가 4:3(웹캠 480p 기본 비율) → 화상이 박스를 꽉 채워 확대/크롭 없이 보인다. */}
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

        {/* 좌측 상단 로고 바로 아래 — 현재/남은 시간 일체형 타이머. 항상 표시. */}
        {startDate && endDate && (
          <div className="absolute left-3 top-[72px] z-10">
            <LiveSessionTimer startDate={startDate} endDate={endDate} />
          </div>
        )}

        {/* 중앙 상단 — 멘티 출석 체크. 확인 누르면 사라진다. */}
        {isMentor && !attendanceDismissed && (
          <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2">
            <MenteeAttendanceBar
              menteeName={menteeName}
              menteeStatus={menteeStatus}
              isSaving={isSavingAttendance}
              onConfirm={handleConfirmAttendance}
            />
          </div>
        )}
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
                label="사전 QA"
                active={openPanel === 'qna'}
                onClick={() => toggle('qna')}
              >
                <QnaIcon />
              </SemiFab>
            )}
            {hasSubmission && (
              <SemiFab
                label="멘티 제출물"
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
