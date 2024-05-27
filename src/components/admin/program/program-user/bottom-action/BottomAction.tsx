import GeneralActionDropdown from './GeneralActionDropdown';
import ChallengeActionDropdown from './ChallengeActionDropdown';

interface Props {
  applications: any;
  program: any;
}

const BottomAction = ({ applications, program }: Props) => {
  if (!program.type) {
    return <></>;
  }

  return (
    <div className="fixed bottom-12 left-[250px] flex w-[calc(100vw-250px)] items-center justify-center gap-4">
      {(program.type === 'CHALLENGE_FULL' ||
        program.type === 'CHALLENGE_HALF') && <ChallengeActionDropdown />}
      <GeneralActionDropdown applications={applications} program={program} />
    </div>
  );
};

export default BottomAction;
