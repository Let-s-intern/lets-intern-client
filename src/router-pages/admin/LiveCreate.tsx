import { fileType, uploadFile } from '@/api/file';
import { usePostLiveMutation } from '@/api/program';
import LiveBasic from '@/components/admin/program/LiveBasic';
import LiveCurriculum from '@/components/admin/program/LiveCurriculum';
import LiveInformation from '@/components/admin/program/LiveInformation';
import LiveMentor from '@/components/admin/program/LiveMentor';
import LivePrice from '@/components/admin/program/LivePrice';
import ProgramBestReview from '@/components/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/components/admin/program/ProgramBlogReviewEditor';
import FaqSection from '@/components/FaqSection';
import ProgramRecommendEditor from '@/components/ProgramRecommendEditor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { liveToCreateInput } from '@/hooks/useDuplicateProgram';
import dayjs from '@/lib/dayjs';
import { CreateLiveReq, getLiveIdSchema, ProgramTypeEnum } from '@/schema';
import { LiveContent } from '@/types/interface';
import EditorApp from '@components/admin/lexical/EditorApp';
import LivePreviewButton from '@components/admin/LivePreviewButton';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import Heading2 from '@components/admin/ui/heading/Heading2';
import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProgramSchedule from './program/ProgramSchedule';
const LiveCreate: React.FC = () => {
  const navigate = useNavigate();

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

  const { snackbar } = useAdminSnackbar();

  const onClickSave = useCallback(async () => {
    setLoading(true);
    const req: CreateLiveReq = {
      ...input,
      desc: JSON.stringify(content),
    };
    console.log('req:', req);

    const res = await postLive(req);
    console.log('res:', res);

    setLoading(false);
    snackbar('라이브가 생성되었습니다.');
    navigate('/admin/programs');
  }, [input, content, postLive, snackbar, navigate]);

  const [importJsonString, setImportJsonString] = useState('');
  const [importProcessing, setImportProcessing] = useState(false);

  if (importProcessing) {
    return <div>Importing...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>라이브 생성</Heading>
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

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
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
            setInput={setInput}
          />
          <ImageUpload
            label="라이브 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail}
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-start gap-6">
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
              setInput={setInput}
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
              setInput={setInput}
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
          </div>
          <div className="flex flex-col gap-3">
            <ImageUpload
              label="멘토 사진"
              id="mentorImg"
              name="mentorImg"
              image={input.mentorImg}
              onChange={onChangeImage}
            />
            <LiveMentor defaultValue={input} setInput={setInput} />
          </div>
        </div>
      </section>
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
