'use client';

import BaseModal from '@/common/modal/BaseModal';

export type LibraryApplyResultVariant = 'success' | 'conflict' | 'error';

interface LibraryApplyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  variant: LibraryApplyResultVariant;
  confirmText?: string;
}

const LibraryApplyResultModal = ({
  isOpen,
  onClose,
  title,
  message,
  variant,
  confirmText = '확인',
}: LibraryApplyResultModalProps) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="mx-5 max-w-[350px]">
      <div
        className="flex flex-col gap-5 p-5"
        data-testid="apply-result-modal"
        data-variant={variant}
      >
        <div className="flex flex-col gap-1.5">
          <h2
            className="text-small18 font-semibold"
            data-testid="apply-result-title"
          >
            {title}
          </h2>
          {message && (
            <p
              className="text-xsmall14 text-neutral-35 whitespace-pre-line"
              data-testid="apply-result-message"
            >
              {message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xs bg-primary text-xsmall16 w-full py-3 text-white"
          data-testid="apply-result-confirm"
        >
          {confirmText}
        </button>
      </div>
    </BaseModal>
  );
};

export default LibraryApplyResultModal;
