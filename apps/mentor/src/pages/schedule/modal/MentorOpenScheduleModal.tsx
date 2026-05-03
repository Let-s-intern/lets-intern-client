import BaseModal from '@/common/modal/BaseModal';

import LiveAvailabilityContent, {
  type BlockedSlot,
  type LiveAvailabilityContentProps,
} from '../live-availability/LiveAvailabilityContent';

export type { BlockedSlot };

interface MentorOpenScheduleModalProps
  extends Omit<LiveAvailabilityContentProps, 'mode' | 'resetKey' | 'onClose'> {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 라이브 피드백 일정 열기 모달.
 * 콘텐츠는 LiveAvailabilityContent 로 추출되어 페이지 버전과 공유된다.
 */
const MentorOpenScheduleModal = ({
  isOpen,
  onClose,
  ...contentProps
}: MentorOpenScheduleModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="flex h-[85vh] max-w-[980px] flex-col overflow-hidden"
    >
      <LiveAvailabilityContent
        {...contentProps}
        mode="modal"
        onClose={onClose}
        resetKey={isOpen}
      />
    </BaseModal>
  );
};

export default MentorOpenScheduleModal;
