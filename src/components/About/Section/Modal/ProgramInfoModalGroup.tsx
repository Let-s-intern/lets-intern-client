import { useState } from 'react';
import { useQuery } from 'react-query';

import axios from '../../../../utils/axios';
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
  const [applyAvailableGroup, setApplyAvailableGroup] = useState({
    bootcamp: false,
    challenge: false,
    letsChat: false,
    til: false,
  });
  const [challenge, setChallenge] = useState();

  useQuery({
    queryKey: ['programs'],
    queryFn: async () => axios.get('/program'),
    onSuccess: (res) => {
      res.data.programList
        .filter((program: any) => program.status === 'OPEN')
        .forEach((program: any) => {
          if (
            program.type === 'CHALLENGE_FULL' ||
            program.type === 'CHALLENGE_HALF'
          ) {
            setChallenge(program);
            setApplyAvailableGroup((prev) => ({ ...prev, challenge: true }));
          } else if (program.type === 'BOOTCAMP') {
            setApplyAvailableGroup((prev) => ({ ...prev, bootcamp: true }));
          } else if (program.type === 'LETS_CHAT') {
            setApplyAvailableGroup((prev) => ({ ...prev, letsChat: true }));
          }
        });
      console.log();
    },
  });

  return (
    <div className="program-info-modal-group">
      {showModalContent === 'BOOTCAMP' ? (
        <BootcampModal
          applyAvailable={applyAvailableGroup.bootcamp}
          setShowModalContent={setShowModalContent}
        />
      ) : showModalContent === 'LETS_CHAT' ? (
        <LetsChatModal
          applyAvailable={applyAvailableGroup.letsChat}
          setShowModalContent={setShowModalContent}
        />
      ) : (
        showModalContent === 'CHALLENGE' && (
          <ChallengeModal
            applyAvailable={applyAvailableGroup.challenge}
            challenge={challenge}
            setShowModalContent={setShowModalContent}
          />
        )
      )}
    </div>
  );
};

export default ProgramInfoModalGroup;
