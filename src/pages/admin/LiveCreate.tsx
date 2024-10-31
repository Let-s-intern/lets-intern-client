import { Button, Checkbox, FormControlLabel } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { fileType, uploadFile } from '@/api/file';
import { usePostLiveMutation } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { CreateLiveReq } from '@/schema';
import { LiveContent } from '@/types/interface';
import EditorApp from '@components/admin/lexical/EditorApp';
import LivePreviewButton from '@components/admin/LivePreviewButton';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import FaqSection from './program/FaqSection';
import LiveBasic from './program/LiveBasic';
import LiveCurriculum from './program/LiveCurriculum';
import LiveMentor from './program/LiveMentor';
import LivePrice from './program/LivePrice';
import ProgramBlogReviewEditor from './program/ProgramBlogReviewEditor';
import ProgramSchedule from './program/ProgramSchedule';
const LiveCreate: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<LiveContent>({
    initialized: true,
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
    snackbar('저장되었습니다.');
    navigate('/admin/programs');
  }, [input, content]);

  useEffect(() => {
    console.log('content', content);
  }, [content]);

  useEffect(() => {
    console.log('input', input);
  }, [input]);

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>라이브 생성</Heading>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <LiveBasic setInput={setInput} />
          <ImageUpload
            label="라이브 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-start gap-6">
            <LivePrice setInput={setInput} />
            <ProgramSchedule setInput={setInput} />
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
              onChange={onChangeImage}
            />
            <LiveMentor defaultValue={input} setInput={setInput} />
          </div>
        </div>
      </section>

      <LiveCurriculum curriculum={content.curriculum} setContent={setContent} />

      <Heading2 className="mt-6">커리큘럼 추가 입력</Heading2>
      <EditorApp
        onChangeSerializedEditorState={(json) =>
          setContent((prev) => ({
            ...prev,
            additionalCurriculum: json,
          }))
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
          programType="LIVE"
          faqInfo={input.faqInfo}
          setInput={setInput}
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
