'use client';

import { useCallback, useEffect, useRef } from 'react';

import MentorApplyFlow from './MentorApplyFlow';

const CLOSE_CONFIRM_MESSAGE =
  '작성 중인 신청서는 저장되지 않습니다. 닫으시겠습니까?';

interface MentorApplyModalProps {
  open: boolean;
  onClose: () => void;
}

/** 신청서 모달 껍데기. 닫았다 다시 열면 빈 신청서로 시작한다 */
export default function MentorApplyModal({
  open,
  onClose,
}: MentorApplyModalProps) {
  if (!open) return null;
  return <MentorApplyModalContent onClose={onClose} />;
}

/**
 * 모바일은 전체 화면, 데스크톱은 가운데 창이다.
 * 고친 값이 있으면 닫기 전에 확인을 받고, 완료 화면에서는 바로 닫는다.
 * 확인 창은 경험 정리 닫기와 같은 `window.confirm` 이다. 웹에 자체 확인 다이얼로그가 `@letscareer/ui` 뿐이라서다
 */
function MentorApplyModalContent({ onClose }: { onClose: () => void }) {
  const dirtyRef = useRef(false);
  const completedRef = useRef(false);

  const requestClose = useCallback(() => {
    if (
      !completedRef.current &&
      dirtyRef.current &&
      !window.confirm(CLOSE_CONFIRM_MESSAGE)
    ) {
      return;
    }
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [requestClose]);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);
  const handleSubmitted = useCallback(() => {
    completedRef.current = true;
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mentor-apply-modal-title"
      className="fixed inset-0 z-50 flex justify-center bg-black/50 md:items-center"
    >
      <div className="flex h-full w-full flex-col bg-white md:h-auto md:max-h-[90vh] md:max-w-2xl md:rounded-lg">
        <div className="border-neutral-80 flex shrink-0 items-center justify-between border-b px-5 py-4">
          <h2
            id="mentor-apply-modal-title"
            className="text-small18 text-neutral-0 font-semibold"
          >
            멘토 신청서
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={requestClose}
            className="text-neutral-30 hover:bg-neutral-95 rounded-xxs -mr-2 p-2 transition-colors"
          >
            <svg
              aria-hidden
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-8 md:px-8">
          <MentorApplyFlow
            onHome={onClose}
            onDirtyChange={handleDirtyChange}
            onSubmitted={handleSubmitted}
          />
        </div>
      </div>
    </div>
  );
}
