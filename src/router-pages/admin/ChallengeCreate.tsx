import { useGetChallengeOptions } from '@/api/challengeOption';
import { fileType, uploadFile } from '@/api/file';
import { usePostChallengeMutation } from '@/api/program';
import ChallengeBasic from '@/components/admin/program/ChallengeBasic';
import ChallengeCurriculum from '@/components/admin/program/ChallengeCurriculum';
import ChallengePoint from '@/components/admin/program/ChallengePoint';
import ChallengePrice from '@/components/admin/program/ChallengePrice';
import ProgramBestReview from '@/components/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/components/admin/program/ProgramBlogReviewEditor';
import FaqSection from '@/components/FaqSection';
import ProgramRecommendEditor from '@/components/ProgramRecommendEditor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { challengeToCreateInput } from '@/hooks/useDuplicateProgram';
import dayjs from '@/lib/dayjs';
import {
  CreateChallengeReq,
  getChallengeIdSchema,
  ProgramTypeEnum,
} from '@/schema';
import { ChallengeContent } from '@/types/interface';
import ChallengePreviewButton from '@components/admin/ChallengePreviewButton';
import EditorApp from '@components/admin/lexical/EditorApp';
import ChallengeOptionSection from '@components/admin/program/ChallengeOptionSection';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import Heading2 from '@components/admin/ui/heading/Heading2';
import Heading3 from '@components/admin/ui/heading/Heading3';
import { Button, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChallengeFaqCategory from './program/ChallengeFaqCategory';
import ProgramSchedule from './program/ProgramSchedule';

/**
 * 챌린지 생성 페이지
 */

const ChallengeCreate: React.FC = () => {
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();

  /** 챌린지 */
  const { mutateAsync: postChallenge } = usePostChallengeMutation();

  const [content, setContent] = useState<ChallengeContent>({
    curriculum: [],
    challengePoint: { list: [] },
    blogReview: { list: [] },
    challengeReview: [],
    initialized: true,
    faqCategory: [],
    programRecommend: { list: [] },
  });

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
    adminProgramTypeInfo: [],
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
  const [importJsonString, setImportJsonString] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);

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

  /** 옵션 설정 */
  const { data: challengeOptions } = useGetChallengeOptions();

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
              adminClassificationInfo: input.adminProgramTypeInfo.map(
                (info) => ({
                  programAdminClassification:
                    info.classificationInfo.programAdminClassification,
                }),
              ),
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
            defaultPricePlan="베이직"
            options={challengeOptions?.challengeOptionList ?? []}
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

      <section className="pb-8 pt-4">
        <ChallengeOptionSection
          options={challengeOptions?.challengeOptionList ?? []}
        />
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
        />
      </section>

      {/* 프로그램 추천 */}
      <section className="mb-6">
        <ProgramRecommendEditor
          programRecommend={content.programRecommend ?? { list: [] }}
          setProgramRecommend={(programRecommend) =>
            setContent((prev) => ({ ...prev, programRecommend }))
          }
        />
      </section>

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

      <section className="my-6">
        <div className="mb-6">
          <ChallengeFaqCategory
            faqCategory={content.faqCategory}
            onChange={(e) => {
              setContent((prev) => ({
                ...prev,
                faqCategory: e.target.value
                  .split(',')
                  .map((item) => item.trim()),
              }));
            }}
          />
        </div>
        <FaqSection
          programType={ProgramTypeEnum.enum.CHALLENGE}
          faqInfo={input.faqInfo}
          setFaqInfo={(faqInfo) =>
            setInput((prev) => ({ ...prev, faqInfo: faqInfo ?? [] }))
          }
          isCreate
        />
      </section>

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
