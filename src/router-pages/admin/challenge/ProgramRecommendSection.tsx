/* eslint-disable no-console */
import { useChallelngeQuery, usePatchChallengeMutation } from '@/api/program';
import { ChallengeContent } from '@/types/interface';
import ProgramRecommendEditor from '@components/ProgramRecommendEditor';
import { Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProgramRecommendSection() {
  const params = useParams();
  const programId = Number(params.programId);

  const { data: challenge } = useChallelngeQuery(programId);
  const { mutateAsync: patchChallenge } = usePatchChallengeMutation();

  const descJson = useMemo<ChallengeContent | null>(() => {
    if (!challenge?.desc) return null;
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [challenge?.desc]);

  const [programRecommend, setProgramRecommend] = useState(
    descJson?.operationRecommendProgram ?? { list: [] },
  );

  const handleSave = async () => {
    const newDescJson = {
      ...descJson,
      operationRecommendProgram: programRecommend,
    };
    const request = {
      challengeId: programId,
      desc: JSON.stringify(newDescJson),
    };
    await patchChallenge(request);
  };

  useEffect(() => {
    /** init data */
    setProgramRecommend(descJson?.operationRecommendProgram ?? { list: [] });
  }, [descJson?.operationRecommendProgram]);

  return (
    <div className="flex flex-col">
      <ProgramRecommendEditor
        programRecommend={programRecommend}
        setProgramRecommend={setProgramRecommend}
      />
      <div className="mt-4 text-right">
        <Button variant="contained" onClick={handleSave}>
          저장
        </Button>
      </div>
    </div>
  );
}

export default ProgramRecommendSection;
