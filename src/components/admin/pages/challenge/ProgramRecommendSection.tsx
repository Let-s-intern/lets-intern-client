/* eslint-disable no-console */
import { useChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  ChallengeContent,
  OperationRecommendMoreButton,
  ProgramRecommend,
} from '@/types/interface';
import MoreButtonSection from '@components/admin/ui/section/MoreButtonSection';
import ProgramRecommendEditor from '@components/ProgramRecommendEditor';
import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const defaultMoreButton: OperationRecommendMoreButton = {
  visible: false,
  url: '',
};

const defaultPrograms: ProgramRecommend = { list: [] };

function ProgramRecommendSection() {
  const params = useParams<{ programId: string }>();
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

  const [programRecommend, setProgramRecommend] = useState(defaultPrograms);
  const [moreButton, setMoreButton] = useState(defaultMoreButton);

  const handleSave = async () => {
    const newDescJson = {
      ...descJson,
      operationRecommendProgram: programRecommend,
      operationRecommendMoreButton: moreButton,
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

    setProgramRecommend(descJson?.operationRecommendProgram ?? defaultPrograms);
    setMoreButton(descJson?.operationRecommendMoreButton ?? defaultMoreButton);
  }, [isLoading, descJson]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <ProgramRecommendEditor
          programRecommend={programRecommend}
          setProgramRecommend={setProgramRecommend}
        />
        <MoreButtonSection
          checked={moreButton?.visible}
          url={moreButton?.url}
          onChangeCheckbox={(value) => {
            setMoreButton((prev) => ({ ...prev, visible: value }));
          }}
          onChangeUrl={(url) => {
            setMoreButton((prev) => ({ ...prev, url }));
          }}
        />
      </div>
      <Button variant="contained" onClick={handleSave}>
        저장
      </Button>
    </div>
  );
}

export default ProgramRecommendSection;
