import {
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  SnackbarOrigin,
} from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { fileType, uploadFile } from '@/api/file';
import { usePostLiveMutation } from '@/api/program';
import { CreateLiveReq } from '@/schema';
import { LiveContent } from '@/types/interface';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import { Heading2 } from '@components/admin/ui/heading/Heading2';
import FaqSection from './program/FaqSection';
import LiveBasic from './program/LiveBasic';
import LiveCurriculum from './program/LiveCurriculum';
import LiveMentor from './program/LiveMentor';
import LivePrice from './program/LivePrice';
import LiveSchedule from './program/LiveSchedule';

interface Snack extends SnackbarOrigin {
  open: boolean;
}

const LiveCreate: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<Snack>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const [content, setContent] = useState<LiveContent>({
    // mainDescription: ,
    curriculum: [],
    blogReview: '',
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

  const { vertical, horizontal, open } = snack;

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
    setLoading(true);
    const req: CreateLiveReq = {
      ...input,
      desc: JSON.stringify(content),
    };
    console.log('req:', req);

    const res = await postLive(req);
    console.log('res:', res);

    setLoading(false);
    setSnack((prev) => ({ ...prev, open: true }));
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
          <LiveBasic input={input} setInput={setInput} />
          <ImageUpload
            label="라이브 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-start gap-6">
            <LivePrice input={input} setInput={setInput} />
            <LiveSchedule input={input} setInput={setInput} />
            <FormControlLabel
              value={input.vod}
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
            <LiveMentor input={input} setInput={setInput} />
          </div>
        </div>
      </section>

      <LiveCurriculum curriculum={content.curriculum} setContent={setContent} />

      <div className="my-6">
        <FaqSection
          programType="LIVE"
          faqInfo={input.faqInfo}
          setInput={setInput}
        />
      </div>

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
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={() => setSnack({ ...snack, open: false })}
          message="라이브를 생성했습니다"
          key={vertical + horizontal}
        />
      </footer>
    </div>
  );
};

export default LiveCreate;
