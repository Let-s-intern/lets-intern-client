import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import axios from '../../../utils/axios';
import BootcampModal from './BootcampModal';
import ChallengeModal from './ChallengeModal';
import LetsChatModal from './LetsChatModal';

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
    queryFn: async () => {
      const res = await axios.get('/program');
      const { programList } = res.data;
      programList
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
      return res.data;
    },
  });

  useEffect(() => {
    const deactivateScroll = () => {
      document.body.classList.add('non-scroll');
    };

    const activateScroll = () => {
      document.body.classList.remove('non-scroll');
    };

    if (showModalContent === '') {
      activateScroll();
      return;
    }

    deactivateScroll();

    return () => {
      activateScroll();
    };
  }, [showModalContent]);

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
