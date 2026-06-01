import { lazy, Suspense, useMemo, useState } from 'react';

import type { ChatRoomListItem } from '@letscareer/chat/ui/ChatModal';

import {
  useFeedbackMentorDetailQuery,
  useFeedbackMentorListQuery,
  useUpdateFeedbackByMentorMutation,
  useUpdateFeedbackMeetingUrlMutation,
} from '@/api/feedback/feedback';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import BaseModal from '@/common/modal/BaseModal';
import { mentorConfig } from '@/constants/config';
import { useFeedbackCountdown } from '@/pages/feedback/hooks/useFeedbackCountdown';
import FeedbackHeader from '@/pages/feedback/ui/FeedbackHeader';
import FeedbackLayout from '@/pages/feedback/ui/FeedbackLayout';
import FeedbackMenteeNavigation from '@/pages/feedback/ui/FeedbackMenteeNavigation';
import MenteeAttendanceCheckModal from '@/pages/feedback/ui/MenteeAttendanceCheckModal';
import MenteeList from '@/pages/feedback/ui/MenteeList';
import {
  getLiveFeedbackBadgeVisual,
  resolveLiveFeedbackStatus,
} from '@/pages/feedback/utils/liveFeedbackStatus';
import { resolveHealthyJitsiBaseUrl } from '@/pages/feedback/utils/jitsiHealthCheck';

import { currentNow } from '../constants/mockNow';
import type { PeriodBarData } from '../types';
import JitsiEmbedModal from './JitsiEmbedModal';

/** 피드백 가이드 버튼 — 정적 메타(BE 비제공). 모달 외부로 hoist. */
const GUIDEBOOK_BUTTONS: ReadonlyArray<{ label: string }> = [
  { label: '자소서첨삭 피드백 가이드' },
  { label: '라이브 멘토링 피드백 가이드' },
];

/** 빈 값 대체용 placeholder */
const EMPTY_PLACEHOLDER = '-';

/** 멘티 채팅 모달 — 열릴 때만 로드 (동적 import). */
const ChatModal = lazy(() => import('@letscareer/chat/ui/ChatModal'));

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
  return `${y}.${m}.${d} (${dow}) ${startTime}~${endTime}`;
}

const LiveFeedbackReservationModal = ({
  isOpen,
  onClose,
  bar,
  liveFeedbackBars,
  onSelectBar,
  roundTh,
}: LiveFeedbackReservationModalProps) => {
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  // 멘토 입장 시 회의실 URL 준비(헬스체크 + PATCH) 진행 상태
  const [isPreparingRoom, setIsPreparingRoom] = useState(false);

  const { mutate: updateMenteeStatus, isPending: isSavingAttendance } =
    useUpdateFeedbackByMentorMutation();
  const { mutateAsync: updateMeetingUrl } =
    useUpdateFeedbackMeetingUrlMutation();

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

  // 회의실 URL — BE 가 합성한 `meetingUrl`(= jitsi base + 랜덤 meetingRoom)을 그대로 사용.
  // 멘토/멘티/어드민이 동일 feedbackId 의 동일 meetingUrl 을 받아 같은 방으로 수렴하며,
  // 방 이름이 서버 생성 랜덤값이라 외부에서 추측·접속할 수 없다.
  // 멘토가 입장(meeting-url PATCH) 하기 전이면 null → 멘토가 입장 시 생성한다.
  const meetingUrl = feedbackDetail?.meetingUrl ?? null;

  /**
   * 멘토 "라이브 입장하기" 핸들러.
   *
   * 데드락 방지: meetingUrl 이 없어도 멘토는 입장 버튼을 누를 수 있고,
   * 누르는 순간 jitsi 도메인 헬스체크 후 healthy base URL 을
   * `PATCH /feedback/{id}/meeting-url` 로 보내 회의실을 생성한다.
   * (BE 가 base + meetingRoom 합성 → 다음 fetch 에서 meetingUrl 채워짐)
   * 이미 meetingUrl 이 있으면 바로 Jitsi 모달을 연다.
   */
  const handleEnterLive = async () => {
    if (feedbackId == null || isPreparingRoom) return;

    if (meetingUrl) {
      setIsJitsiOpen(true);
      return;
    }

    setIsPreparingRoom(true);
    try {
      const healthyBase = await resolveHealthyJitsiBaseUrl([
        import.meta.env.VITE_JITSI_BASE_URL,
        import.meta.env.VITE_JITSI_FALLBACK_URL,
      ]);
      if (!healthyBase) {
        // 살아있는 도메인이 없으면 입장 불가 — 사용자에게 알림 후 종료.
        // TODO: 운영 전 MentorAlertModal 등 토스트 인프라로 교체.
        window.alert(
          '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        );
        return;
      }
      // BE 가 base + meetingRoom 을 합성하므로 FE 는 base URL 만 보낸다.
      await updateMeetingUrl({ feedbackId, meetingUrl: healthyBase });
      // 캐시 invalidate 로 feedbackDetail.meetingUrl 이 곧 채워지지만,
      // 즉시 입장 경험을 위해 모달을 바로 연다(JitsiEmbedModal 이 갱신된 URL 수신).
      setIsJitsiOpen(true);
    } finally {
      setIsPreparingRoom(false);
    }
  };

  // 채팅 방 — 선택된 멘티 세션 1건(feedbackId 단위). 멘티 이름/챌린지로 표시.
  // 채팅 모달은 멘토관리처럼 전체 멘티 로스터를 좌측 목록으로 보여준다.
  // (선택된 세션은 activeFeedbackId로 지정) — 방 단위는 feedbackId(세션).
  const { data: allFeedbacks } = useFeedbackMentorListQuery();
  const chatRooms: ChatRoomListItem[] = useMemo(() => {
    const seen = new Set<number>();
    const list: ChatRoomListItem[] = [];
    for (const fb of allFeedbacks ?? []) {
      if (seen.has(fb.feedbackId)) continue;
      seen.add(fb.feedbackId);
      list.push({
        feedbackId: fb.feedbackId,
        title: fb.menteeName,
        subtitle: fb.programTitle,
        meta: { menteeName: fb.menteeName, challengeTitle: fb.programTitle },
      });
    }
    // 로스터 미로딩 시 현재 선택 세션만으로 fallback (모달이 항상 열리도록).
    if (list.length === 0 && feedbackId != null) {
      const menteeName =
        feedbackDetail?.menteeName ??
        selectedBar?.liveFeedback?.menteeName ??
        '멘티';
      const challengeTitle =
        feedbackDetail?.programTitle ?? selectedBar?.challengeTitle ?? '';
      return [
        {
          feedbackId,
          title: menteeName,
          subtitle: challengeTitle,
          meta: { menteeName, challengeTitle },
        },
      ];
    }
    return list;
  }, [
    allFeedbacks,
    feedbackId,
    feedbackDetail?.menteeName,
    feedbackDetail?.programTitle,
    selectedBar?.liveFeedback?.menteeName,
    selectedBar?.challengeTitle,
  ]);

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

  // BE 회차 단위 멘티 집계 미구현 — 사이드바 mock 카운트로 임시 산출 (PRD §5.4 mentor3.3)
  const waitingCount = menteeListItems.filter(
    (item) => item.feedbackStatus === 'WAITING',
  ).length;
  const inProgressCount = 0;
  const completedCount = menteeListItems.filter(
    (item) => item.feedbackStatus === 'COMPLETED',
  ).length;
  const missedCount = 0;

  // 액션 패널 상태 결정
  const now = currentNow();
  const apiStatus = feedbackDetail?.status ?? 'RESERVED';
  const liveUiStatus =
    startIso && endIso
      ? resolveLiveFeedbackStatus(apiStatus, startIso, endIso, now)
      : 'waiting';
  const liveBadge = getLiveFeedbackBadgeVisual(liveUiStatus);

  // 제출 상태 라벨 — BE attendanceStatus(서면 제출) 기준. ABSENT → '미제출', 그 외 '제출'.
  const submissionStatusLabel: '제출' | '미제출' =
    feedbackDetail?.attendanceStatus === 'ABSENT' ? '미제출' : '제출';

  // 멘티 라이브 출석(menteeStatus) — 읽기 표시만.
  // 마킹 버튼(PRESENT/ABSENT 쓰기 UI)은 디자인 미확정으로 보류.
  // 확정 시 useUpdateFeedbackByMentorMutation({ feedbackId, menteeStatus })로 PATCH 연결.
  const menteeAttendanceLabel: string = (() => {
    switch (feedbackDetail?.menteeStatus) {
      case 'PRESENT':
        return '출석';
      case 'ABSENT':
        return '불참';
      case 'PENDING':
        return '대기';
      default:
        return EMPTY_PLACEHOLDER;
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
    questionAnswer: feedbackDetail?.preQuestion ?? EMPTY_PLACEHOLDER,
    menteeAttendanceLabel,
  };

  const reservationDateLine = formatReservationDateLine(
    selectedBar.startDate,
    selectedBar.liveFeedback?.startTime,
    selectedBar.liveFeedback?.endTime,
  );

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        className="mx-2 h-[85vh] w-[1200px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[680px] md:rounded-3xl"
      >
        <FeedbackHeader
          challengeTitle={selectedMentee.challengeTitle}
          missionTh={roundTh ?? selectedBar.th}
          totalCount={reservationBars.length}
          waitingCount={waitingCount}
          inProgressCount={inProgressCount}
          completedCount={completedCount}
          missedCount={missedCount}
          isLive
          onClose={onClose}
        />

        <FeedbackLayout
          sidebar={
            <MenteeList
              attendanceList={menteeListItems}
              selectedIndex={Math.max(currentIndex, 0)}
              onSelectByIndex={(index) => {
                const target = reservationBars[index];
                if (target) onSelectBar(target);
              }}
            />
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
          menteeInfo={() => (
            <section className="rounded-xl border border-gray-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-7">
                <div className="flex flex-1 flex-col gap-6">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900 md:text-2xl">
                      {selectedMentee.name}
                    </h3>
                    <span className="text-xs font-medium text-neutral-500">
                      {selectedMentee.challengeTitle}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>제출 상태</span>
                      <span className="font-medium text-neutral-700">
                        {selectedMentee.submissionStatusLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>라이브 출석</span>
                      <span className="font-medium text-neutral-700">
                        {selectedMentee.menteeAttendanceLabel}
                      </span>
                      {/* 멘티 참여 상태 확인 모달 진입 — 프로그램 일정에서의 진입점.
                          종료 후에만 저장 가능(모달 내부 게이트). */}
                      {feedbackId != null && (
                        <button
                          type="button"
                          onClick={() => setIsAttendanceOpen(true)}
                          className="text-primary hover:bg-primary-5 border-primary ml-1 rounded border px-2 py-0.5 text-xs font-medium transition-colors"
                        >
                          참여 상태 확인
                        </button>
                      )}
                    </div>
                    {selectedMentee.attendanceUrl ? (
                      <a
                        href={selectedMentee.attendanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                      >
                        제출물 보기
                      </a>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex w-fit items-center gap-1 rounded border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-300"
                      >
                        제출물 보기
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3">
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
                </div>
              </div>
            </section>
          )}
          editor={
            <div className="flex flex-col gap-3">
              <section className="rounded-xl border border-gray-200 p-4">
                <p className="text-xs font-medium text-neutral-400">
                  사전 Q&amp;A
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
                  {selectedMentee.questionAnswer}
                </p>
              </section>

              {/* 액션 패널 — 예약 일시 / 피드백 상태 */}
              <section
                aria-label="라이브 피드백 액션 패널"
                className="rounded-xl border border-gray-200 p-4"
              >
                <ul className="flex flex-col gap-3 text-sm">
                  {/* 예약 일시 + 카운트다운 */}
                  <li className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-medium text-neutral-400">
                      예약 일시
                    </span>
                    <span className="text-neutral-800">
                      {reservationDateLine}
                    </span>
                    {countdown.label && countdown.status !== 'after' && (
                      <span className="text-primary text-xs font-medium">
                        {countdown.status === 'during'
                          ? countdown.label
                          : countdown.label}
                      </span>
                    )}
                  </li>

                  {/* 피드백 상태 */}
                  <li className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-medium text-neutral-400">
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
          leftActions={
            <div className="flex items-center gap-2.5">
              {GUIDEBOOK_BUTTONS.map((button) => (
                <a
                  key={button.label}
                  href={mentorConfig.feedbackGuidelineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-800"
                >
                  <span>{button.label}</span>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M6 3.5H3.5V12.5H12.5V10M9.5 3.5H12.5V6.5M12.5 3.5L7 9"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          }
          actions={
            <div className="flex items-center gap-3">
              {/* 멘티와 대화하기 — @letscareer/chat 모달(role=mentor) 연결 */}
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                disabled={feedbackId == null}
                aria-label="멘티와 대화하기"
                className={
                  feedbackId != null
                    ? 'rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50'
                    : 'rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-300'
                }
              >
                멘티와 대화하기
              </button>

              {/* 라이브 입장하기
                  데드락 방지: meetingUrl 이 없어도(아직 회의실 미생성) 멘토는 입장 가능.
                  클릭 시 handleEnterLive 가 헬스체크 + meeting-url PATCH 로 회의실을 생성한다.
                  버튼은 feedbackId 부재 또는 회의실 준비 중일 때만 비활성.
                  TODO(임시): 정식 운영 시 T-10 시간 게이팅 복원
                    → resolveLiveFeedbackAccess(meetingUrl, start, end, now) 로
                      'ended'(종료) 등 시간 조건을 disabled 에 추가. */}
              <button
                type="button"
                disabled={feedbackId == null || isPreparingRoom}
                onClick={handleEnterLive}
                aria-label="라이브 입장하기"
                className={
                  feedbackId != null && !isPreparingRoom
                    ? 'bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors'
                    : 'rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-white'
                }
              >
                {isPreparingRoom ? '회의실 준비 중…' : '라이브 입장하기'}
              </button>
            </div>
          }
          showExpandToggle={false}
        />
      </BaseModal>

      {feedbackId != null && (
        <JitsiEmbedModal
          isOpen={isJitsiOpen}
          onClose={() => {
            // 멘토가 Jitsi 회의실을 닫으면 멘티 참여 상태 확인 모달을 자동으로 띄운다.
            setIsJitsiOpen(false);
            setIsAttendanceOpen(true);
          }}
          meetingUrl={meetingUrl}
          spaceName={selectedBar?.challengeTitle}
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

      {isChatOpen && chatRooms.length > 0 && (
        <Suspense fallback={null}>
          <ChatModal
            role="mentor"
            rooms={chatRooms}
            activeFeedbackId={feedbackId}
            onClose={() => setIsChatOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};

export default LiveFeedbackReservationModal;
