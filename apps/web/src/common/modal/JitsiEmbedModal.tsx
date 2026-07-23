'use client';

import {
  JitsiEmbed,
  LiveFeedbackMaterials,
  LiveSessionTimer,
} from '@letscareer/ui/JitsiEmbed';

import BaseModal from '@/common/modal/BaseModal';

/**
 * Jitsi 회의실 모달.
 *
 * 방 URL 은 BE 가 합성한 `meetingUrl`(= jitsi base + 랜덤 `meetingRoom`)을 그대로 사용한다.
 * 멘토/멘티가 동일 `feedbackId` 의 동일 `meetingUrl` 을 받으므로 같은 방으로 수렴하며,
 * 방 이름이 서버 생성 랜덤값이라 외부에서 추측·접속할 수 없다.
 *
 * 멘토 앱·알림톡 링크 모달과 동일하게 4:3(웹캠 480p 기본 비율) 화면 + 좌상단 타이머.
 */
interface JitsiEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** BE 가 합성한 회의실 URL. 아직 생성 전이면 null. */
  meetingUrl: string | null;
  /** 모달 헤더 표시용 라벨 (선택). URL 에는 영향 없음. */
  spaceName?: string;
  /** 세션 시작 ISO — 좌상단 타이머 표시용(선택). */
  startDate?: string;
  /** 세션 종료 ISO — 남은 시간 계산용(선택). */
  endDate?: string;
  /** 멘티 본인 사전 질문 — 좌하단 "나의 사전 QA" 패널(선택). */
  preQuestion?: string;
  /** 멘티 본인 제출물 URL — 좌하단 "나의 제출물" 패널(선택). */
  submissionUrl?: string;
  /** 우선순위 순 jitsi base 후보 — 현재 서버 실패 시 다음 후보로 failover. */
  baseCandidates?: ReadonlyArray<string | undefined>;
  /** 다음 base 를 BE 에 재등록하는 콜백 (`PATCH /feedback/{id}/meeting-url`). */
  registerBaseUrl?: (base: string) => Promise<void>;
  /** 모든 후보 소진(입장 가능한 서버 없음) 시 호출. */
  onExhausted?: () => void;
}

const JitsiEmbedModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
  startDate,
  endDate,
  preQuestion,
  submissionUrl,
  baseCandidates,
  registerBaseUrl,
  onExhausted,
}: JitsiEmbedModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      // z-10: 모달 콘텐츠(Jitsi iframe)를 오버레이 위로 명시 합성 — 모바일(iOS)에서
      // fixed 오버레이가 iframe 위를 덮어 터치가 막히던 문제 방지.
      className="rounded-xxl relative z-10 aspect-[4/3] h-[94vh] max-h-[980px] w-auto max-w-[96vw] overflow-hidden bg-neutral-900"
    >
      <div className="relative h-full w-full">
        {/* 모달 자체가 4:3(웹캠 480p 기본 비율) → 화상이 박스를 꽉 채워 확대/크롭 없이 보인다.
            로고+현재/남은 시간은 JitsiEmbed 좌상단 아크릴 패널(topLeftSlot)에 한 덩어리로 묶는다. */}
        <div className="absolute inset-0">
          {meetingUrl ? (
            <JitsiEmbed
              roomUrl={meetingUrl}
              spaceName={spaceName}
              onClose={onClose}
              baseCandidates={baseCandidates}
              registerBaseUrl={registerBaseUrl}
              onExhausted={onExhausted}
              topLeftSlot={
                startDate && endDate ? (
                  <LiveSessionTimer endDate={endDate} />
                ) : undefined
              }
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

      {/* 멘티 본인 사전질문/제출물 — 좌하단 자료 패널(뷰포트 고정). */}
      <LiveFeedbackMaterials
        viewer="MENTEE"
        preQuestion={preQuestion}
        submissionUrl={submissionUrl}
      />
    </BaseModal>
  );
};

export default JitsiEmbedModal;
