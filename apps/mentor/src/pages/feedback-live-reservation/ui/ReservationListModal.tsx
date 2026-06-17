import BaseModal from '@/common/modal/BaseModal';

import ReservationListContent from './ReservationListContent';

interface ReservationListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 예약 현황 모달 래퍼 — 프로그램 일정 컨텍스트(일정 오픈 모달)에서
 * 페이지 이동 없이 예약 현황을 모달로 띄우기 위해 사용한다.
 *
 * 본문은 페이지와 동일한 `ReservationListContent` 를 재사용한다.
 * 내부 "보기" 가 여는 `LiveFeedbackReservationModal` 은 같은 `#modal`
 * 포털에 더 나중에 마운트되므로 동일 z-index(z-50) 에서 위에 쌓인다.
 */
const ReservationListModal = ({
  isOpen,
  onClose,
}: ReservationListModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="flex h-[85vh] max-w-[1100px] flex-col overflow-hidden"
    >
      <header className="border-neutral-85 flex items-center justify-between border-b px-6 py-5">
        <h2 className="text-medium20 text-neutral-10 font-semibold">
          예약 현황
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="text-neutral-40 hover:text-neutral-20 text-medium22 leading-none"
        >
          ×
        </button>
      </header>

      <div className="flex-1 overflow-auto px-6 py-5">
        <ReservationListContent />
      </div>
    </BaseModal>
  );
};

export default ReservationListModal;
