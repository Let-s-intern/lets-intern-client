import { useMemo } from 'react';

import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';
import { buildJitsiRoomUrl } from '@letscareer/ui/JitsiEmbed/buildRoomUrl';

import BaseModal from '@/common/modal/BaseModal';

/**
 * Jitsi 회의실 메타데이터.
 * 멘토/멘티가 같은 방에 입장하려면 **양측이 동일한 값**을 만들어내야 한다
 * (`buildJitsiRoomUrl`은 입력 동일 → URL 동일).
 *
 * - challengeName: 챌린지 제목 (예: "기필코 경험정리 챌린지 21기")
 * - missionName:   라이브 미션 제목 (멘티 측 `LiveFeedbackMission.title`과 1:1 일치)
 * - menteeName:    멘티 본명 (멘티 측 `useUserQuery().data.name`과 1:1 일치)
 * - startDate:     예약 시작 ISO 문자열
 * - feedbackId:    feedback 단건 ID
 */
export interface JitsiMeta {
  challengeName: string;
  missionName: string;
  menteeName: string;
  startDate: string;
  feedbackId: number;
}

interface JitsiEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: JitsiMeta;
}

const JitsiEmbedModal = ({ isOpen, onClose, meta }: JitsiEmbedModalProps) => {
  // Vite 환경변수 — 빌드 타임 인라인이지만 jsdom 테스트에서 stub 가능하도록
  // 렌더 시점에 참조한다 (Push 2 멘티 측 패턴과 동일).
  const baseUrl = import.meta.env.VITE_JITSI_BASE_URL;
  const fallbackBaseUrl = import.meta.env.VITE_JITSI_FALLBACK_URL;

  // meta/baseUrl 변경 시에만 재계산
  const urls = useMemo(() => {
    if (!baseUrl || !fallbackBaseUrl) return null;
    return {
      roomUrl: buildJitsiRoomUrl({ baseUrl, ...meta }),
      fallbackUrl: buildJitsiRoomUrl({ baseUrl: fallbackBaseUrl, ...meta }),
    };
  }, [baseUrl, fallbackBaseUrl, meta]);

  const spaceName = `${meta.challengeName} · ${meta.missionName}`;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 h-[92vh] w-[1280px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[90vh] md:rounded-3xl"
    >
      {urls ? (
        <JitsiEmbed
          roomUrl={urls.roomUrl}
          fallbackUrl={urls.fallbackUrl}
          spaceName={spaceName}
          onClose={onClose}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-500">
          Jitsi 회의실 설정이 누락되었습니다.
          <br />
          <code className="mt-2 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
            VITE_JITSI_BASE_URL
          </code>
          <code className="ml-1 mt-2 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
            VITE_JITSI_FALLBACK_URL
          </code>{' '}
          환경변수를 설정해주세요.
        </div>
      )}
    </BaseModal>
  );
};

export default JitsiEmbedModal;
