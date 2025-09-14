import BaseModal from '@components/ui/BaseModal';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onClickModal: () => void;
}

function BonusMissionModal({ isOpen, onClose, onClickModal }: Props) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="mx-5 w-fit">
      <img
        className="h-auto w-full max-w-[380px] cursor-pointer"
        src="/images/bonus-mission-popup.jpg"
        alt="보너스 미션 홍보 이미지"
        onClick={onClickModal}
      />
      <button
        type="button"
        className="absolute right-3 top-3"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X />
      </button>
    </BaseModal>
  );
}

export default BonusMissionModal;
