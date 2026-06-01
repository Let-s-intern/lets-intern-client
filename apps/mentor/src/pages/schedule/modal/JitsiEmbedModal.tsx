import { JitsiEmbed } from '@letscareer/ui/JitsiEmbed';

import BaseModal from '@/common/modal/BaseModal';

/**
 * Jitsi 회의실 모달.
 *
 * 방 URL 은 BE 가 합성한 `meetingUrl`(= jitsi base + 랜덤 `meetingRoom`)을 그대로 사용한다.
 * 멘토/멘티/어드민이 동일 `feedbackId` 의 동일 `meetingUrl` 을 받으므로 같은 방으로 수렴하며,
 * 방 이름이 서버 생성 랜덤값이라 외부에서 추측·접속할 수 없다.
 */
interface JitsiEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** BE 가 합성한 회의실 URL. 아직 생성 전이면 null. */
  meetingUrl: string | null;
  /** 모달 헤더 표시용 라벨 (선택). URL 에는 영향 없음. */
  spaceName?: string;
}

const JitsiEmbedModal = ({
  isOpen,
  onClose,
  meetingUrl,
  spaceName,
}: JitsiEmbedModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 h-[92vh] w-[1280px] max-w-full overflow-hidden rounded-2xl md:mx-4 md:h-[90vh] md:rounded-3xl"
    >
      {meetingUrl ? (
        <JitsiEmbed
          roomUrl={meetingUrl}
          spaceName={spaceName}
          onClose={onClose}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-8 text-center text-sm text-neutral-500">
          회의실이 아직 준비되지 않았습니다.
          <br />
          멘토가 라이브 피드백에 입장하면 회의실이 열립니다.
        </div>
      )}
    </BaseModal>
  );
};

export default JitsiEmbedModal;
