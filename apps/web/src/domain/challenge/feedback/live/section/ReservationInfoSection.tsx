'use client';

import { useState } from 'react';

import JitsiEmbedModal from '@/common/modal/JitsiEmbedModal';

import type { FeedbackInfo, LiveFeedbackStatus, Mentor } from '../types';
import MentorCard from '../ui/MentorCard';
import { formatReservationTime } from '../utils';
import LiveFeedbackReview from './LiveFeedbackReview';

interface Props {
  mentor: Mentor;
  feedbackInfo: FeedbackInfo | null;
  status: LiveFeedbackStatus;
  /** Jitsi 동일 방 합성용 — 미션 아이템의 feedbackId */
  feedbackId?: number | null;
}

const ReservationInfoSection = ({
  mentor,
  feedbackInfo,
  status,
  feedbackId,
}: Props) => {
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);
  const reservationTime = formatReservationTime(feedbackInfo?.startDate);
  const meetingUrl = feedbackInfo?.meetingUrl;
  // TODO(임시): 정식 운영 시 T-10 게이팅 복원.
  //   const entranceActive = isEntranceActive(feedbackInfo?.startDate, feedbackInfo?.endDate);
  // 임시 변경: 라이브 입장 시간 게이팅을 우회해 항상 입장 허용 (PRD §13).
  // isEntranceActive 함수는 ../utils 에 보존(복원 시 import 재추가).
  const entranceActive: boolean = true;

  return (
    <div className="flex w-full flex-col gap-5 p-0 md:flex-row md:p-4">
      <section className="flex w-full flex-col">
        <h2 className="text-xsmall16 text-neutral-0 font-semibold">
          담당 멘토
        </h2>
        <MentorCard
          mentor={mentor}
          className="min-w-[314px] px-0 py-4 md:px-4"
        />
      </section>

      {feedbackInfo && (
        <section className="flex w-full flex-col">
          <h2 className="text-xsmall16 text-neutral-0 font-semibold">
            LIVE 피드백 예약내역
          </h2>
          <div className="flex flex-col gap-10 px-0 py-4 md:gap-4 md:px-4">
            <div className="flex flex-col gap-3">
              {/* 예약 일시 */}
              <div className="flex items-start gap-1">
                <img src="/icons/clock.svg" alt="" className="mt-0.5" />
                <span className="text-xsmall14 text-neutral-40 shrink-0 pr-2">
                  예약 일시
                </span>
                <span className="text-xsmall14 text-neutral-20">
                  {reservationTime}
                </span>
              </div>

              {/* 회의 링크 */}
              <div className="flex items-center gap-1">
                <img src="/icons/door-closed.svg" alt="" />
                <span className="text-xsmall14 text-neutral-40 pr-2">
                  회의 링크
                </span>
                {meetingUrl ? (
                  <a
                    href={meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xsmall14 text-primary underline"
                  >
                    {meetingUrl}
                  </a>
                ) : (
                  <span className="text-xsmall14 text-neutral-20">미정</span>
                )}
              </div>
            </div>

            {/* 하단 액션 */}
            {status === 'completed' && <LiveFeedbackReview />}
            {status === 'reserved' && (
              // TODO(임시): 외부 회의 링크 대신 Jitsi 임베드 모달로 연결 (PRD §13).
              //   buildJitsiRoomUrl(feedbackId, salt)로 멘토와 동일 방 입장.
              //   상단 "회의 링크"(meetingUrl 외부 링크) row는 그대로 보존.
              <button
                type="button"
                onClick={() => setIsJitsiOpen(true)}
                disabled={!entranceActive}
                className={
                  entranceActive
                    ? 'text-xsmall14 flex flex-1 items-center justify-center whitespace-nowrap rounded-sm bg-gradient-to-r from-[#4B53FF] to-[#763CFF] py-3 font-semibold text-white'
                    : 'bg-neutral-70 text-xsmall14 pointer-events-none flex flex-1 items-center justify-center whitespace-nowrap rounded-sm py-3 font-semibold text-neutral-100'
                }
              >
                LIVE 피드백 입장하기
              </button>
            )}
          </div>
        </section>
      )}

      {feedbackId != null && (
        <JitsiEmbedModal
          isOpen={isJitsiOpen}
          onClose={() => setIsJitsiOpen(false)}
          meta={{ feedbackId }}
          spaceName={mentor.nickname}
        />
      )}
    </div>
  );
};

export default ReservationInfoSection;
