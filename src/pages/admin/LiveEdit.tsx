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
import { useNavigate, useParams } from 'react-router-dom';

import { fileType, uploadFile } from '@/api/file';
import { useGetLiveQuery, usePatchLiveMutation } from '@/api/program';
import { UpdateLiveReq } from '@/schema';
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

const LiveEdit: React.FC = () => {
  const navigate = useNavigate();
  const { liveId: liveIdString } = useParams();

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<Omit<UpdateLiveReq, 'desc'>>({});
  const [content, setContent] = useState<LiveContent>({
    // mainDescription: ,
    curriculum: [],
    blogReview: '',
  });
  const [snack, setSnack] = useState<Snack>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = snack;

  const { data: live } = useGetLiveQuery({
    liveId: Number(liveIdString),
    enabled: Boolean(liveIdString),
  });
  const { mutateAsync: patchLive } = usePatchLiveMutation();

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
    const req: Parameters<typeof patchLive>[0] = {
      ...input,
      liveId: Number(liveIdString),
      desc: JSON.stringify({}),
    };
    console.log('req:', req);

    const res = await patchLive(req);
    console.log('res:', res);

    setLoading(false);
    setSnack((prev) => ({ ...prev, open: true }));
    navigate('/admin/programs');
  }, [input]);

  /* live로 Input 초기화 */
  useEffect(() => {
    if (!live) return;

    const {
      title,
      shortDesc,
      desc,
      criticalNotice,
      participationCount,
      thumbnail,
      startDate,
      endDate,
      beginning,
      deadline,
      mentorName,
      mentorImg,
      mentorCompany,
      mentorJob,
      mentorCareer,
      mentorIntroduction,
      job,
      progressType,
      priceInfo,
      faqInfo,
    } = live;

    const { price, discount, accountNumber, accountType, livePriceType } =
      priceInfo;

    const initial = {
      title,
      shortDesc,
      criticalNotice,
      participationCount,
      thumbnail,
      mentorName,
      mentorImg,
      mentorCompany,
      mentorJob,
      mentorCareer,
      mentorIntroduction,
      job,
      startDate: startDate?.format('YYYY-MM-DDTHH:mm:ss'),
      endDate: endDate?.format('YYYY-MM-DDTHH:mm:ss'),
      beginning: beginning?.format('YYYY-MM-DDTHH:mm:ss'),
      deadline: deadline?.format('YYYY-MM-DDTHH:mm:ss'),
      progressType: progressType ?? 'ALL',
      programTypeInfo: live.classificationInfo.map((info) => ({
        classificationInfo: {
          programClassification: info.programClassification,
        },
      })),
      priceInfo: {
        livePriceType: livePriceType ?? 'CHARGE',
        priceInfo: {
          price: price ?? 0,
          discount: discount ?? 0,
          accountNumber: accountNumber ?? '',
          deadline:
            priceInfo.deadline?.format('YYYY-MM-DDTHH:mm:ss') ??
            dayjs().format('YYYY-MM-DDTHH:mm:ss'),
          accountType: accountType ?? 'KB',
        },
      },
      faqInfo: faqInfo.map((info) => ({ faqId: info.id })),
    };

    setInput(initial);
    setContent(JSON.parse(desc ?? '{}'));
  }, [live]);

  if (!live) return <div>loading...</div>;

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
            image={input.thumbnail}
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
              image={input.mentorImg}
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
          message="라이브를 수정했습니다"
          key={vertical + horizontal}
        />
      </footer>
    </div>
  );
};

export default LiveEdit;
