import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useCallback, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import { fileType, uploadFile } from '@/api/file';
import { useGetLiveQuery, usePatchLiveMutation } from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { UpdateLiveReq } from '@/schema';
import { LiveContent } from '@/types/interface';
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
import ProgramSchedule from './program/ProgramSchedule';

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
  const { snackbar } = useAdminSnackbar();

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
    snackbar('저장되었습니다.');
    navigate('/admin/programs');
  }, [input, liveIdString, navigate, patchLive, snackbar]);

  if (!live) return <div>loading...</div>;

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>라이브 생성</Heading>
      </Header>

      <Heading2>기본 정보</Heading2>
      <section className="mb-6 mt-3">
        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <LiveBasic defaultValue={live} setInput={setInput} />
          <ImageUpload
            label="라이브 썸네일 이미지 업로드"
            id="thumbnail"
            name="thumbnail"
            image={input.thumbnail ?? live.thumbnail}
            onChange={onChangeImage}
          />
        </div>
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="flex flex-col items-start gap-6">
            <LivePrice defaultValue={live.priceInfo} setInput={setInput} />
            <ProgramSchedule defaultValue={live} setInput={setInput} />
            <FormControlLabel
              defaultChecked={live.vod ?? false}
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
              image={input.mentorImg ?? live.mentorImg}
              onChange={onChangeImage}
            />
            <LiveMentor defaultValue={live} setInput={setInput} />
          </div>
        </div>
      </section>

      <LiveCurriculum curriculum={content.curriculum} setContent={setContent} />

      <div className="my-6">
        <FaqSection
          programType="LIVE"
          faqInfo={
            input.faqInfo ?? live.faqInfo.map((info) => ({ faqId: info.id }))
          }
          setInput={setInput}
        />
      </div>

      <footer className="flex items-center justify-end gap-3">
        <LivePreviewButton input={input} existing={live} content={content} />
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

export default LiveEdit;
