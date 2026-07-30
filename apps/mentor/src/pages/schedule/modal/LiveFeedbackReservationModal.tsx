import { useEffect, useMemo, useState } from 'react';

import { ensureLiveMeetingUrl } from '@letscareer/live-session/JitsiEmbed/jitsiHealthCheck';

import {
  useFeedbackMentorDetailQuery,
  useUpdateFeedbackByMentorMutation,
  useUpdateFeedbackMeetingUrlMutation,
} from '@/api/feedback/feedback';
import { usePatchAttendanceMentorMutation } from '@/api/mentor/mentor';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import BaseModal from '@/common/modal/BaseModal';
import MentorAlertModal from '@/common/modal/MentorAlertModal';
import { useMentorAlert } from '@/hooks/useMentorAlert';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { useFeedbackCountdown } from '@/pages/feedback/hooks/useFeedbackCountdown';
import FeedbackComposer from '@/pages/feedback/ui/FeedbackComposer';
import FeedbackPreviewCard from '@/pages/feedback/ui/FeedbackPreviewCard';
import FeedbackHeader from '@/pages/feedback/ui/FeedbackHeader';
import FeedbackLayout from '@/pages/feedback/ui/FeedbackLayout';
import FeedbackMenteeNavigation from '@/pages/feedback/ui/FeedbackMenteeNavigation';
import InfoTooltip from '@/pages/feedback/ui/InfoTooltip';
import MenteeAttendanceCheckModal from '@/pages/feedback/ui/MenteeAttendanceCheckModal';
import MenteeLinkPanel from '@/pages/feedback/ui/MenteeLinkPanel';
import MenteeInfoCompactRow from '@/pages/feedback/ui/MenteeInfoCompactRow';
import MenteeList from '@/pages/feedback/ui/MenteeList';
import MenteePreQuestionPanel from '@/pages/feedback/ui/MenteePreQuestionPanel';
import PanelEntryButton from '@/pages/feedback/ui/PanelEntryButton';
import SidebarGuideLinks from '@/pages/feedback/ui/SidebarGuideLinks';
import SideViewButton from '@/pages/feedback/ui/SideViewButton';
import {
  badgeStatusToUi,
  getLiveFeedbackBadgeVisual,
} from '@/pages/feedback/utils/liveFeedbackStatus';
import { isNotionUrl } from '@/pages/feedback/utils/notion';

import type { PeriodBarData } from '../types';
import { createGoogleCalendarUrl } from '../utils/googleCalendar';
import JitsiEmbedModal from './JitsiEmbedModal';

/** 좌측 사이드바 하단 가이드 링크 (세로 정렬). */
const GUIDE_LINK_LABELS = [
  '자소서챌린지 피드백 가이드',
  '라이브 피드백 가이드',
] as const;

/** 빈 값 대체용 placeholder */
const EMPTY_PLACEHOLDER = '-';

/** 라이브 입장하기 활성화 리드타임 — 시작 20분 전부터 입장 가능. */
const LIVE_ENTER_LEAD_MS = 20 * 60 * 1000;

/** "피드백 참여" 라벨 옆 ⓘ 툴팁 안내 문구. */
const PARTICIPATION_TOOLTIP_TEXT =
  '피드백 종료 후 멘티 참여 상태를 저장해주세요. 참여 여부 저장 후 진행 완료 및 정산 대상에 반영됩니다.';

interface LiveFeedbackReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bar: PeriodBarData | null;
  liveFeedbackBars: PeriodBarData[];
  onSelectBar: (bar: PeriodBarData) => void;
  /** 라이브 피드백 회차(라운드) — 헤더 "N차 피드백" 표시용. 세션마다 변하지 않음 */
  roundTh?: number;
}

/** 예약 일시 라인 표기 (예: `2026.05.04 (수) 10:00~10:30`) */
function formatReservationDateLine(
  dateStr: string,
  startTime?: string,
  endTime?: string,
): string {
  if (!startTime || !endTime) return dateStr;
  const [y, m, d] = dateStr.split('-');
  const date = new Date(`${dateStr}T00:00:00`);
  const dow = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${y}.${m}.${d} (${dow}) ${startTime} – ${endTime}`;
}

/** 체크 서클 아이콘 — 참여 확인하기 버튼 / 피드백 상태 라벨용. */
const CheckCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <circle cx="8" cy="8" r="6.3" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M5.4 8.2L7.1 9.9 10.6 6.1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LiveFeedbackReservationModal = ({
  isOpen,
  onClose,
  bar,
  liveFeedbackBars,
  onSelectBar,
  roundTh,
}: LiveFeedbackReservationModalProps) => {
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  // 멘토 입장 시 회의실 URL 준비(헬스체크 + PATCH) 진행 상태
  const [isPreparingRoom, setIsPreparingRoom] = useState(false);
  // 왼쪽 사이드 패널 — 제출물(노션)을 보면서 입장/확인. 한번 더 클릭하면 닫힘(토글).
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  // 오른쪽 사이드 패널 — 사전 Q&A. 작성 중 참조용이라 열어둔 채 유지한다.
  const [isPreQuestionPanelOpen, setIsPreQuestionPanelOpen] = useState(false);
  // "크게 보기" → 모달 전체화면 (상태는 FeedbackLayout 이 소유, 콜백으로 수신).
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 라이브 중 작성하는 서면 피드백 본문 (Lexical editor state JSON).
  const [feedbackContent, setFeedbackContent] = useState('');

  const { alertProps, showAlert, showConfirm } = useMentorAlert();

  // 모달을 닫으면 화면 상태를 초기화한다.
  // 부모(SchedulePage)가 이 컴포넌트를 항상 마운트해 두고 isOpen 만 토글하므로,
  // 리셋하지 않으면 확장·패널 상태가 다음 진입까지 살아남는다
  // (크게 보기 → 닫기 → 재진입 시 전체화면으로 열리던 버그).
  useEffect(() => {
    if (isOpen) return;
    setIsFullscreen(false);
    setIsPreQuestionPanelOpen(false);
    setIsSidePanelOpen(false);
    setFeedbackContent('');
  }, [isOpen]);

  const { mutate: updateMenteeStatus, isPending: isSavingAttendance } =
    useUpdateFeedbackByMentorMutation();
  const { mutateAsync: updateMeetingUrl } =
    useUpdateFeedbackMeetingUrlMutation();
  const { mutate: saveWrittenFeedback, isPending: isSavingFeedback } =
    usePatchAttendanceMentorMutation();

  // 날짜 → 시간 순 정렬 (MenteeList의 날짜 구분선·시간대 표시와 일치)
  const reservationBars = useMemo(() => {
    return liveFeedbackBars
      .filter((item) => item.liveFeedback)
      .slice()
      .sort((a, b) => {
        const aKey = `${a.startDate}T${a.liveFeedback!.startTime}`;
        const bKey = `${b.startDate}T${b.liveFeedback!.startTime}`;
        return aKey.localeCompare(bKey);
      });
  }, [liveFeedbackBars]);

  const selectedBar = bar?.liveFeedback ? bar : (reservationBars[0] ?? null);
  const feedbackId = selectedBar?.liveFeedback?.id ?? null;

  // BE 멘토 단건 상세 — 모달이 열려있을 때만 fetch.
  // 모달은 항상 mount 되어 있기 때문에 isOpen 게이트가 없으면 페이지 로드 시점에
  // mock 바의 가짜 ID(예: 101)로 prod API를 때려 404가 발생한다.
  const { data: feedbackDetail } = useFeedbackMentorDetailQuery(
    isOpen ? feedbackId : null,
  );

  // 카운트다운 — BE startDate/endDate 우선, 없으면 mock(bar.startDate + HH:mm) 사용
  const startIso =
    feedbackDetail?.startDate ??
    (selectedBar?.liveFeedback
      ? `${selectedBar.startDate}T${selectedBar.liveFeedback.startTime}:00`
      : null);
  const endIso =
    feedbackDetail?.endDate ??
    (selectedBar?.liveFeedback
      ? `${selectedBar.startDate}T${selectedBar.liveFeedback.endTime}:00`
      : null);

  const countdown = useFeedbackCountdown(startIso, endIso);

  // 라이브 입장 게이트 — 시작 20분 전(LIVE_ENTER_LEAD_MS)부터 종료 전까지만 활성.
  // 종료 후('after')·20분 전 이전·회의실 준비 중에는 비활성.
  const canEnterLive =
    feedbackId != null &&
    !isPreparingRoom &&
    (countdown.status === 'during' ||
      (countdown.status === 'before' &&
        countdown.remainingMs <= LIVE_ENTER_LEAD_MS));

  // 회의실 URL — BE 가 합성한 `meetingUrl`(= jitsi base + 랜덤 meetingRoom)을 그대로 사용.
  // 멘토/멘티/어드민이 동일 feedbackId 의 동일 meetingUrl 을 받아 같은 방으로 수렴하며,
  // 방 이름이 서버 생성 랜덤값이라 외부에서 추측·접속할 수 없다.
  // 멘토가 입장(meeting-url PATCH) 하기 전이면 null → 멘토가 입장 시 생성한다.
  const meetingUrl = feedbackDetail?.meetingUrl ?? null;

  /**
   * "라이브 입장하기" 핸들러 — 멘토·멘티 공통 로직(`ensureLiveMeetingUrl`)을 사용.
   *
   * 데드락 방지: meetingUrl 이 없어도(아직 회의실 미생성) 입장 가능. 누르는 순간
   * 헬스체크 후 healthy base 를 `PATCH /feedback/{id}/meeting-url` 로 보내 회의실을
   * 생성한다(BE 가 base + meetingRoom 합성 → invalidate 후 채워짐). 이미 meetingUrl
   * 이 있으면(상대가 먼저 입장해 등록함) 바로 Jitsi 모달을 연다.
   */
  const handleEnterLive = async () => {
    if (feedbackId == null || isPreparingRoom) return;

    setIsPreparingRoom(true);
    try {
      const result = await ensureLiveMeetingUrl({
        meetingUrl,
        baseCandidates: [
          import.meta.env.VITE_JITSI_BASE_URL,
          import.meta.env.VITE_JITSI_FALLBACK_URL,
        ],
        // BE 가 base + meetingRoom 을 합성하므로 FE 는 base URL 만 보낸다.
        registerBaseUrl: async (base) => {
          await updateMeetingUrl({ feedbackId, meetingUrl: base });
        },
      });
      if (!result.ok) {
        // 살아있는 도메인이 없으면 입장 불가 — 사용자에게 알림 후 종료.
        // TODO: 운영 전 MentorAlertModal 등 토스트 인프라로 교체.
        showAlert({
          title: '회의실에 연결할 수 없습니다',
          description: '잠시 후 다시 시도해 주세요.',
          variant: 'error',
        });
        return;
      }
      // 멘토 입장 = 출석(Bug 4). 아직 PRESENT 가 아닐 때만 mentorStatus=PRESENT 로 자동 기록.
      // 실패해도 입장은 계속 진행한다(콘솔 경고만 — 출석은 부수적 기록).
      if (feedbackDetail?.mentorStatus !== 'PRESENT') {
        updateMenteeStatus(
          { feedbackId, mentorStatus: 'PRESENT' },
          {
            onError: (err) =>
              console.warn('멘토 출석 자동 기록 실패(입장은 계속 진행):', err),
          },
        );
      }
      // invalidate 로 feedbackDetail.meetingUrl 이 곧 채워지지만, 즉시 입장 경험을 위해
      // 모달을 바로 연다(JitsiEmbedModal 이 갱신된 URL 수신).
      setIsJitsiOpen(true);
    } catch (error) {
      // 헬스체크/등록 중 네트워크·서버 오류 — 미처리 시 unhandled rejection.
      console.error('라이브 입장 준비 중 오류:', error);
      showAlert({
        title: '회의실 연결을 준비하지 못했습니다',
        description: '잠시 후 다시 시도해 주세요.',
        variant: 'error',
      });
    } finally {
      setIsPreparingRoom(false);
    }
  };

  if (!bar || !selectedBar) return null;

  const currentIndex = reservationBars.findIndex(
    (item) => item.missionId === selectedBar.missionId,
  );
  const hasPrevMentee = currentIndex > 0;
  const hasNextMentee =
    currentIndex !== -1 && currentIndex < reservationBars.length - 1;

  const handlePrevMentee = () => {
    if (!hasPrevMentee) return;
    onSelectBar(reservationBars[currentIndex - 1]);
  };

  const handleNextMentee = () => {
    if (!hasNextMentee) return;
    onSelectBar(reservationBars[currentIndex + 1]);
  };

  // 사이드바 멘티 리스트 — schedule 바(liveFeedback)에서 직접 파생.
  // 단건 상세 API는 선택된 1건만 내려주므로 리스트 명/상태는 바 데이터를 사용한다.
  const menteeListItems = reservationBars.map((item) => {
    const liveStatus = item.liveFeedback?.status;
    const feedbackStatus: FeedbackStatus =
      liveStatus === 'completed' ? 'COMPLETED' : 'WAITING';

    return {
      id: item.liveFeedback?.id ?? item.missionId,
      name: item.liveFeedback?.menteeName ?? '익명',
      feedbackStatus,
      status: null,
      date: item.startDate,
      startTime: item.liveFeedback?.startTime,
      endTime: item.liveFeedback?.endTime,
      liveStatus,
    };
  });

  // 상단 카운트 — 캘린더와 동일한 5상태(진행 예정/중/완료/미진행/취소)로 집계.
  const statusCounts = menteeListItems.reduce(
    (acc, item) => {
      acc[badgeStatusToUi(item.liveStatus)] += 1;
      return acc;
    },
    { waiting: 0, inProgress: 0, completed: 0, missed: 0, cancelled: 0 },
  );
  const waitingCount = statusCounts.waiting;
  const inProgressCount = statusCounts.inProgress;
  const completedCount = statusCounts.completed;
  const missedCount = statusCounts.missed;
  const cancelledCount = statusCounts.cancelled;

  // 하단 "피드백 상태" 배지 — 왼쪽 리스트/캘린더와 동일 소스(선택 바의 상태)로 통일.
  const liveBadge = getLiveFeedbackBadgeVisual(
    badgeStatusToUi(selectedBar?.liveFeedback?.status),
  );

  // 제출 상태 라벨 — BE attendanceStatus(서면 제출) 기준. ABSENT → '미제출', 그 외 '제출'.
  const submissionStatusLabel: '제출됨' | '미제출' =
    feedbackDetail?.attendanceStatus === 'ABSENT' ? '미제출' : '제출됨';

  // 멘티 라이브 출석(menteeStatus) — 읽기 표시만.
  // 마킹 버튼(PRESENT/ABSENT 쓰기 UI)은 디자인 미확정으로 보류.
  // 확정 시 useUpdateFeedbackByMentorMutation({ feedbackId, menteeStatus })로 PATCH 연결.
  const menteeAttendanceLabel: string = (() => {
    switch (feedbackDetail?.menteeStatus) {
      case 'PRESENT':
        return '참여';
      case 'ABSENT':
        return '불참';
      default:
        return '확인 전';
    }
  })();

  const selectedMentee = {
    id: feedbackDetail?.feedbackId ?? selectedBar.liveFeedback?.id ?? null,
    name:
      feedbackDetail?.menteeName ?? selectedBar.liveFeedback?.menteeName ?? '',
    challengeTitle: feedbackDetail?.programTitle ?? selectedBar.challengeTitle,
    submissionStatusLabel,
    attendanceUrl: feedbackDetail?.attendanceUrl ?? '',
    mentorRole: feedbackDetail?.menteeWishField ?? EMPTY_PLACEHOLDER,
    mentorIndustry: feedbackDetail?.menteeWishIndustry ?? EMPTY_PLACEHOLDER,
    mentorCompany: feedbackDetail?.menteeWishCompany ?? EMPTY_PLACEHOLDER,
    menteeAttendanceLabel,
  };

  // 노션 제출물만 왼쪽 패널 임베드 가능(서면 피드백과 동일 기준).
  const hasEmbeddableSubmission =
    !!selectedMentee.attendanceUrl && isNotionUrl(selectedMentee.attendanceUrl);
  const showLinkPanel = isSidePanelOpen && hasEmbeddableSubmission;

  // ── 사전 Q&A 패널 (오른쪽) ────────────────────────────────────────────────
  const preQuestionText = feedbackDetail?.preQuestion ?? '';
  const hasPreQuestion = preQuestionText.trim().length > 0;
  const showPreQuestionPanel = isPreQuestionPanelOpen && hasPreQuestion;

  // ── 라이브 중 서면 피드백 작성 (LC-3181) ──────────────────────────────────
  // 저장 계약은 서면 피드백과 동일: PATCH /attendance/{attendanceId}/mentor
  const attendanceId = feedbackDetail?.attendanceId ?? null;
  const savedFeedbackStatus = feedbackDetail?.feedbackStatus ?? null;
  const isFeedbackSubmitted =
    savedFeedbackStatus === 'COMPLETED' || savedFeedbackStatus === 'CONFIRMED';
  // attendanceId 가 없으면(BE 미배포) 저장할 키가 없으므로 읽기 전용으로 잠근다.
  const canEditWrittenFeedback = attendanceId != null && !isFeedbackSubmitted;
  const writtenFeedbackHint =
    attendanceId == null
      ? '작성 기능 준비 중입니다'
      : isFeedbackSubmitted
        ? '제출 완료되어 수정할 수 없습니다'
        : null;
  // 멘티를 바꾸면 에디터를 새로 마운트해 이전 본문이 남지 않게 한다.
  const editorKey = `live-feedback-${feedbackId ?? 'none'}`;
  const initialFeedbackContent = feedbackDetail?.feedback ?? undefined;

  // 미리보기 카드에 붙일 상태 문구.
  const writtenFeedbackStatusLabel = isFeedbackSubmitted
    ? '제출 완료'
    : savedFeedbackStatus === 'IN_PROGRESS'
      ? '임시저장됨'
      : null;

  /** 미리보기 카드 클릭 → 작성 화면(전체화면)으로 전환. */
  const openComposer = () => setIsFullscreen(true);

  /**
   * 실제로 보낼 본문.
   * 기본 상태에서는 에디터가 마운트되지 않아 `feedbackContent` 가 '' 다.
   * 그대로 보내면 저장돼 있던 피드백을 지워버리므로 저장본으로 폴백한다.
   * (에디터에서 내용을 비우면 빈 Lexical JSON 문자열이라 '' 가 아니다 → 의도한 삭제는 그대로 전달된다.)
   */
  const effectiveFeedbackContent =
    feedbackContent || initialFeedbackContent || '';

  const handleSaveWrittenFeedback = () => {
    if (attendanceId == null) return;
    saveWrittenFeedback(
      {
        attendanceId,
        feedback: effectiveFeedbackContent,
        feedbackStatus: 'IN_PROGRESS',
      },
      {
        onSuccess: () =>
          showAlert({ title: '임시저장했습니다.', variant: 'success' }),
        onError: () =>
          showAlert({ title: '임시저장에 실패했습니다.', variant: 'error' }),
      },
    );
  };

  const handleSubmitWrittenFeedback = () => {
    if (attendanceId == null) return;
    showConfirm({
      title: '피드백을 최종 제출하시겠습니까?',
      description: '제출 후에는 수정할 수 없습니다.',
      onConfirm: () =>
        saveWrittenFeedback(
          {
            attendanceId,
            feedback: effectiveFeedbackContent,
            feedbackStatus: 'COMPLETED',
          },
          {
            onSuccess: () =>
              showAlert({
                title: '피드백을 제출했습니다.',
                variant: 'success',
              }),
            onError: () =>
              showAlert({ title: '제출에 실패했습니다.', variant: 'error' }),
          },
        ),
    });
  };

  const reservationDateLine = formatReservationDateLine(
    selectedBar.startDate,
    selectedBar.liveFeedback?.startTime,
    selectedBar.liveFeedback?.endTime,
  );

  // 구글 캘린더 "일정 추가" 프리필 링크 — 멘토가 예약 세션을 자기 캘린더에 담도록.
  // 회의 링크는 웹 라이브 피드백 입장 URL(/live-feedback/mentor/{feedbackId})을 사용.
  const round = roundTh ?? selectedBar.th;
  const liveEntryUrl =
    feedbackId != null
      ? `${import.meta.env.VITE_WEB_URL ?? ''}/live-feedback/mentor/${feedbackId}`
      : null;
  const googleCalendarUrl =
    startIso && endIso
      ? createGoogleCalendarUrl({
          // 캘린더 칩에서 잘려도 "누구와의 일정"인지 남도록 멘티 이름을 앞쪽에 둔다.
          title: `[렛츠커리어] ${selectedMentee.name} 멘티 라이브 피드백 · ${selectedMentee.challengeTitle} ${round}차`,
          startAt: startIso,
          endAt: endIso,
          // 위치(location)는 지도 핀으로 렌더돼 지저분하므로 쓰지 않고,
          // 설명(details)에 입장 링크만 한 줄로 넣는다(구글이 자동 하이퍼링크 처리).
          details: liveEntryUrl
            ? `라이브 피드백 입장 링크\n${liveEntryUrl}`
            : undefined,
        })
      : null;

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        className={twMerge(
          feedbackModalDesign.modalContainer,
          // 패널이 실제로 열렸을 때만 모달을 넓혀 패널+에디터를 함께 표시
          (showLinkPanel || showPreQuestionPanel) &&
            feedbackModalDesign.modalContainerWide,
          showLinkPanel &&
            showPreQuestionPanel &&
            feedbackModalDesign.modalContainerWidest,
          // 전체화면은 위 폭 지정을 모두 덮어야 하므로 마지막에 합성한다.
          isFullscreen && feedbackModalDesign.modalContainerFullscreen,
        )}
      >
        <FeedbackHeader
          challengeTitle={selectedMentee.challengeTitle}
          missionTh={roundTh ?? selectedBar.th}
          totalCount={reservationBars.length}
          waitingCount={waitingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          missedCount={missedCount}
          cancelledCount={cancelledCount}
          isLive
          // 작성(전체화면) 중에는 닫기가 모달 종료가 아니라 기본 화면 복귀다.
          // 글을 쓰다 실수로 눌러 세션 화면을 통째로 잃는 것을 막는다.
          onClose={isFullscreen ? () => setIsFullscreen(false) : onClose}
        />

        <FeedbackLayout
          isExpanded={isFullscreen}
          onExpandedChange={setIsFullscreen}
          sidebar={
            <div className="flex h-full flex-col gap-3">
              <div className="min-h-0 flex-1">
                <MenteeList
                  attendanceList={menteeListItems}
                  selectedIndex={Math.max(currentIndex, 0)}
                  onSelectByIndex={(index) => {
                    const target = reservationBars[index];
                    if (target) onSelectBar(target);
                  }}
                />
              </div>
              <SidebarGuideLinks labels={GUIDE_LINK_LABELS} />
            </div>
          }
          sidePanel={
            showLinkPanel ? (
              <MenteeLinkPanel
                onClose={() => setIsSidePanelOpen(false)}
                link={selectedMentee.attendanceUrl}
                menteeName={selectedMentee.name}
              />
            ) : undefined
          }
          rightPanel={
            showPreQuestionPanel ? (
              <MenteePreQuestionPanel
                onClose={() => setIsPreQuestionPanelOpen(false)}
                preQuestion={preQuestionText}
                menteeName={selectedMentee.name}
                title="사전 Q&A"
              />
            ) : undefined
          }
          navigation={
            <FeedbackMenteeNavigation
              onPrev={handlePrevMentee}
              onNext={handleNextMentee}
              hasPrev={hasPrevMentee}
              hasNext={hasNextMentee}
            />
          }
          navigationCompact={
            <FeedbackMenteeNavigation
              compact
              onPrev={handlePrevMentee}
              onNext={handleNextMentee}
              hasPrev={hasPrevMentee}
              hasNext={hasNextMentee}
            />
          }
          menteeInfo={(collapsed) =>
            // 확장(피드백 작성) 시에만 노출 — 서면 피드백 모달과 같은 공통 컴팩트 행.
            // 기본 상태의 정보는 아래 editor 슬롯의 전체 카드가 담당한다.
            collapsed ? (
              <MenteeInfoCompactRow
                name={selectedMentee.name}
                wishJob={selectedMentee.mentorRole}
                wishCompany={selectedMentee.mentorCompany}
                badge={liveBadge}
                actions={
                  <>
                    {selectedMentee.attendanceUrl && (
                      <span className="flex shrink-0 items-center gap-1">
                        <PanelEntryButton
                          compact
                          href={selectedMentee.attendanceUrl}
                        >
                          제출물 보기
                        </PanelEntryButton>
                        {hasEmbeddableSubmission && (
                          <SideViewButton
                            onClick={() => setIsSidePanelOpen((prev) => !prev)}
                            size={14}
                            className="h-[30px] w-[30px]"
                          />
                        )}
                      </span>
                    )}
                    {hasPreQuestion && (
                      <PanelEntryButton
                        compact
                        icon="right-panel"
                        onClick={() =>
                          setIsPreQuestionPanelOpen((prev) => !prev)
                        }
                      >
                        사전 Q&A 보기
                      </PanelEntryButton>
                    )}
                  </>
                }
              />
            ) : null
          }
          editor={
            <div className="flex h-full flex-col gap-3">
              {/* 멘티 정보 카드 — 작성(확장) 중에는 상단 컴팩트 행이 대신한다.
                  높이는 콘텐츠에 맞춘다(shrink-0). flex-1 이면 남는 세로를 전부 먹어
                  아래가 텅 빈 상자로 보인다 — 사전 Q&A 를 패널로 옮기며 내용이 줄었다. */}
              {!isFullscreen && (
                <section
                  className={twMerge(
                    feedbackModalDesign.cardSurface,
                    'shrink-0',
                  )}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-stretch md:gap-7">
                    <div className="flex flex-1 flex-col gap-6">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className="text-lg font-semibold text-neutral-900 md:text-2xl">
                          {selectedMentee.name}
                        </h3>
                        <span className="text-xs font-medium text-neutral-500">
                          {selectedMentee.challengeTitle}
                        </span>
                      </div>

                      {/* 2열 상태 영역 — 좌: 제출 상태 / 우: 피드백 참여 */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* 좌: 제출 상태 */}
                        <div className="flex flex-col gap-2">
                          <span className="text-xs text-neutral-500">
                            제출 상태
                          </span>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span
                              className={twMerge(
                                feedbackModalDesign.dotBase,
                                selectedMentee.submissionStatusLabel ===
                                  '제출됨'
                                  ? feedbackModalDesign.dotOk
                                  : feedbackModalDesign.dotNone,
                              )}
                            />
                            <span className="font-medium text-neutral-700">
                              {selectedMentee.submissionStatusLabel}
                            </span>
                          </div>
                          {selectedMentee.attendanceUrl ? (
                            <span className="flex w-fit items-center gap-1.5">
                              <PanelEntryButton
                                href={selectedMentee.attendanceUrl}
                              >
                                제출물 보기
                              </PanelEntryButton>
                              {/* 노션 제출물을 왼쪽 패널로 띄워 보면서 진행(한번 더 클릭하면 닫힘) */}
                              {hasEmbeddableSubmission && (
                                <SideViewButton
                                  onClick={() =>
                                    setIsSidePanelOpen((prev) => !prev)
                                  }
                                  className="h-[38px] w-[38px]"
                                />
                              )}
                            </span>
                          ) : (
                            <PanelEntryButton disabled>
                              제출물 보기
                            </PanelEntryButton>
                          )}
                        </div>

                        {/* 우: 피드백 참여 */}
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <span>피드백 참여</span>
                            <InfoTooltip
                              label="피드백 참여 안내"
                              text={PARTICIPATION_TOOLTIP_TEXT}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span
                              className={twMerge(
                                feedbackModalDesign.dotBase,
                                selectedMentee.menteeAttendanceLabel === '참여'
                                  ? feedbackModalDesign.dotOk
                                  : selectedMentee.menteeAttendanceLabel ===
                                      '불참'
                                    ? feedbackModalDesign.dotAbsent
                                    : feedbackModalDesign.dotPending,
                              )}
                            />
                            <span className="font-medium text-neutral-700">
                              {selectedMentee.menteeAttendanceLabel}
                            </span>
                          </div>
                          {/* 멘티 참여 상태 확인 모달 진입 — 라이브 피드백 종료 후에만 활성화.
                          (저장도 모달 내부 게이트로 종료 후에만 가능) */}
                          {feedbackId != null && (
                            <button
                              type="button"
                              disabled={countdown.status !== 'after'}
                              onClick={() => setIsAttendanceOpen(true)}
                              className={
                                countdown.status === 'after'
                                  ? feedbackModalDesign.outlineButton
                                  : feedbackModalDesign.outlineButtonDisabled
                              }
                            >
                              <CheckCircleIcon />
                              참여 확인하기
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 세로 구분선 — 제출/참여 ↔ 희망 정보 */}
                    <div className={feedbackModalDesign.dividerVertical} />

                    <div className="flex flex-1 flex-col gap-3">
                      <div className="text-xsmall14 grid gap-2 text-neutral-600">
                        <div className="flex gap-2">
                          <span className="w-16 shrink-0 text-neutral-400">
                            희망 직군
                          </span>
                          <span>{selectedMentee.mentorRole}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-16 shrink-0 text-neutral-400">
                            희망 산업
                          </span>
                          <span>{selectedMentee.mentorIndustry}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-16 shrink-0 text-neutral-400">
                            희망 기업
                          </span>
                          <span>{selectedMentee.mentorCompany}</span>
                        </div>
                      </div>

                      {/* 사전 Q&A 진입 — 좌측 열의 "제출물 보기"와 같은 줄에 하단 정렬 */}
                      {hasPreQuestion && (
                        <PanelEntryButton
                          icon="right-panel"
                          onClick={() =>
                            setIsPreQuestionPanelOpen((prev) => !prev)
                          }
                          className="mt-auto"
                        >
                          사전 Q&A 보기
                        </PanelEntryButton>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* 피드백 작성 — "피드백 작성"(확장) 상태에서만 편다. 기본 상태는 예약 정보·
                  액션 패널이 세로를 이미 점유해 에디터가 80px 까지 눌린다. 쓸 수 없는 크기로
                  보여주느니 접어두고, 확장 시 전체화면에서 편다.
                  이때 멘티 정보는 상단 컴팩트 행(menteeInfo)이 대신한다 — 서면과 동일. */}
              {isFullscreen && (
                <FeedbackComposer
                  editorKey={editorKey}
                  initialEditorStateJsonString={initialFeedbackContent}
                  onChange={setFeedbackContent}
                  isReadOnly={!canEditWrittenFeedback}
                  hint={writtenFeedbackHint}
                />
              )}

              {/* 작성한 피드백 미리보기 — 기본 상태에서 남는 세로를 채운다.
                  누르면 그대로 작성 화면(전체화면)으로 넘어간다. */}
              {!isFullscreen && (
                <FeedbackPreviewCard
                  content={feedbackDetail?.feedback}
                  statusLabel={writtenFeedbackStatusLabel}
                  onOpen={() => openComposer()}
                />
              )}

              {/* 액션 패널 — 예약 일시 / 피드백 상태 (하단, 버튼 바로 위).
                  작성(확장) 중에는 에디터에 세로를 넘겨주기 위해 접는다. */}
              <section
                aria-label="라이브 피드백 액션 패널"
                hidden={isFullscreen}
                className={twMerge(feedbackModalDesign.cardSurface, 'shrink-0')}
              >
                <ul className="flex flex-col gap-3 text-sm">
                  {/* 예약 일시 + 카운트다운 */}
                  <li className="flex items-center gap-3">
                    <span className="flex w-20 shrink-0 items-center gap-1 text-xs font-medium text-neutral-400">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        aria-hidden
                      >
                        <circle
                          cx="8"
                          cy="8"
                          r="6.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />
                        <path
                          d="M8 4.5V8L10.2 9.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      예약 일시
                    </span>
                    <span className="text-neutral-800">
                      {reservationDateLine}
                    </span>
                    {countdown.status === 'after' ? (
                      <span className="text-xs font-medium text-neutral-400">
                        종료
                      </span>
                    ) : (
                      countdown.label && (
                        <span className="text-primary text-xs font-medium">
                          {countdown.label}
                        </span>
                      )
                    )}
                  </li>

                  {/* 피드백 상태 */}
                  <li className="flex items-center gap-3">
                    <span className="flex w-20 shrink-0 items-center gap-1 text-xs font-medium text-neutral-400">
                      <CheckCircleIcon />
                      피드백 상태
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${liveBadge.badgeClass}`}
                    >
                      {liveBadge.label}
                    </span>
                  </li>
                </ul>
              </section>
            </div>
          }
          // 기본 상태의 하단 좌측은 비워 둔다 — 작성 진입은 미리보기 카드 하나로 모은다.
          // 확장 상태에서만 되돌아가는 "작게 보기"를 노출한다.
          showExpandToggle={isFullscreen}
          actions={
            // 작성(확장) 중에는 서면 피드백 모달과 같이 저장·제출만 남긴다.
            // 기본 상태의 세션 진입 액션(캘린더·입장)과 섞이지 않게 서로 배타로 둔다.
            isFullscreen ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveWrittenFeedback}
                  disabled={!canEditWrittenFeedback || isSavingFeedback}
                  className={feedbackModalDesign.writtenSaveButton}
                >
                  임시저장
                </button>
                <button
                  type="button"
                  onClick={handleSubmitWrittenFeedback}
                  disabled={!canEditWrittenFeedback || isSavingFeedback}
                  className={feedbackModalDesign.writtenSubmitButton}
                >
                  피드백 제출
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* 구글 캘린더에 추가 — 예약 시각이 있으면 항상 노출(입장 게이트와 무관).
                  프리필 링크라 새 탭에서 열려 사용자가 저장을 눌러 등록한다. */}
                {googleCalendarUrl && (
                  <a
                    href={googleCalendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary bg-primary-10 hover:bg-primary-15 rounded-[4px] px-4 py-2 text-sm font-semibold transition-colors"
                  >
                    구글 캘린더에 추가
                  </a>
                )}
                {/* 라이브 입장하기 — 시작 20분 전(LIVE_ENTER_LEAD_MS)부터 종료 전까지 활성.
                  데드락 방지: meetingUrl 이 없어도(아직 회의실 미생성) 멘토는 입장 가능.
                  클릭 시 handleEnterLive 가 헬스체크 + meeting-url PATCH 로 회의실을 생성한다.
                  시작 20분 전 이전·종료 후·회의실 준비 중에는 비활성(canEnterLive). */}
                <button
                  type="button"
                  disabled={!canEnterLive}
                  onClick={handleEnterLive}
                  aria-label="라이브 입장하기"
                  className={
                    canEnterLive
                      ? feedbackModalDesign.footerPrimary
                      : feedbackModalDesign.footerPrimaryDisabled
                  }
                >
                  {isPreparingRoom ? '회의실 준비 중…' : '라이브 입장하기'}
                </button>
              </div>
            )
          }
        />
      </BaseModal>

      <MentorAlertModal {...alertProps} />

      {feedbackId != null && (
        <JitsiEmbedModal
          isOpen={isJitsiOpen}
          // 회의실을 닫아도 출석 확인 모달을 자동으로 띄우지 않는다.
          // 출석 저장은 모달 내 멘티 출석 체크 버튼 또는 "참여 확인하기" 진입으로만 한다.
          onClose={() => setIsJitsiOpen(false)}
          meetingUrl={meetingUrl}
          spaceName={selectedBar?.challengeTitle}
          // 입장 후 현재 서버가 죽어있으면(external_api.js 로드 실패) 다음 후보로 자동
          // 재등록(failover). BE 는 base + meetingRoom 을 덮어써 합성한다.
          baseCandidates={[
            import.meta.env.VITE_JITSI_BASE_URL,
            import.meta.env.VITE_JITSI_FALLBACK_URL,
          ]}
          registerBaseUrl={async (base) => {
            await updateMeetingUrl({ feedbackId, meetingUrl: base });
          }}
          onExhausted={() =>
            showAlert({
              title: '회의실에 연결할 수 없습니다',
              description: '잠시 후 다시 시도해 주세요.',
              variant: 'error',
            })
          }
          // 좌측 자료 패널 — 사전 Q&A(없으면 숨김) · 제출물.
          // placeholder('-')/빈 문자열은 패널 빈 상태 판정을 위해 undefined 로 전달.
          preQuestion={feedbackDetail?.preQuestion ?? undefined}
          submissionUrl={selectedMentee.attendanceUrl || undefined}
          menteeName={selectedMentee.name || '멘티'}
          startDate={startIso ?? undefined}
          endDate={endIso ?? undefined}
          isMentor
          menteeStatus={feedbackDetail?.menteeStatus}
          onSaveAttendance={(menteeStatus) =>
            updateMenteeStatus({ feedbackId, menteeStatus })
          }
          isSavingAttendance={isSavingAttendance}
          // 세션을 보면서 서면 피드백을 바로 작성·전송 (LC-3181).
          // 본문 state 를 공유하므로 회의실을 닫아도 쓰던 초안이 그대로 남는다.
          onFeedbackChange={setFeedbackContent}
          initialFeedbackContent={initialFeedbackContent}
          feedbackEditorKey={editorKey}
          canEditFeedback={canEditWrittenFeedback}
          feedbackHint={writtenFeedbackHint}
          onSaveFeedback={handleSaveWrittenFeedback}
          onSubmitFeedback={handleSubmitWrittenFeedback}
          isSavingFeedback={isSavingFeedback}
        />
      )}

      {feedbackId != null && endIso && (
        <MenteeAttendanceCheckModal
          isOpen={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
          menteeName={selectedMentee.name || '멘티'}
          endDate={endIso}
          currentStatus={feedbackDetail?.menteeStatus ?? null}
          isSaving={isSavingAttendance}
          onSave={(menteeStatus) =>
            updateMenteeStatus(
              { feedbackId, menteeStatus },
              { onSuccess: () => setIsAttendanceOpen(false) },
            )
          }
        />
      )}
    </>
  );
};

export default LiveFeedbackReservationModal;
