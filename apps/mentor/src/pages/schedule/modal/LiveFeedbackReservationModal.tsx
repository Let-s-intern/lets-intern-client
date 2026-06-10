import { useMemo, useState } from 'react';

import { ensureLiveMeetingUrl } from '@letscareer/ui/JitsiEmbed/jitsiHealthCheck';

import {
  useFeedbackMentorDetailQuery,
  useUpdateFeedbackByMentorMutation,
  useUpdateFeedbackMeetingUrlMutation,
} from '@/api/feedback/feedback';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import BaseModal from '@/common/modal/BaseModal';
import { twMerge } from '@/lib/twMerge';
import { feedbackModalDesign } from '@/pages/feedback/feedbackModalDesign';
import { useFeedbackCountdown } from '@/pages/feedback/hooks/useFeedbackCountdown';
import FeedbackHeader from '@/pages/feedback/ui/FeedbackHeader';
import FeedbackLayout from '@/pages/feedback/ui/FeedbackLayout';
import FeedbackMenteeNavigation from '@/pages/feedback/ui/FeedbackMenteeNavigation';
import InfoTooltip from '@/pages/feedback/ui/InfoTooltip';
import MenteeAttendanceCheckModal from '@/pages/feedback/ui/MenteeAttendanceCheckModal';
import MenteeLinkPanel from '@/pages/feedback/ui/MenteeLinkPanel';
import MenteeList from '@/pages/feedback/ui/MenteeList';
import SidebarGuideLinks from '@/pages/feedback/ui/SidebarGuideLinks';
import SideViewButton from '@/pages/feedback/ui/SideViewButton';
import {
  getLiveFeedbackBadgeVisual,
  resolveLiveSessionStatus,
} from '@/pages/feedback/utils/liveFeedbackStatus';
import { isNotionUrl } from '@/pages/feedback/utils/notion';

import { currentNow } from '../constants/mockNow';
import type { PeriodBarData } from '../types';
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

/** 외부 링크(체인) 아이콘 — 제출물 보기 버튼용. */
const LinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M6.5 9.5L9.5 6.5M7 4.5l.8-.8a2.3 2.3 0 113.3 3.3l-.8.8M9 11.5l-.8.8a2.3 2.3 0 11-3.3-3.3l.8-.8"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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
        window.alert(
          '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        );
        return;
      }
      // invalidate 로 feedbackDetail.meetingUrl 이 곧 채워지지만, 즉시 입장 경험을 위해
      // 모달을 바로 연다(JitsiEmbedModal 이 갱신된 URL 수신).
      setIsJitsiOpen(true);
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
      ? resolveLiveSessionStatus({
          rawStatus: apiStatus,
          mentorStatus: feedbackDetail?.mentorStatus,
          menteeStatus: feedbackDetail?.menteeStatus,
          startDate: startIso,
          endDate: endIso,
          now,
        })
      : 'waiting';
  const liveBadge = getLiveFeedbackBadgeVisual(liveUiStatus);

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
    questionAnswer: feedbackDetail?.preQuestion ?? EMPTY_PLACEHOLDER,
    menteeAttendanceLabel,
  };

  // 노션 제출물만 왼쪽 패널 임베드 가능(서면 피드백과 동일 기준).
  const hasEmbeddableSubmission =
    !!selectedMentee.attendanceUrl && isNotionUrl(selectedMentee.attendanceUrl);
  const showLinkPanel = isSidePanelOpen && hasEmbeddableSubmission;

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
        className={twMerge(
          feedbackModalDesign.modalContainer,
          // 제출물 패널이 실제로 열렸을 때만 모달을 넓혀 임베드+정보를 함께 표시
          showLinkPanel && feedbackModalDesign.modalContainerWide,
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
          isLive
          onClose={onClose}
        />

        <FeedbackLayout
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
          menteeInfo={() => null}
          editor={
            <div className="flex h-full flex-col gap-3">
              {/* 멘티 정보 카드 — 사전 Q&A 가 남은 세로 공간을 채운다(flex-1) */}
              <section
                className={twMerge(
                  feedbackModalDesign.cardSurface,
                  'flex min-h-0 flex-1 flex-col',
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
                              selectedMentee.submissionStatusLabel === '제출됨'
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
                            <a
                              href={selectedMentee.attendanceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={feedbackModalDesign.outlineButton}
                            >
                              <LinkIcon />
                              제출물 보기
                            </a>
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
                          <button
                            type="button"
                            disabled
                            className={
                              feedbackModalDesign.outlineButtonDisabled
                            }
                          >
                            <LinkIcon />
                            제출물 보기
                          </button>
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
                  </div>
                </div>

                {/* 가로 구분선 + 사전 Q&A — 남은 세로 공간을 채움(flex-1) */}
                <div
                  className={twMerge(
                    feedbackModalDesign.dividerTop,
                    'mt-4 flex min-h-0 flex-1 flex-col pt-4',
                  )}
                >
                  <p className="text-xs font-medium text-neutral-400">
                    사전 Q&amp;A
                  </p>
                  <p className={twMerge('mt-3', feedbackModalDesign.qnaBody)}>
                    {selectedMentee.questionAnswer}
                  </p>
                </div>
              </section>

              {/* 액션 패널 — 예약 일시 / 피드백 상태 (하단, 버튼 바로 위) */}
              <section
                aria-label="라이브 피드백 액션 패널"
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
          actions={
            <div className="flex items-center gap-3">
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
    </>
  );
};

export default LiveFeedbackReservationModal;
