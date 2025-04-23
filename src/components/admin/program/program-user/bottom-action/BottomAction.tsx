import { ChallengeApplication, LiveApplication } from '@/schema';
import ChallengeActionDropdown from './ChallengeActionDropdown';
import GeneralActionDropdown from './GeneralActionDropdown';

interface Props {
  applications: (ChallengeApplication['application'] | LiveApplication)[];
  programType: string;
  programTitle: string;
}

const BottomAction = ({ applications, programType, programTitle }: Props) => {
  return (
    <div className="fixed bottom-12 left-[250px] flex w-[calc(100vw-250px)] items-center justify-center gap-4">
      {programType === 'CHALLENGE' && (
        // TODO: typing
        <ChallengeActionDropdown
          applications={applications as ChallengeApplication['application'][]}
        />
      )}
      <GeneralActionDropdown
        applications={applications}
        programTitle={programTitle}
      />
    </div>
  );
};

export default BottomAction;
