import GeneralActionDropdown from './GeneralActionDropdown';
import ChallengeActionDropdown from './ChallengeActionDropdown';

interface Props {
  program: any;
  sizePerPage: number;
  maxPage: number;
}

const BottomAction = ({ program, sizePerPage, maxPage }: Props) => {
  if (!program.type) {
    return <></>;
  }

  return (
    <div className="fixed bottom-12 left-[250px] flex w-[calc(100vw-250px)] items-center justify-center gap-4">
      {(program.type === 'CHALLENGE_FULL' ||
        program.type === 'CHALLENGE_HALF') && <ChallengeActionDropdown />}
      <GeneralActionDropdown
        program={program}
        sizePerPage={sizePerPage}
        maxPage={maxPage}
      />
    </div>
  );
};

export default BottomAction;
