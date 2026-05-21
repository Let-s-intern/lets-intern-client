'use client';

import { useMemo } from 'react';

import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';
import { buildJitsiRoomUrl } from '@letscareer/ui/JitsiEmbed/buildRoomUrl';

import BaseModal from '@/common/modal/BaseModal';

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
  // 환경변수는 빌드 타임에 인라인되지만 jsdom 테스트에서 변경 가능성을 두기 위해
  // 모듈 최상위가 아닌 렌더 시점에 참조한다.
  const baseUrl = process.env.NEXT_PUBLIC_JITSI_BASE_URL;
  const fallbackBaseUrl = process.env.NEXT_PUBLIC_JITSI_FALLBACK_URL;

  // 메타데이터/베이스 URL 변경 시에만 재계산 (불필요 리렌더 시 동일 URL 재생성 방지)
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
            NEXT_PUBLIC_JITSI_BASE_URL
          </code>
          <code className="ml-1 mt-2 inline-block rounded bg-neutral-100 px-2 py-1 font-mono text-xs">
            NEXT_PUBLIC_JITSI_FALLBACK_URL
          </code>{' '}
          환경변수를 설정해주세요.
        </div>
      )}
    </BaseModal>
  );
};

export default JitsiEmbedModal;
