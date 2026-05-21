import { useMemo, useState } from 'react';

import { buildJitsiRoomUrl } from '@letscareer/ui/JitsiEmbed/buildRoomUrl';

import { useFeedbackDetailQuery } from '@/api/feedback/feedback';
import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import BaseModal from '@/common/modal/BaseModal';
import { mentorConfig } from '@/constants/config';
import { useFeedbackCountdown } from '@/pages/feedback/hooks/useFeedbackCountdown';
import FeedbackHeader from '@/pages/feedback/ui/FeedbackHeader';
import FeedbackLayout from '@/pages/feedback/ui/FeedbackLayout';
import FeedbackMenteeNavigation from '@/pages/feedback/ui/FeedbackMenteeNavigation';
import MenteeList from '@/pages/feedback/ui/MenteeList';
import {
  getLiveFeedbackBadgeVisual,
  resolveLiveFeedbackStatus,
} from '@/pages/feedback/utils/liveFeedbackStatus';
import { resolveLiveFeedbackAccess } from '@/pages/feedback/utils/liveFeedbackAccess';

import { currentNow } from '../constants/mockNow';
import { getLiveFeedbackReservationMock } from '../challenge-content/liveFeedbackReservationMock';
import type { PeriodBarData } from '../types';
import JitsiEmbedModal, { type JitsiMeta } from './JitsiEmbedModal';

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

  // BE 단건 상세 — 모달이 열려있을 때만 fetch.
  // 모달은 항상 mount 되어 있기 때문에 isOpen 게이트가 없으면 페이지 로드 시점에
  // mock 바의 가짜 ID(예: 101)로 prod API를 때려 404가 발생한다.
  const { data: feedbackDetail } = useFeedbackDetailQuery(
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

  // Jitsi 메타데이터 — 멘티 측과 동일한 입력값으로 URL을 합성해 같은 방에 모인다.
  // missionName은 멘토 schedule 컨텍스트에 미존재(BE 미배포): 임시 placeholder 사용
  // → BE 메모: .claude/tasks/memos/be-request-jitsi-mentor-meta.md
  const jitsiMeta: JitsiMeta | null = useMemo(() => {
    if (!startIso) return null;
    if (!selectedBar?.liveFeedback) return null;
    if (feedbackId == null) return null;
    return {
      challengeName: selectedBar.challengeTitle,
      // TODO(BE): feedbackDetail.missionTitle로 교체. 현재는 placeholder라 멘티 측과 URL 불일치 가능
      missionName: `${selectedBar.th}회차 라이브 피드백`,
      menteeName: selectedBar.liveFeedback.menteeName,
      startDate: startIso,
      feedbackId,
    };
  }, [
    startIso,
    selectedBar?.challengeTitle,
    selectedBar?.th,
    selectedBar?.liveFeedback,
    feedbackId,
  ]);

  // 프론트 합성 URL — resolveLiveFeedbackAccess의 첫 인자 의미가 변경됨
  // ("BE가 내려준 URL" → "프론트가 만든 URL or null")
  const baseUrl = import.meta.env.VITE_JITSI_BASE_URL;
  const meetingUrl = useMemo(() => {
    if (!jitsiMeta || !baseUrl) return null;
    return buildJitsiRoomUrl({ baseUrl, ...jitsiMeta });
  }, [baseUrl, jitsiMeta]);

  if (!bar || !selectedBar) return null;

  const detail = getLiveFeedbackReservationMock(selectedBar);
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

  const menteeListItems = reservationBars.map((item) => {
    const itemDetail = getLiveFeedbackReservationMock(item);

    const feedbackStatus: FeedbackStatus =
      itemDetail.mentoringStatusTone === 'critical' ? 'WAITING' : 'COMPLETED';

    const submissionLabel: '제출' | '미제출' =
      itemDetail.submissionStatusLabel === '미제출' ? '미제출' : '제출';

    return {
      id: item.liveFeedback?.id ?? item.missionId,
      name: itemDetail.menteeName,
      feedbackStatus,
      status: submissionLabel === '미제출' ? 'ABSENT' : 'PRESENT',
      date: item.startDate,
      startTime: item.liveFeedback?.startTime,
      endTime: item.liveFeedback?.endTime,
      submissionLabel,
      liveStatus: item.liveFeedback?.status,
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

  const zepAccess =
    startIso && endIso
      ? resolveLiveFeedbackAccess(meetingUrl, startIso, endIso, now)
      : { state: 'unassigned' as const, url: null };

  // ZEP 영역 표기
  const zepLabel = (() => {
    switch (zepAccess.state) {
      case 'unassigned':
        return '미정';
      case 'pending':
        return '10분 전 자동 배정';
      case 'active':
        return '입장 가능';
      case 'ended':
        return '종료됨';
    }
  })();

  const selectedMentee = {
    id: selectedBar.liveFeedback?.id ?? selectedBar.missionId,
    name: detail.menteeName,
    challengeTitle: detail.challengeTitle,
    submissionStatusLabel: detail.submissionStatusLabel,
    reservationTimeLabel: detail.reservationTimeLabel,
    mentorRole: detail.mentorRole,
    mentorIndustry: detail.mentorIndustry,
    mentorCompany: detail.mentorCompany,
    phoneNumber: detail.phoneNumber,
    questionAnswer: detail.questionAnswer,
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
          challengeTitle={detail.challengeTitle}
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
                    <button
                      type="button"
                      className="inline-flex w-fit items-center gap-1 rounded border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      제출물 보기
                    </button>
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

              {/* 액션 패널 — 예약 일시 / ZEP 회의실 / 피드백 상태 */}
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

                  {/* ZEP 회의실 */}
                  <li className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-medium text-neutral-400">
                      줌 회의실
                    </span>
                    <span
                      className={
                        zepAccess.state === 'active'
                          ? 'text-neutral-800'
                          : 'text-neutral-400'
                      }
                    >
                      {zepLabel}
                    </span>
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
              {detail.guidebookButtons.map((button) => (
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
              {/* 멘티와 대화하기 — BE 채팅 미배포 (PRD §5.4 mentor3.15) */}
              <button
                type="button"
                disabled
                aria-label="멘티와 대화하기 (서비스 준비 중)"
                title="채팅 기능은 서비스 준비 중입니다"
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-400"
              >
                멘티와 대화하기
              </button>

              {/* 라이브 입장하기 — ZEP active 일 때만 활성 (T-10 룰) */}
              <button
                type="button"
                disabled={zepAccess.state !== 'active'}
                onClick={
                  zepAccess.state === 'active'
                    ? () => setIsJitsiOpen(true)
                    : undefined
                }
                aria-label="라이브 입장하기"
                className={
                  zepAccess.state === 'active'
                    ? 'bg-primary hover:bg-primary-hover rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors'
                    : 'rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-white'
                }
              >
                라이브 입장하기
              </button>
            </div>
          }
          showExpandToggle={false}
        />
      </BaseModal>

      {jitsiMeta && (
        <JitsiEmbedModal
          isOpen={isJitsiOpen}
          onClose={() => setIsJitsiOpen(false)}
          meta={jitsiMeta}
        />
      )}
    </>
  );
};

export default LiveFeedbackReservationModal;
