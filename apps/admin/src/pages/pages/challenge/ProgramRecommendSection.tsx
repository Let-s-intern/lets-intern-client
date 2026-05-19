import { useChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import MoreButtonSection from '@/domain/admin/ui/section/MoreButtonSection';
import CurationCardPreview from '@/domain/program-recommend/ui/CurationCardPreview';
import ProgramRecommendEditor from '@/domain/program-recommend/ProgramRecommendEditor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import {
  ChallengeContent,
  OperationRecommendMoreButton,
  ProgramRecommend,
} from '@/types/interface';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

const defaultMoreButton: OperationRecommendMoreButton = {
  visible: false,
  url: '',
};

const defaultPrograms: ProgramRecommend = { list: [] };

const defaultCurationCard = { visible: true };

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
  const [curationCard, setCurationCard] = useState(defaultCurationCard);

  const handleSave = async () => {
    const newDescJson = {
      ...descJson,
      operationRecommendProgram: programRecommend,
      operationRecommendMoreButton: moreButton,
      curationCard,
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
    setCurationCard(descJson?.curationCard ?? defaultCurationCard);
  }, [isLoading, descJson]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <ProgramRecommendEditor
          programRecommend={programRecommend}
          setProgramRecommend={setProgramRecommend}
          maxCount={curationCard.visible ? 2 : undefined}
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
      <div className="mb-4">
        <FormControlLabel
          control={
            <Checkbox
              checked={curationCard.visible}
              onChange={(e) =>
                setCurationCard({ visible: e.target.checked })
              }
            />
          }
          label="큐레이션 카드 노출 (기본 켜짐)"
        />
        <Typography variant="caption" color="text.secondary" component="p">
          추천 프로그램 슬라이더 마지막 슬롯에 &lsquo;맞춤 챌린지 탐색
          큐레이션&rsquo; 카드를 노출합니다. 추천 프로그램을 3개 모두 채우려면
          이 옵션을 꺼주세요.
        </Typography>
        <div className="mt-3">
          <CurationCardPreview />
        </div>
      </div>
      <Button variant="contained" onClick={handleSave}>
        저장
      </Button>
    </div>
  );
}

export default ProgramRecommendSection;
