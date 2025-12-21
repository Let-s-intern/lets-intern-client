import BaseModal from '@/common/BaseModal';
import { XIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface ExperienceExpandModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ExperienceExpandModal = ({
  children,
  isOpen,
  onClose,
}: ExperienceExpandModalProps) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[92vh] w-[90%] px-10 pb-8 pt-2"
    >
      <div className="flex items-end justify-end py-2">
        <XIcon onClick={onClose} className="cursor-pointer" />
      </div>
      {children}
    </BaseModal>
  );
};

export default ExperienceExpandModal;
