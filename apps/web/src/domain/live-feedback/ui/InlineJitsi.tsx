'use client';

import dynamic from 'next/dynamic';

interface Props {
  /** BE 가 합성한 회의실 URL. 아직 없으면 null — 미렌더. */
  meetingUrl: string | null;
  spaceName?: string;
  onClose: () => void;
}

// 무거운 Jitsi 클라이언트는 입장 성공 시점에만 로드(SSR 비활성).
const JitsiEmbed = dynamic(
  () => import('@letscareer/ui/JitsiEmbed').then((m) => m.JitsiEmbed),
  {
    ssr: false,
    loading: () => (
      <div className="border-neutral-80 text-neutral-40 flex h-[70dvh] w-full items-center justify-center rounded-2xl border">
        회의실을 불러오는 중...
      </div>
    ),
  },
);

/**
 * 입장 성공 후 같은 화면에 렌더되는 인라인 회의실.
 * meetingUrl 이 null 이면 아무것도 렌더하지 않는다(아직 회의실 미준비).
 */
const InlineJitsi = ({ meetingUrl, spaceName, onClose }: Props) => {
  if (!meetingUrl) return null;

  return (
    <JitsiEmbed roomUrl={meetingUrl} spaceName={spaceName} onClose={onClose} />
  );
};

export default InlineJitsi;
