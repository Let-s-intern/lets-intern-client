import { fileType, uploadFile } from '@/api/file';
import { usePostChallengeMutation } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { challengeToCreateInput } from '@/hooks/useDuplicateProgram';
import { CreateChallengeReq, getChallengeIdSchema } from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengePreviewButton from '@components/admin/ChallengePreviewButton';
import EditorApp from '@components/admin/lexical/EditorApp';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import Heading3 from '@components/admin/ui/heading/Heading3';
import { Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChallengeBasic from './program/ChallengeBasic';
import ChallengeCurriculum from './program/ChallengeCurriculum';
import ChallengePoint from './program/ChallengePoint';
import ChallengePrice from './program/ChallengePrice';
import FaqSection from './program/FaqSection';
import ProgramBestReview from './program/ProgramBestReview';
import ProgramBlogReviewEditor from './program/ProgramBlogReviewEditor';
import ProgramRecommendEditor from './program/ProgramRecommendEditor';
import ProgramSchedule from './program/ProgramSchedule';

/**
 * 챌린지 생성 페이지
 *
 * - 가격구분은 무조건 BASIC으로 고정
 */
const ChallengeCreate: React.FC = () => {
  const [content, setContent] = useState<ChallengeContent>({
    curriculum: [],
    challengePoint: { list: [] },
    blogReview: { list: [] },
    challengeReview: [],
    initialized: true,
    programRecommend: { list: [] },
  });
  const { snackbar } = useAdminSnackbar();
  const navigate = useNavigate();

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

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.CHALLENGE,
    });
    setInput((prev) => ({ ...prev, [e.target.name]: url }));
  };

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
    snackbar('챌린지가 생성되었습니다.');
    navigate('/admin/programs');
  }, [input, content, postChallenge, snackbar, navigate]);

  const [importJsonString, setImportJsonString] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);

  if (importProcessing) {
    return <div>Importing...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>챌린지 생성</Heading>
        <div className="flex items-center gap-3">
          <TextField
            size="small"
            label="Export시 복사한 데이터 붙여넣기"
            variant="outlined"
            value={importJsonString}
            onChange={(e) => setImportJsonString(e.target.value)}
          ></TextField>
          <Button
            variant="outlined"
            onClick={() => {
              try {
                const challenge = getChallengeIdSchema.parse(
                  JSON.parse(importJsonString),
                );
                setImportProcessing(true);
                setInput(challengeToCreateInput(challenge));
                setContent(JSON.parse(challenge?.desc ?? '{}'));
                setTimeout(() => {
                  snackbar('Import 성공!');
                  setImportJsonString('');
                  setImportProcessing(false);
                }, 200);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Import
          </Button>
        </div>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <ChallengeBasic
            defaultValue={{
              ...input,
              classificationInfo: input.programTypeInfo.map((info) => ({
                programClassification:
                  info.classificationInfo.programClassification,
              })),
              priceInfo: input.priceInfo.map((info) => ({
                ...info,
                deadline: info.priceInfo.deadline
                  ? dayjs(info.priceInfo.deadline)
                  : null,
                priceId: 0,
              })),
            }}
            setInput={setInput}
          />
          <ImageUpload
            label="챌린지 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail}
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <ChallengePrice
            defaultValue={[
              {
                deadline: dayjs.tz(input.deadline, 'Asia/Seoul'),
                priceId: 0,
                challengeParticipationType:
                  input.priceInfo[0].challengeParticipationType,
                challengeUserType: input.priceInfo[0].challengeUserType,
                challengePriceType: input.priceInfo[0].challengePriceType,
                price: input.priceInfo[0].priceInfo.price,
                discount: input.priceInfo[0].priceInfo.discount,
              },
            ]}
            setInput={setInput}
          />
          <ProgramSchedule
            defaultValue={{
              beginning: dayjs.tz(input.beginning, 'Asia/Seoul'),
              deadline: dayjs.tz(input.deadline, 'Asia/Seoul'),
              endDate: dayjs.tz(input.endDate, 'Asia/Seoul'),
              startDate: dayjs.tz(input.startDate, 'Asia/Seoul'),
            }}
            setInput={setInput}
            onDeadlineChange={(value) => {
              if (!value) {
                return;
              }

              setInput((prev) => ({
                ...prev,
                priceInfo: prev.priceInfo.map((priceInfo) => ({
                  ...priceInfo,
                  priceInfo: {
                    ...priceInfo.priceInfo,
                    deadline: value.format('YYYY-MM-DDTHH:mm'),
                  },
                })),
              }));
            }}
          />
        </div>
      </section>

      <Heading2>프로그램 소개</Heading2>
      <section>
        <ChallengePoint
          challengePoint={content.challengePoint}
          setContent={setContent}
        />

        <Heading3>상세 설명</Heading3>
        <EditorApp
          onChangeSerializedEditorState={(json) =>
            setContent((prev) => ({
              ...prev,
              mainDescription: json,
            }))
          }
        ></EditorApp>
      </section>

      <ProgramRecommendEditor
        programRecommend={content.programRecommend ?? { list: [] }}
        setProgramRecommend={(programRecommend) =>
          setContent((prev) => ({ ...prev, programRecommend }))
        }
      />

      <ChallengeCurriculum
        curriculum={content.curriculum}
        setContent={setContent}
      />

      <ProgramBestReview
        reviewFields={content.challengeReview ?? []}
        setReviewFields={(reviewFields) =>
          setContent((prev) => ({ ...prev, challengeReview: reviewFields }))
        }
      />

      <ProgramBlogReviewEditor
        blogReview={content.blogReview || { list: [] }}
        setBlogReview={(blogReview) =>
          setContent((prev) => ({ ...prev, blogReview }))
        }
      />

      <div className="my-6">
        <FaqSection
          programType="CHALLENGE"
          faqInfo={input.faqInfo}
          setInput={setInput}
          isCreate
        />
      </div>

      <footer className="flex items-center justify-end gap-3">
        <ChallengePreviewButton
          input={input}
          content={content}
          existing={null}
        />
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
