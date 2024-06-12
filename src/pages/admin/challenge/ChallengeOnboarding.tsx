import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import OnboardingDropdown from '../../../components/admin/challenge/onboarding/OnboardingDropdown';
import { IProgram } from '../../../interfaces/Program.interface';

const ChallengeOnboarding = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedChallenge, setSelectedChallenge] = useState<IProgram | null>(null);

  // const handleConfirmButtonClick = () => {
  //   localStorage.setItem('admin-challenge-id', `${selectedChallenge.id}`);
  //   queryClient.invalidateQueries({ queryKey: ['program'] });
  //   navigate(`/admin/challenge/${selectedChallenge.id}`);
  // };

  return (
    <main className="flex h-full flex-col items-center justify-center">
      <h1 className="text-xl font-semibold">챌린지 기수를 선택해주세요.</h1>
      {selectedChallenge && (
        <p className="mt-2 text-neutral-grey">{selectedChallenge.programInfo.title}</p>
      )}
      <OnboardingDropdown
        className="mt-4"
        selectedChallenge={selectedChallenge}
        setSelectedChallenge={setSelectedChallenge}
      />
      {/* <button
        className="mt-4 rounded bg-primary px-4 py-2 font-medium text-white"
        onClick={handleConfirmButtonClick}
      >
        확인
      </button> */}
    </main>
  );
};

export default ChallengeOnboarding;
