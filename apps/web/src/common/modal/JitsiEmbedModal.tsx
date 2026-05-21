'use client';

import { useMemo } from 'react';

import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';
import { buildJitsiRoomUrl } from '@letscareer/ui/JitsiEmbed/buildRoomUrl';

import BaseModal from '@/common/modal/BaseModal';

/**
 * Jitsi 회의실 메타데이터.
 *
 * 양측 BE 응답 공통 필드인 `feedbackId`만 사용해 방 이름을 합성한다.
 * salt(env)와 결합해 외부 추측을 막고, 어드민도 같은 입력으로 URL 재구성 가능.
 */
export interface JitsiMeta {
  /** feedback 단건 ID — 멘토/멘티/어드민 BE 응답에서 동일 보장 */
  feedbackId: number;
}

interface JitsiEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: JitsiMeta;
  /** 모달 헤더 표시용 라벨 (선택). 라우팅·URL 합성에는 영향 없음. */
  spaceName?: string;
}

const JitsiEmbedModal = ({
  isOpen,
  onClose,
  meta,
  spaceName,
}: JitsiEmbedModalProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_JITSI_BASE_URL;
  const salt = process.env.NEXT_PUBLIC_JITSI_ROOM_SALT;

  const roomUrl = useMemo(() => {
    if (!baseUrl || !salt) return null;
    return buildJitsiRoomUrl({ baseUrl, feedbackId: meta.feedbackId, salt });
  }, [baseUrl, salt, meta.feedbackId]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 h-[92vh] w-[1280px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[90vh] md:rounded-3xl"
    >
      {roomUrl ? (
        <JitsiEmbed
          roomUrl={roomUrl}
          spaceName={spaceName}
          onClose={onClose}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-500">
          Jitsi 회의실 설정이 누락되었습니다.
          <br />
          <code className="mt-2 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
            NEXT_PUBLIC_JITSI_BASE_URL
          </code>
          <code className="ml-1 mt-2 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
            NEXT_PUBLIC_JITSI_ROOM_SALT
          </code>{' '}
          환경변수를 설정해주세요.
        </div>
      )}
    </BaseModal>
  );
};

export default JitsiEmbedModal;
