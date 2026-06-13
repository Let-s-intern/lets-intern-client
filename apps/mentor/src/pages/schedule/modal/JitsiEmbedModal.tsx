import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';

import type { FeedbackAttendanceStatus } from '@/api/feedback/feedbackSchema';
import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';

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
 * - 좌(약 38%): 멘티 자료 패널(사전 Q&A · 제출물)
 * - 우(약 62%): 세션 타이머 + (멘토) 멘티 출석 체크 + 화상(JitsiEmbed)
 * - 모바일: 세로 스택(자료 패널 위, 화상 아래)
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
  /** 멘토 시점 여부 — true일 때만 멘티 출석 체크 버튼 노출. */
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

interface MenteeAttendanceCheckProps {
  menteeName: string;
  menteeStatus?: FeedbackAttendanceStatus;
  isSaving?: boolean;
  onSave?: (status: FeedbackAttendanceStatus) => void;
}

/** 우측 패널 멘티 출석 체크 — 참석/불참 인라인 토글. */
const MenteeAttendanceCheck = ({
  menteeName,
  menteeStatus,
  isSaving,
  onSave,
}: MenteeAttendanceCheckProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-[4px] border border-neutral-200 bg-white px-3 py-2.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-500">
          {menteeName} 님 출석 체크 — 참석/불참
        </span>
        <span className="text-xs font-medium text-neutral-700">
          {attendanceLabel(menteeStatus)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onSave?.('PRESENT')}
          className={twMerge(
            menteeStatus === 'PRESENT'
              ? feedbackModalDesign.footerPrimary
              : feedbackModalDesign.outlineButton,
            'flex-1 justify-center disabled:opacity-50',
          )}
        >
          참석
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={() => onSave?.('ABSENT')}
          className={twMerge(
            feedbackModalDesign.outlineButton,
            'flex-1 justify-center disabled:opacity-50',
            menteeStatus === 'ABSENT' && 'border-red-400 text-red-500',
          )}
        >
          불참
        </button>
      </div>
    </div>
  );
};

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
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 h-[92vh] w-[1280px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[90vh] md:rounded-3xl"
    >
      <div className="flex h-full min-h-0 flex-col md:flex-row">
        {/* 좌측(약 38%): 멘티 자료 패널 */}
        <div className="min-h-0 shrink-0 overflow-y-auto border-b border-neutral-200 p-4 md:h-full md:w-[38%] md:border-b-0 md:border-r">
          <JitsiSidePanel
            preQuestion={preQuestion}
            submissionUrl={submissionUrl}
            menteeName={menteeName}
          />
        </div>

        {/* 우측(약 62%): 타이머 + (멘토) 출석 체크 + 화상 */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-4">
          {startDate && endDate && (
            <LiveSessionTimer startDate={startDate} endDate={endDate} />
          )}

          {isMentor && (
            <MenteeAttendanceCheck
              menteeName={menteeName}
              menteeStatus={menteeStatus}
              isSaving={isSavingAttendance}
              onSave={onSaveAttendance}
            />
          )}

          <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-neutral-900">
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
        </div>
      </div>
    </BaseModal>
  );
};

export default JitsiEmbedModal;
