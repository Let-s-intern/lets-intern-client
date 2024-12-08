import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

import { fileType, uploadFile } from '@/api/file';
import {
  useGetLiveQuery,
  useGetLiveQueryKey,
  usePatchLiveMutation,
} from '@/api/program';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import { ProgramTypeEnum, UpdateLiveReq } from '@/schema';
import { LiveContent } from '@/types/interface';
import EditorApp from '@components/admin/lexical/EditorApp';
import LivePreviewButton from '@components/admin/LivePreviewButton';
import ImageUpload from '@components/admin/program/ui/form/ImageUpload';
import Header from '@components/admin/ui/header/Header';
import Heading from '@components/admin/ui/heading/Heading';
import Heading2 from '@components/admin/ui/heading/Heading2';
import { useQueryClient } from '@tanstack/react-query';
import LiveBasic from '../../components/admin/program/LiveBasic';
import LiveCurriculum from '../../components/admin/program/LiveCurriculum';
import LiveInformation from '../../components/admin/program/LiveInformation';
import LiveMentor from '../../components/admin/program/LiveMentor';
import LivePrice, {
  initialLivePrice,
} from '../../components/admin/program/LivePrice';
import ProgramBestReview from '../../components/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '../../components/admin/program/ProgramBlogReviewEditor';
import FaqSection from '../../components/FaqSection';
import ProgramRecommendEditor from '../../components/ProgramRecommendEditor';
import ProgramSchedule from './program/ProgramSchedule';

const LiveEdit: React.FC = () => {
  const { liveId: liveIdString } = useParams();
  const navigate = useNavigate();
  const client = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState<Omit<UpdateLiveReq, 'desc'>>({});
  const [content, setContent] = useState<LiveContent>({
    initialized: false,
    recommend: [''],
    reason: [{ title: '', content: '' }],
    curriculumTitle: '',
    curriculum: [],
    blogReview: { list: [] },
  });

  const { snackbar } = useAdminSnackbar();

  const { data: live } = useGetLiveQuery({
    liveId: Number(liveIdString),
    enabled: Boolean(liveIdString),
  });
  const { mutateAsync: patchLive } = usePatchLiveMutation();

  const mentorDefaultValue = {
    mentorName: live?.mentorName,
    mentorImg: live?.mentorImg,
    mentorCompany: live?.mentorCompany,
    mentorJob: live?.mentorJob,
    mentorCareer: live?.mentorCareer,
    mentorIntroduction: live?.mentorIntroduction,
  };

  useEffect(() => {
    if (live && isDeprecatedProgram(live)) {
      navigate(`/admin/programs/${liveIdString}/edit?programType=LIVE`, {
        replace: true,
      });
    }
  }, [live, liveIdString, navigate]);

  const receivedContent = useMemo<LiveContent | null>(() => {
    if (!live?.desc) {
      return null;
    }

    try {
      return JSON.parse(live.desc);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, [live?.desc]);

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
      desc: JSON.stringify(content),
    };
    console.log('req:', req);

    const res = await patchLive(req);
    client.invalidateQueries({
      queryKey: [useGetLiveQueryKey, Number(liveIdString)],
    });
    console.log('res:', res);

    setLoading(false);
    snackbar('저장되었습니다.');
  }, [input, liveIdString, content, patchLive, client, snackbar]);

  // receivedContent가 초기화되면 content에 적용
  useEffect(() => {
    if (!receivedContent) {
      return;
    }

    setContent((prev) => ({
      ...(prev.initialized ? prev : { ...receivedContent, initialized: true }),
    }));
  }, [receivedContent]);

  if (!live || !content.initialized) {
    return <div>loading...</div>;
  }

  return (
    <div className="mx-3 mb-40 mt-3">
      <Header>
        <Heading>라이브 수정</Heading>
        <div className="flex items-center gap-3">
          <Button
            variant="outlined"
            onClick={async () => {
              await window.navigator.clipboard.writeText(JSON.stringify(live));
              alert('복사되었습니다.');
            }}
          >
            Export (복사)
          </Button>
        </div>
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
            <ProgramSchedule
              defaultValue={live}
              setInput={setInput}
              onDeadlineChange={(value) => {
                if (!value) {
                  return;
                }

                setInput((prev) => ({
                  ...prev,
                  priceInfo: {
                    ...initialLivePrice,
                    ...prev.priceInfo,
                    priceInfo: {
                      ...initialLivePrice.priceInfo,
                      ...prev.priceInfo?.priceInfo,
                      deadline: value.format('YYYY-MM-DDTHH:mm'),
                    },
                  },
                }));
              }}
            />
            <FormControlLabel
              control={<Checkbox defaultChecked={live.vod ?? true} />}
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
              image={input.mentorImg ?? live.mentorImg ?? undefined}
              onChange={onChangeImage}
            />
            <LiveMentor defaultValue={mentorDefaultValue} setInput={setInput} />
          </div>
        </div>
      </section>

      <LiveInformation
        recommendFields={content.recommend || ['']}
        reasonFields={content.reason || [{ title: '', content: '' }]}
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
        initialEditorStateJsonString={JSON.stringify(
          content.additionalCurriculum,
        )}
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
