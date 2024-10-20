import { useGetChallengeQuery, usePatchChallengeMutation } from '@/api/program';
import isDeprecatedProgram from '@/lib/isDeprecatedProgram';
import {
  ChallengeType,
  UpdateChallengeReq,
  UpdateChallengeUpdatePriceInfoReq,
} from '@/schema';
import { ChallengeContent } from '@/types/interface';
import {
  challengeTypes,
  challengeTypeToText,
  programParticipationTypeToText,
} from '@/utils/convert';
import EditorApp from '@components/admin/lexical/EditorApp';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const ChallengeEdit: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    curriculum: '',
    curriculumDesc: '',
    blogReview: '',
    challengeReview: '',
  });

  const { mutateAsync: patchChallenge } = usePatchChallengeMutation();
  const navigate = useNavigate();
  const { challengeId: challengeIdString } = useParams();

  const { data: challenge } = useGetChallengeQuery({
    challengeId: Number(challengeIdString),
    enabled: Boolean(challengeIdString),
  });

  const receivedContent = useMemo<ChallengeContent>(() => {
    if (!challenge?.desc) {
      return {};
    }
    try {
      return JSON.parse(challenge.desc);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, [challenge?.desc]);

  useEffect(() => {
    if (challenge && isDeprecatedProgram(challenge)) {
      navigate(
        `/admin/programs/${challengeIdString}/edit?programType=CHALLENGE`,
        {
          replace: true,
        },
      );
    }
  }, [challenge, challengeIdString, navigate]);

  const [input, setInput] = useState<Omit<UpdateChallengeReq, 'desc'>>({});

  const [loading, setLoading] = useState(false);

  const onClickSave = useCallback(async () => {
    if (!challengeIdString) {
      throw new Error('challengeId is required');
    }

    setLoading(true);
    const req: Parameters<typeof patchChallenge>[0] = {
      ...input,
      challengeId: Number(challengeIdString),
      desc: JSON.stringify(content),
    };

    const res = await patchChallenge(req);
    console.log('res', res);

    setLoading(false);
  }, [challengeIdString, content, input, patchChallenge]);

  if (!challenge) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>챌린지 생성</Heading>
      </Header>

      <div className="mb-3 flex gap-6">
        <div className="flex flex-1 flex-col gap-3">
          <FormControl fullWidth size="small">
            <InputLabel>챌린지 구분</InputLabel>
            <Select
              label="챌린지 구분"
              value={input.challengeType}
              onChange={(e) => {
                setInput({
                  ...input,
                  challengeType: e.target.value as ChallengeType,
                });
              }}
            >
              {challengeTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {challengeTypeToText[type]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl fullWidth>
          <InputLabel>가격 구분</InputLabel>
          <Select
            label="가격 구분"  
            value={input.priceInfo[0].challengeUserType}
            onChange={(e) => {
              setInput({
                ...input,
                priceInfo: [
                  {
                    ...input.priceInfo[0],
                    challengeUserType: e.target.value as ChallengeUserType,
                  },
                ],
              });
            }}
          >
            {programPriceTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {programPriceTypeToText[type]}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
          <FormControl fullWidth>
            <InputLabel>참여 형태</InputLabel>
            <Select
              label="참여 형태"
              size="small"
              defaultValue={challenge.priceInfo[0]?.challengeParticipationType}
              onChange={(e) => {
                setInput((prev) => ({
                  ...prev,
                  priceInfo: [
                    {
                      ...prev.priceInfo?.[0],
                      challengeParticipationType: e.target.value,
                    } as UpdateChallengeUpdatePriceInfoReq,
                  ],
                }));
              }}
            >
              {Object.keys(programParticipationTypeToText).map(
                (type: string) => (
                  <MenuItem key={type} value={type}>
                    {programParticipationTypeToText[type]}
                  </MenuItem>
                ),
              )}
            </Select>
          </FormControl>
        </div>
        <div className="flex-1">썸네일</div>
      </div>
      <h2>프로그램 소개</h2>
      <section>
        <header>
          <h3>상세 설명</h3>
        </header>
        <main>
          <EditorApp
            initialEditorStateJsonString={JSON.stringify(
              receivedContent.mainDescription,
            )}
            onChangeSerializedEditorState={(json) =>
              setContent((prev) => ({
                ...prev,
                mainDescription: json,
              }))
            }
          />
        </main>
      </section>
      <footer className="flex items-center justify-end gap-3">
        <Button
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={<FaSave size={12} />}
          onClick={onClickSave}
        >
          저장
        </Button>
      </footer>
    </div>
  );
};

export default ChallengeEdit;
