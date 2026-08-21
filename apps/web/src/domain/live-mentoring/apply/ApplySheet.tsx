'use client';

import { useEffect, type ReactNode } from 'react';

interface ApplySheetProps {
  isOpen: boolean;
  /** 닫기 — 바깥 클릭·Esc·`이전 단계로` 가 모두 이걸 부른다. */
  onClose: () => void;
  /** `신청하기`. 이 Push 는 콜백만 부르고, 실제 신청 생성은 Push 3 이다. */
  onSubmit: () => void;
  /** 필수 입력이 다 차기 전에는 `신청하기` 를 잠근다. */
  canSubmit?: boolean;
  children?: ReactNode;
}

/**
 * 1대1 라이브 멘토링 신청 시트 (시안 `1-0`).
 *
 * 모바일은 화면 아래에 붙는 바텀시트, 데스크탑은 가운데 모달이다. 한 컴포넌트에
 * 반응형으로 담는다 — 두 벌로 나누면 안쪽 섹션까지 두 번 렌더된다.
 *
 * 열려 있는 동안 배경 스크롤을 잠근다. 시트 본문이 길어 자체 스크롤을 갖는데,
 * 잠그지 않으면 끝에 닿는 순간 뒤 페이지가 따라 움직여 어디를 보고 있는지 잃는다.
 */
const ApplySheet = ({
  isOpen,
  onClose,
  onSubmit,
  canSubmit = true,
  children,
}: ApplySheetProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="bg-neutral-0/50 fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-5"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="1대1 멘토링 신청"
        // 바깥 클릭으로만 닫히게 한다 — 시트 안쪽 클릭이 배경까지 올라가면 안 된다
        onClick={(event) => event.stopPropagation()}
        className="bg-static-100 flex max-h-[90dvh] w-full flex-col rounded-t-xl md:max-w-[720px] md:rounded-xl"
      >
        {/* 시안의 상단 손잡이 — 모바일에서 끌어 내릴 수 있음을 알리는 표식 */}
        <div className="flex shrink-0 justify-center pb-2 pt-3 md:pt-4">
          <span
            aria-hidden="true"
            className="bg-neutral-80 h-1 w-10 rounded-full"
          />
        </div>

        <div className="flex flex-col gap-8 overflow-y-auto px-5 py-4 md:px-8">
          {children}
        </div>

        <div className="flex shrink-0 gap-3 px-5 pb-5 pt-4 md:px-8 md:pb-8">
          <button
            type="button"
            onClick={onClose}
            className="border-primary text-primary text-xsmall16 flex-1 rounded-sm border py-3 font-medium"
          >
            이전 단계로
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="bg-primary text-xsmall16 disabled:bg-neutral-80 disabled:text-neutral-40 flex-[1.4] rounded-sm py-3 font-medium text-white"
          >
            신청하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplySheet;
