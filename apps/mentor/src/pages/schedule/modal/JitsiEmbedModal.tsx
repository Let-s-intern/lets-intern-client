import { useState } from 'react';

import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';

import type { FeedbackAttendanceStatus } from '@/api/feedback/feedbackSchema';
import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';

import JitsiSidePanel from './JitsiSidePanel';
import LiveSessionTimer from './LiveSessionTimer';

/**
 * Jitsi 회의실 모달 (split 레이아웃).
 *
 * 방 URL 은 BE 가 합성한 `meetingUrl`(= jitsi base + 랜덤 `meetingRoom`)을 그대로 사용한다.
 * 멘토/멘티/어드민이 동일 `feedbackId` 의 동일 `meetingUrl` 을 받으므로 같은 방으로 수렴하며,
 * 방 이름이 서버 생성 랜덤값이라 외부에서 추측·접속할 수 없다.
 *
 * 레이아웃:
 * - 좌(드로어): 멘티 자료 패널(사전 Q&A · 제출물). 토글로 접고 펼침 — 접으면 화상이 전폭.
 * - 우: 화상(JitsiEmbed)이 영역을 가득 채우고, 그 위에 타이머가 투명하게 플로팅.
 *   멘토 시점이면 화상 위에 멘티 출석 체크 바를 띄운다.
 */
interface JitsiEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** BE 가 합성한 회의실 URL. 아직 생성 전이면 null. */
  meetingUrl: string | null;
  /** 모달 헤더 표시용 라벨 (선택). URL 에는 영향 없음. */
  spaceName?: string;
  /** 멘티 사전 질문 — 좌측 자료 패널 상단. */
  preQuestion?: string;
  /** 멘티 제출물 URL — 좌측 자료 패널 하단. */
  submissionUrl?: string;
  /** 멘티 이름 — 자료 패널/출석 체크 문구용. */
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

/** 멘티 자료 FAB — 좌하단 동그란 플로팅 버튼. 누르면 폰 프레임이 열린다. */
const MaterialsFab = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="멘티 자료 보기"
    className="absolute bottom-5 left-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white text-neutral-700 shadow-xl ring-1 ring-black/5 transition hover:bg-neutral-50"
  >
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
  </button>
);

/** 휴대폰 화면처럼 보이는 자료 패널 — 좌하단에 세로(포트레이트)로 뜬다. */
const PhoneFramePanel = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="absolute bottom-5 left-5 z-20 flex h-[78%] max-h-[680px] w-[340px] max-w-[82%] flex-col overflow-hidden rounded-[2rem] border-[6px] border-neutral-900 bg-white shadow-2xl">
    <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-4 py-3">
      <span className="text-sm font-semibold text-neutral-800">멘티 자료</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="자료 닫기"
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
    <div className="min-h-0 flex-1 overflow-y-auto bg-neutral-50 p-3">
      {children}
    </div>
  </div>
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
  const [materialsOpen, setMaterialsOpen] = useState(false);

  const hasMaterials =
    (!!preQuestion && preQuestion.trim().length > 0) || !!submissionUrl;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 h-[92vh] w-[1280px] max-w-full overflow-hidden rounded-2xl bg-neutral-900 md:mx-4 md:h-[90vh] md:rounded-3xl"
    >
      {/* 화상이 모달을 가득 채우고, 그 위로 타이머·출석·자료를 플로팅한다. */}
      <div className="relative h-full w-full">
        {meetingUrl ? (
          <div className="absolute inset-0">
            <JitsiEmbed
              roomUrl={meetingUrl}
              spaceName={spaceName}
              onClose={onClose}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-300">
            회의실이 아직 준비되지 않았습니다.
            <br />
            멘토가 라이브 피드백에 입장하면 회의실이 열립니다.
          </div>
        )}

        {/* 상단 중앙 플로팅 — 타이머 + (멘토) 출석 체크.
            JitsiEmbed 자체 UI(좌상단 로고 · 우상단 닫기)를 피해 중앙에 둔다. */}
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

        {/* 좌하단 — 자료 FAB / 폰 프레임(휴대폰 화면처럼) */}
        {hasMaterials &&
          (materialsOpen ? (
            <PhoneFramePanel onClose={() => setMaterialsOpen(false)}>
              <JitsiSidePanel
                mobileView
                preQuestion={preQuestion}
                submissionUrl={submissionUrl}
                menteeName={menteeName}
              />
            </PhoneFramePanel>
          ) : (
            <MaterialsFab onClick={() => setMaterialsOpen(true)} />
          ))}
      </div>
    </BaseModal>
  );
};

export default JitsiEmbedModal;
