import BootcampModal from './BootcampModal';
import ChallengeModal from './ChallengeModal';
import LetsChatModal from './LetsChatModal';
import './ProgramInfoModalGroup.scss';

export type ModalContentType = 'CHALLENGE' | 'BOOTCAMP' | 'LETS_CHAT' | '';

interface ProgramInfoModalGroupProps {
  showModalContent: ModalContentType;
  setShowModalContent: (showModalContent: ModalContentType) => void;
}

const ProgramInfoModalGroup = ({
  showModalContent,
  setShowModalContent,
}: ProgramInfoModalGroupProps) => {
  return (
    <div className="program-info-modal-group">
      {showModalContent === 'BOOTCAMP' ? (
        <BootcampModal setShowModalContent={setShowModalContent} />
      ) : showModalContent === 'LETS_CHAT' ? (
        <LetsChatModal setShowModalContent={setShowModalContent} />
      ) : (
        showModalContent === 'CHALLENGE' && (
          <ChallengeModal setShowModalContent={setShowModalContent} />
        )
      )}
    </div>
  );
};

export default ProgramInfoModalGroup;
