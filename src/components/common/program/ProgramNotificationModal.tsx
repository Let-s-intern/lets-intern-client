import ResponsiveModal from '@components/ui/ResponsiveModal';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  isLoading?: boolean;
}

function ProgramNotificationModal({ isOpen, isLoading }: Props) {
  return (
    <ResponsiveModal
      className="max-w-[45rem] overflow-y-auto md:h-full md:w-full"
      wrapperClassName="md:py-[6.5rem]"
      isOpen={isOpen}
      isLoading={isLoading}
    >
      <p>프로그램 출시 알림 신청</p>
    </ResponsiveModal>
  );
}

export default ProgramNotificationModal;
