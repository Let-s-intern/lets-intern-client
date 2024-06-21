import GeneralActionDropdown from './GeneralActionDropdown';
import ChallengeActionDropdown from './ChallengeActionDropdown';

interface Props {
  applications: any;
  programType: string;
  programTitle: string;
}

const BottomAction = ({ applications, programType, programTitle }: Props) => {
  return (
    <div className="fixed bottom-12 left-[250px] flex w-[calc(100vw-250px)] items-center justify-center gap-4">
      {programType === 'CHALLENGE' && (
        <ChallengeActionDropdown applications={applications} />
      )}
      <GeneralActionDropdown
        applications={applications}
        programTitle={programTitle}
      />
    </div>
  );
};

export default BottomAction;
