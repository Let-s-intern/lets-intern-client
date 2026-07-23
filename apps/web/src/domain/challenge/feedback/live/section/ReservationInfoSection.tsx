'use client';

import { useState } from 'react';

import { ensureLiveMeetingUrl } from '@letscareer/ui/JitsiEmbed/jitsiHealthCheck';

import { usePatchFeedbackMeetingUrl } from '@/api/feedback/feedback';
import JitsiEmbedModal from '@/common/modal/JitsiEmbedModal';

import type { FeedbackInfo, LiveFeedbackStatus, Mentor } from '../types';
import MentorCard from '../ui/MentorCard';
import { formatReservationTime, isEntranceActive } from '../utils';
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
  // 회의실 URL 준비(헬스체크 + PATCH) 진행 상태
  const [isPreparingRoom, setIsPreparingRoom] = useState(false);
  const reservationTime = formatReservationTime(feedbackInfo?.startDate);
  const meetingUrl = feedbackInfo?.meetingUrl;
  const entranceActive = isEntranceActive(
    feedbackInfo?.startDate,
    feedbackInfo?.endDate,
  );

  // feedbackId 가 없을 때도 hook 규칙상 항상 호출(0 → 핸들러에서 가드).
  const patchMeetingUrl = usePatchFeedbackMeetingUrl(feedbackId ?? 0);

  /**
   * "LIVE 피드백 입장하기" — 멘토·멘티 공통 로직(`ensureLiveMeetingUrl`).
   *
   * 데드락 방지: 멘토가 먼저 입장하지 않았어도(meetingUrl=null) 멘티가 직접
   * 헬스체크 후 healthy base 를 PATCH 로 보내 회의실을 생성한다. 이미 meetingUrl
   * 이 있으면(멘토가 먼저 입장해 등록함) 바로 모달을 연다. 입장 순서 무관.
   */
  const handleEnterLive = async () => {
    if (feedbackId == null || isPreparingRoom) return;

    setIsPreparingRoom(true);
    try {
      const result = await ensureLiveMeetingUrl({
        meetingUrl,
        baseCandidates: [
          process.env.NEXT_PUBLIC_JITSI_BASE_URL,
          process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL,
        ],
        // BE 가 base + meetingRoom 을 합성하므로 FE 는 base URL 만 보낸다.
        registerBaseUrl: async (base) => {
          await patchMeetingUrl.mutateAsync({ meetingUrl: base });
        },
      });
      if (!result.ok) {
        window.alert(
          '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
        );
        return;
      }
      setIsJitsiOpen(true);
    } catch (error) {
      // 헬스체크/등록 중 네트워크·서버 오류 — 미처리 시 unhandled rejection.
      console.error('라이브 입장 준비 중 오류:', error);
      window.alert(
        '회의실 연결을 준비하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      );
    } finally {
      setIsPreparingRoom(false);
    }
  };

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
          <div className="flex h-full flex-col gap-4 px-0 py-4 md:px-4">
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
              {/* <div className="flex items-center gap-1">
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
              </div> */}
            </div>

            {/* 하단 액션 — 버튼 위치/구조는 LC-3021(예지) 기준, 입장 버튼만 데드락 수정 적용 */}
            <div className="flex flex-col gap-2">
              {status === 'completed' && feedbackId != null && (
                <LiveFeedbackReview feedbackId={feedbackId} />
              )}
              {status === 'reserved' && (
                // 입장 순서 무관: meetingUrl 이 없으면 멘티가 직접 헬스체크 + PATCH 로 회의실을
                // 생성하고(handleEnterLive), 있으면 멘토가 만든 동일 방으로 바로 입장한다.
                <button
                  type="button"
                  onClick={handleEnterLive}
                  disabled={!entranceActive || isPreparingRoom}
                  className={
                    entranceActive && !isPreparingRoom
                      ? 'text-xsmall14 flex flex-1 items-center justify-center whitespace-nowrap rounded-sm bg-gradient-to-r from-[#4B53FF] to-[#763CFF] py-3 font-semibold text-white'
                      : 'bg-neutral-70 text-xsmall14 pointer-events-none flex flex-1 items-center justify-center whitespace-nowrap rounded-sm py-3 font-semibold text-neutral-100'
                  }
                >
                  {isPreparingRoom ? '회의실 준비 중…' : 'LIVE 피드백 입장하기'}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {feedbackId != null && (
        <JitsiEmbedModal
          isOpen={isJitsiOpen}
          onClose={() => setIsJitsiOpen(false)}
          meetingUrl={meetingUrl ?? null}
          spaceName={mentor.nickname}
          // 좌상단 타이머(현재 시각·남은 시간)용 세션 시간.
          startDate={feedbackInfo?.startDate}
          endDate={feedbackInfo?.endDate}
          // 멘티 본인 사전질문/제출물 — 좌하단 자료 패널(BE preQuestion/attendanceUrl 공급 후 노출).
          preQuestion={feedbackInfo?.preQuestion ?? undefined}
          submissionUrl={feedbackInfo?.attendanceUrl ?? undefined}
          // 입장 후 현재 서버가 죽어있으면(external_api.js 로드 실패) 다음 후보로 자동
          // 재등록(failover). BE 는 base + meetingRoom 을 덮어써 합성한다.
          baseCandidates={[
            process.env.NEXT_PUBLIC_JITSI_BASE_URL,
            process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL,
          ]}
          registerBaseUrl={async (base) => {
            await patchMeetingUrl.mutateAsync({ meetingUrl: base });
          }}
          onExhausted={() =>
            window.alert(
              '회의실 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
            )
          }
        />
      )}
    </div>
  );
};

export default ReservationInfoSection;
