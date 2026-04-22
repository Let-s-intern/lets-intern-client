'use client';

import type { FeedbackStatus } from '@/api/challenge/challengeSchema';
import BaseModal from '@/common/modal/BaseModal';
import mentorConfig from '@/domain/mentor/constants/config';
import FeedbackHeader from '@/domain/mentor/feedback/ui/FeedbackHeader';
import FeedbackLayout from '@/domain/mentor/feedback/ui/FeedbackLayout';
import FeedbackMenteeNavigation from '@/domain/mentor/feedback/ui/FeedbackMenteeNavigation';
import MenteeList from '@/domain/mentor/feedback/ui/MenteeList';

import { getLiveFeedbackReservationMock } from '../challenge-content/liveFeedbackReservationMock';
import type { PeriodBarData } from '../types';

interface LiveFeedbackReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bar: PeriodBarData | null;
  liveFeedbackBars: PeriodBarData[];
  onSelectBar: (bar: PeriodBarData) => void;
  /** 라이브 피드백 회차(라운드) — 헤더 "N차 피드백" 표시용. 세션마다 변하지 않음 */
  roundTh?: number;
}

const LiveFeedbackReservationModal = ({
  isOpen,
  onClose,
  bar,
  liveFeedbackBars,
  onSelectBar,
  roundTh,
}: LiveFeedbackReservationModalProps) => {
  if (!bar) return null;

  const reservationBars = liveFeedbackBars.filter((item) => item.liveFeedback);
  const selectedBar = bar.liveFeedback ? bar : (reservationBars[0] ?? null);
  if (!selectedBar) return null;

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

    return {
      id: item.liveFeedback?.id ?? item.missionId,
      name: itemDetail.menteeName,
      feedbackStatus,
      status:
        itemDetail.submissionStatusLabel === '미제출' ? 'ABSENT' : 'PRESENT',
    };
  });

  const waitingCount = menteeListItems.filter(
    (item) => item.feedbackStatus === 'WAITING',
  ).length;
  const inProgressCount = 0;
  const completedCount = menteeListItems.filter(
    (item) => item.feedbackStatus === 'COMPLETED',
  ).length;

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
    countdownLabel: detail.countdownLabel,
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-2xl md:rounded-3xl mx-2 h-[85vh] w-[1200px] max-w-full overflow-hidden md:mx-4 md:h-[680px]"
    >
      <FeedbackHeader
        challengeTitle={detail.challengeTitle}
        missionTh={roundTh ?? selectedBar.th}
        totalCount={reservationBars.length}
        waitingCount={waitingCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
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
                    className="rounded inline-flex w-fit items-center gap-1 border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    제출물 보기
                  </button>
                  <p className="text-xsmall14 text-neutral-500">
                    멘토링 예약 시간 · {selectedMentee.reservationTimeLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="grid gap-2 text-xsmall14 text-neutral-600">
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
                  <div className="flex gap-2">
                    <span className="w-16 shrink-0 text-neutral-400">
                      전화번호
                    </span>
                    <span>{selectedMentee.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        editor={
          <section className="rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-medium text-neutral-400">
                사전 Q&amp;A
              </p>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                {selectedMentee.countdownLabel}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-700">
              {selectedMentee.questionAnswer}
            </p>
          </section>
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
          <button
            type="button"
            className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-white"
          >
            {detail.submitButtonLabel}
          </button>
        }
        showExpandToggle={false}
      />
    </BaseModal>
  );
};

export default LiveFeedbackReservationModal;
