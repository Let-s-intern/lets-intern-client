'use client';

import { fileType, uploadFile } from '@/api/file';
import { usePostLiveMutation } from '@/api/program';
import LivePreviewButton from '@/domain/admin/LivePreviewButton';
import LiveCurriculum from '@/domain/admin/program/live/LiveCurriculum';
import LiveMentor from '@/domain/admin/program/live/LiveMentor';
import LivePrice from '@/domain/admin/program/live/LivePrice';
import LiveBasic from '@/domain/admin/program/live/LiveBasic';
import { applySeomyeonDefaults } from '@/domain/admin/program/live/seomyeon/applySeomyeonDefaults';
import { validateCreateLiveReq } from '@/domain/admin/program/live/seomyeon/validateCreateLiveReq';
import ProgramBestReview from '@/domain/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/domain/admin/program/ProgramBlogReviewEditor';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import FaqSection from '@/domain/faq/FaqSection';
import ProgramRecommendEditor from '@/domain/program-recommend/ProgramRecommendEditor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { liveToCreateInput } from '@/hooks/useDuplicateProgram';
import dayjs from '@/lib/dayjs';
import { CreateLiveReq, getLiveIdSchema, ProgramTypeEnum } from '@/schema';
import { LiveContent } from '@/types/interface';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import ProgramSchedule from './program/ProgramSchedule';

const LiveInformation = dynamic(
  () => import('@/domain/admin/program/live/LiveInformation'),
  { ssr: false },
);

const EditorApp = dynamic(() => import('@/common/lexical/EditorApp'), {
  ssr: false,
});

// PRD-서면라이브 분리 §5.1/§5.2 — 동일 폼을 라이브/서면으로 분기 진입.
// type 은 페이지 타이틀 및 LiveBasic/LivePrice/LiveMentor variant 분기에 사용.
export type LiveCreateProgramType = 'LIVE' | 'SEOMYEON';

interface LiveCreateProps {
  type?: LiveCreateProgramType;
  titleOverride?: string;
}

const LiveCreate: React.FC<LiveCreateProps> = ({
  type = 'LIVE',
  titleOverride,
}) => {
  const router = useRouter();
  const { snackbar } = useAdminSnackbar();
  const pageTitle = titleOverride ?? (type === 'SEOMYEON' ? '서면 생성' : '라이브 생성');
  const successMessage =
    type === 'SEOMYEON' ? '서면이 생성되었습니다.' : '라이브가 생성되었습니다.';

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<LiveContent>({
    initialized: true,
    recommend: [''],
    reason: [{ title: '', content: '' }],
    curriculumTitle: '',
    curriculum: [],
    blogReview: { list: [] },
  });

  const [input, setInput] = useState<Omit<CreateLiveReq, 'desc'>>({
    title: '',
    shortDesc: '',
    criticalNotice: '',
    participationCount: 0,
    thumbnail: '',
    desktopThumbnail: '',
    mentorName: '',
    mentorImg: '',
    mentorCompany: '',
    mentorJob: '',
    mentorCareer: '',
    mentorIntroduction: '',
    job: '',
    place: '',
    vod: false,
    startDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    endDate: dayjs().format('YYYY-MM-DDTHH:mm'),
    beginning: dayjs().format('YYYY-MM-DDTHH:mm'),
    deadline: dayjs().format('YYYY-MM-DDTHH:mm'),
    progressType: 'ALL',
    programTypeInfo: [],
    adminProgramTypeInfo: [],
    priceInfo: {
      priceInfo: {
        price: 0,
        discount: 0,
        accountNumber: '',
        deadline: dayjs().format('YYYY-MM-DDTHH:mm'),
        accountType: 'KB',
      },
      livePriceType: 'CHARGE',
    },
    faqInfo: [],
  });

  const { mutateAsync: postLive } = usePostLiveMutation();

  const onChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const url = await uploadFile({
      file: e.target.files[0],
      type: fileType.enum.LIVE,
    });
    setInput((prev) => ({ ...prev, [e.target.name]: url }));
  };

  const onClickSave = useCallback(async () => {
    // PRD §5.2 — variant 별 검증 (LIVE: progressType 필수 / SEOMYEON: optional)
    const validationErrors = validateCreateLiveReq(input, type);
    if (validationErrors.length > 0) {
      snackbar(validationErrors.join(' / '));
      return;
    }
    setLoading(true);
    // PRD §5.3 — 서면 모드에서는 programTypeInfo 에 DOCUMENT_PREPARATION 자동 포함
    const normalizedInput =
      type === 'SEOMYEON' ? applySeomyeonDefaults(input) : input;
    const req: CreateLiveReq = {
      ...normalizedInput,
      desc: JSON.stringify(content),
    };
    console.log('req:', req);

    const res = await postLive(req);
    console.log('res:', res);

    setLoading(false);
    snackbar(successMessage);
    router.push('/admin/programs');
  }, [type, input, content, postLive, snackbar, router, successMessage]);

  const [importJsonString, setImportJsonString] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);

  if (importProcessing) {
    return <div>Importing...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>{pageTitle}</Heading>
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
                const live = getLiveIdSchema.parse(
                  JSON.parse(importJsonString),
                );
                setImportProcessing(true);
                setInput(liveToCreateInput(live));
                setContent(JSON.parse(live?.desc ?? '{}'));
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

      <div className="mb-6 mt-3 grid w-full grid-cols-2 gap-3">
        {/* 기본 정보 */}
        <section>
          <Heading2 className="mb-3">기본 정보</Heading2>
          <LiveBasic
            defaultValue={{
              ...input,
              classificationInfo: input.programTypeInfo.map(
                (info) => info.classificationInfo,
              ),
              adminClassificationInfo: input.adminProgramTypeInfo.map(
                (info) => info.classificationInfo,
              ),
            }}
            setInput={setInput as any}
            type={type}
          />
        </section>
        {/* 가격 정보 & 일정 */}
        <section className="flex flex-col gap-3">
          <Heading2>가격 정보 & 일정</Heading2>
          <LivePrice
            defaultValue={{
              deadline: dayjs.tz(
                input.priceInfo.priceInfo.deadline,
                'Asia/Seoul',
              ),
              discount: input.priceInfo.priceInfo.discount,
              price: input.priceInfo.priceInfo.price,
              accountNumber: input.priceInfo.priceInfo.accountNumber,
              accountType: input.priceInfo.priceInfo.accountType,
              priceId: 0,
              livePriceType: input.priceInfo.livePriceType,
            }}
            setInput={setInput as any}
            type={type}
          />
          <ProgramSchedule
            defaultValue={{
              beginning: dayjs.tz(input.beginning, 'Asia/Seoul'),
              deadline: dayjs.tz(input.deadline, 'Asia/Seoul'),
              endDate: dayjs.tz(input.endDate, 'Asia/Seoul'),
              startDate: dayjs.tz(input.startDate, 'Asia/Seoul'),
            }}
            onDeadlineChange={(value) => {
              if (!value) {
                return;
              }

              setInput((prev) => ({
                ...prev,
                priceInfo: {
                  ...prev.priceInfo,
                  priceInfo: {
                    ...prev.priceInfo.priceInfo,
                    deadline: value.format('YYYY-MM-DDTHH:mm'),
                  },
                },
              }));
            }}
            setInput={setInput as any}
          />
          <FormControlLabel
            defaultChecked={input.vod}
            control={<Checkbox />}
            label="VOD 제공 여부"
            labelPlacement="start"
            onChange={(event, checked) =>
              setInput((prev) => ({ ...prev, vod: checked }))
            }
          />
        </section>
      </div>

      {/* 썸네일 */}
      <section className="mb-6 max-w-[1120px]">
        <Heading2 className="mb-3">썸네일</Heading2>
        <div className="flex gap-3">
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
      </section>

      {/* 멘토 정보 */}
      <section className="mb-6 max-w-[1120px]">
        <Heading2>멘토 정보</Heading2>
        <div className="mt-3 flex gap-3">
          <div className="max-w-md">
            <ImageUpload
              label="멘토 사진"
              id="mentorImg"
              name="mentorImg"
              image={input.mentorImg}
              onChange={onChangeImage}
            />
          </div>
          <LiveMentor
            defaultValue={input}
            setInput={setInput as any}
            type={type}
          />
        </div>
      </section>

      {/* 프로그램 소개 */}
      <LiveInformation
        recommendFields={content.recommend ?? []}
        reasonFields={content.reason ?? [{ title: '', content: '' }]}
        setContent={setContent}
      />

      {/* 프로그램 추천 */}
      <section className="mb-6">
        <ProgramRecommendEditor
          programRecommend={content.programRecommend ?? { list: [] }}
          setProgramRecommend={(programRecommend) =>
            setContent((prev) => ({ ...prev, programRecommend }))
          }
        />
      </section>

      <LiveCurriculum
        curriculum={content.curriculum}
        curriculumTitle={content.curriculumTitle}
        setContent={setContent}
      />

      <Heading2 className="mt-6">커리큘럼 추가 입력</Heading2>
      <EditorApp
        onChangeSerializedEditorState={(json) =>
          setContent((prev) => ({
            ...prev,
            additionalCurriculum: json,
          }))
        }
      />
      <ProgramBestReview
        reviewFields={content.liveReview ?? []}
        setReviewFields={(reviewFields) =>
          setContent((prev) => ({ ...prev, liveReview: reviewFields }))
        }
      />
      <ProgramBlogReviewEditor
        blogReview={content.blogReview ?? { list: [] }}
        setBlogReview={(blogReview) =>
          setContent((prev) => ({ ...prev, blogReview }))
        }
      />
      <div className="my-6">
        <FaqSection
          programType={ProgramTypeEnum.enum.LIVE}
          faqInfo={input.faqInfo}
          setFaqInfo={(faqInfo) =>
            setInput((prev) => ({ ...prev, faqInfo: faqInfo ?? [] }))
          }
          isCreate
        />
      </div>

      <footer className="flex items-center justify-end gap-3">
        <LivePreviewButton input={input} existing={null} content={content} />
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

export default LiveCreate;
