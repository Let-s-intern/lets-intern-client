import { usePostChallengeMutation } from '@/api/program';
import {
  ChallengeParticipationType,
  ChallengeType,
  CreateChallengeReq,
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
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';

/**
 * 챌린지 생성 페이지
 *
 * - 가격구분은 무조건 BASIC으로 고정
 */
const ChallengeCreate: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    // mainDescription: ,
    curriculum: '',
    curriculumDesc: '',
    blogReview: '',
    challengeReview: '',
  });

  useEffect(() => {
    console.log('content', content);
  }, [content]);

  const { mutateAsync: postChallenge } = usePostChallengeMutation();

  const [input, setInput] = useState<Omit<CreateChallengeReq, 'desc'>>({
    beginning: dayjs().format('YYYY-MM-DDTHH:mm'),
    challengeType: 'CAREER_START',
    chatLink: '',
    chatPassword: '',
    criticalNotice: '',
    deadline: dayjs().format('YYYY-MM-DDTHH:mm'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    faqInfo: [],
    participationCount: 0,
    programTypeInfo: [],
    priceInfo: [
      {
        priceInfo: {
          price: 10000,
          discount: 4000,
        },
        charge: 10000,
        refund: 0,
        challengePriceType: 'CHARGE',
        challengeUserType: 'BASIC',
        challengeParticipationType: 'LIVE',
      },
    ],
    shortDesc: '',
    startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    thumbnail: '',
    title: '',
  });

  const [loading, setLoading] = useState(false);

  const onClickSave = useCallback(async () => {
    setLoading(true);
    const req: CreateChallengeReq = {
      ...input,
      desc: JSON.stringify(content),
    };
    console.log('req', req);
    const res = await postChallenge(req);
    console.log('res', res);

    setLoading(false);
  }, []);

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
              defaultValue={input.challengeType}
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
              defaultValue={input.priceInfo[0].challengeParticipationType}
              onChange={(e) => {
                setInput({
                  ...input,
                  priceInfo: [
                    {
                      ...input.priceInfo[0],
                      challengeParticipationType: e.target
                        .value as ChallengeParticipationType,
                    },
                  ],
                });
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
            onChangeSerializedEditorState={(json) =>
              setContent((prev) => ({
                ...prev,
                mainDescription: json,
              }))
            }
          ></EditorApp>
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

export default ChallengeCreate;
