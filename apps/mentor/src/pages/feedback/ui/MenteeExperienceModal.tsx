'use client';

import BaseModal from '@/common/modal/BaseModal';
import MenteeExperienceContent from './MenteeExperienceContent';

interface MenteeExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  missionId?: number;
  userId?: number | null;
  menteeName?: string;
}

const MenteeExperienceModal = ({
  isOpen,
  onClose,
  missionId,
  userId,
  menteeName,
}: MenteeExperienceModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="mx-2 flex h-[85vh] w-[800px] max-w-full flex-col rounded-2xl md:mx-4 md:h-[680px]"
    >
      <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
        <h3 className="text-lg font-semibold text-neutral-900">
          {menteeName ? `${menteeName} 님의 ` : ''}제출 경험
        </h3>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex h-8 w-8 items-center justify-center rounded text-neutral-500 hover:bg-neutral-100"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <MenteeExperienceContent missionId={missionId} userId={userId} />
      </div>
    </BaseModal>
  );
};

export default MenteeExperienceModal;
