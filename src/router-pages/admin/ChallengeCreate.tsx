/* eslint-disable no-console */

import { fileType, uploadFile } from '@/api/file';
import { usePostAdminChallengeMentor } from '@/api/mentor';
import { usePostChallengeMutation } from '@/api/program';
import ChallengeBasic from '@/components/admin/program/ChallengeBasic';
import ChallengeCurriculum from '@/components/admin/program/ChallengeCurriculum';
import ChallengePoint from '@/components/admin/program/ChallengePoint';
import ChallengePrice from '@/components/admin/program/ChallengePrice';
import ProgramBestReview from '@/components/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/components/admin/program/ProgramBlogReviewEditor';
import FaqSection from '@/components/FaqSection';
import ProgramRecommendEditor from '@/components/ProgramRecommendEditor';
import useAdminChallenge from '@/hooks/useAdminChallenge';
import useAdminChallengeOption from '@/hooks/useAdminChallengeOption';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { challengeToCreateInput } from '@/hooks/useDuplicateProgram';
import dayjs from '@/lib/dayjs';
import {
  ChallengePricePlanEnum,
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
import { useCallback, useRef, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChallengeFaqCategory from './program/ChallengeFaqCategory';
import ChallengeMentorRegistrationSection from './program/ChallengeMentorRegistrationSection';
import ProgramSchedule from './program/ProgramSchedule';

const { BASIC, STANDARD, PREMIUM } = ChallengePricePlanEnum.enum;

const initialInput: Omit<CreateChallengeReq, 'desc'> = {
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
        price: 10000, // 챌린지 이용료
        discount: 4000, // 챌린지 할인 금액
      },
      charge: 10000, // 챌린지 이용료
      refund: 0, // 챌린지 보증금
      challengePriceType: 'CHARGE',
      challengePricePlanType: BASIC,
      challengeParticipationType: 'LIVE',
      challengeOptionIdList: [],
      title: '',
    },
  ],
  shortDesc: '',
  startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
  thumbnail: '',
  desktopThumbnail: '',
  title: '',
};

/**
 * 챌린지 생성 페이지
 */
const ChallengeCreate: React.FC = () => {
  const mentorRef = useRef<number[]>([]); // 멘토 리스트
  const navigate = useNavigate();
  const { snackbar } = useAdminSnackbar();

  /** 챌린지  */
  const { mutateAsync: postChallenge } = usePostChallengeMutation();
  const postMentorMutation = usePostAdminChallengeMentor();

  const [content, setContent] = useState<ChallengeContent>({
    curriculum: [],
    challengePoint: { list: [] },
    blogReview: { list: [] },
    challengeReview: [],
    initialized: true,
    faqCategory: [],
    programRecommend: { list: [] },
  });

  const [input, setInput] = useState(initialInput);
  const [loading, setLoading] = useState(false);
  const [importJsonString, setImportJsonString] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);

  const { challengePrice } = useAdminChallenge(input);

  /**  옵션  */
  const {
    pricePlan,
    data: challengeOptions,
    standardOptIds,
    premiumOptIds,
    standardInfo,
    premiumInfo,
    handleChangeInfo,
    handleChangePricePlan,
    setStandardOptIds,
    setPremiumOptIds,
  } = useAdminChallengeOption();

  /** 챌린지 관련 함수 */
  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.CHALLENGE,
    });
    setInput((prev) => ({
      ...prev,
      [e.target.name]: url,
    }));
  };

  const onClickSave = useCallback(async () => {
    setLoading(true);

    const basicPriceInfo = {
      ...input.priceInfo[0],
      priceInfo: {
        ...input.priceInfo[0].priceInfo,
      },
    };

    const newPriceInfo = [basicPriceInfo];

    if (pricePlan.current !== BASIC) {
      newPriceInfo.push({
        ...basicPriceInfo,
        ...standardInfo,
        challengePricePlanType: STANDARD,
        challengeOptionIdList: standardOptIds,
      });
    }

    if (pricePlan.current === PREMIUM) {
      newPriceInfo.push({
        ...basicPriceInfo,
        ...premiumInfo,
        challengePricePlanType: PREMIUM,
        challengeOptionIdList: [
          ...new Set(standardOptIds.concat(premiumOptIds)),
        ],
      });
    }

    const req: CreateChallengeReq = {
      ...input,
      desc: JSON.stringify(content),
      priceInfo: newPriceInfo,
    };
    console.log('req', req);
    const res = await postChallenge(req);
    console.log('res', res);

    setLoading(false);
    snackbar('챌린지가 생성되었습니다.');
    navigate('/admin/programs');
  }, [
    input,
    content,
    postChallenge,
    snackbar,
    navigate,
    premiumOptIds,
    pricePlan,
    premiumInfo,
    standardInfo,
    standardOptIds,
  ]);

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
          />
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
        <div className="mb-6 grid w-full grid-cols-3 gap-3">
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
                // 타입 맞추는 용도
                priceId: 0,
                deadline: null,
                challengeOptionList: [],
              })),
            }}
            setInput={setInput}
          />
          <ImageUpload
            label="모바일 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail}
            onChange={onChangeImage}
          />
          <ImageUpload
            label="데스크탑 썸네일 이미지 업로드"
            id="desktopThumbnail"
            name="desktopThumbnail"
            image={input.desktopThumbnail}
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <ChallengePrice
            challengePrice={challengePrice}
            defaultValue={[
              {
                deadline: dayjs.tz(input.deadline, 'Asia/Seoul'),
                priceId: 0,
                challengeParticipationType:
                  input.priceInfo[0].challengeParticipationType,
                challengePricePlanType:
                  input.priceInfo[0].challengePricePlanType,
                challengePriceType: input.priceInfo[0].challengePriceType,
                price: input.priceInfo[0].priceInfo.price,
                discount: input.priceInfo[0].priceInfo.discount,
                title: '',
                description: '',
                challengeOptionList: [],
              },
            ]}
            setInput={setInput}
            options={challengeOptions?.challengeOptionList ?? []}
            standardOptIds={standardOptIds}
            premiumOptIds={premiumOptIds}
            standardInfo={standardInfo}
            premiumInfo={premiumInfo}
            pricePlan={pricePlan.current}
            onChangePricePlanInfo={handleChangeInfo}
            onChangePremiumOptIds={(ids) => setPremiumOptIds(ids)}
            onChangeStandardOptIds={(ids) => setStandardOptIds(ids)}
            onChangePricePlan={handleChangePricePlan}
          />
          <div className="flex flex-col gap-4">
            {/* 챌린지 일정 */}
            <ProgramSchedule
              defaultValue={{
                beginning: dayjs.tz(input.beginning, 'Asia/Seoul'),
                deadline: dayjs.tz(input.deadline, 'Asia/Seoul'),
                endDate: dayjs.tz(input.endDate, 'Asia/Seoul'),
                startDate: dayjs.tz(input.startDate, 'Asia/Seoul'),
              }}
              setInput={setInput}
              onDeadlineChange={(value) => {
                if (!value) return;

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
            {/* 멘토 등록 */}
            <ChallengeMentorRegistrationSection
              onChange={(value) => (mentorRef.current = value)}
            />
          </div>
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
