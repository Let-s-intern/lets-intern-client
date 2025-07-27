/* eslint-disable no-console */
import { useChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { ChallengeContent } from '@/types/interface';
import MoreButtonSection from '@components/admin/ui/MoreButtonSection';
import ProgramRecommendEditor from '@components/ProgramRecommendEditor';
import { Button } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProgramRecommendSection() {
  const params = useParams();
  const programId = Number(params.programId);

  const { snackbar } = useAdminSnackbar();

  const { data: challenge, isLoading } = useChallengeQuery(programId);
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

  const moreRef = useRef(
    descJson?.operationRecommendProgram?.moreButton ?? {
      visible: false,
      url: '',
    },
  );

  const [programRecommend, setProgramRecommend] = useState(
    descJson?.operationRecommendProgram ?? { list: [] },
  );

  const handleSave = async () => {
    const newDescJson = {
      ...descJson,
      operationRecommendProgram: {
        ...programRecommend,
        moreButton: moreRef.current,
      },
    };
    const request = {
      challengeId: programId,
      desc: JSON.stringify(newDescJson),
    };

    try {
      await patchChallenge(request);
      snackbar('저장되었습니다');
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  useEffect(() => {
    /** init data */
    if (isLoading) return;

    setProgramRecommend(descJson?.operationRecommendProgram ?? { list: [] });
  }, [descJson?.operationRecommendProgram, isLoading]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <ProgramRecommendEditor
          programRecommend={programRecommend}
          setProgramRecommend={setProgramRecommend}
        />
        <MoreButtonSection
          defaultChecked={programRecommend.moreButton?.visible}
          defaultUrl={programRecommend.moreButton?.url}
          onChangeCheckbox={(value) => (moreRef.current.visible = value)}
          onChangeUrl={(url) => (moreRef.current.url = url)}
        />
      </div>
      <Button variant="contained" onClick={handleSave}>
        저장
      </Button>
    </div>
  );
}

export default ProgramRecommendSection;
