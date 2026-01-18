'use client';

import { fileType, uploadFile } from '@/api/file';
import {
  useGetLiveQuery,
  useGetLiveQueryKey,
  usePatchLiveMutation,
} from '@/api/program';
import EditorApp from '@/domain/admin/lexical/EditorApp';
import LivePreviewButton from '@/domain/admin/LivePreviewButton';
import LiveBasic from '@/domain/admin/program/LiveBasic';
import LiveCurriculum from '@/domain/admin/program/LiveCurriculum';
import LiveInformation from '@/domain/admin/program/LiveInformation';
import LiveMentor from '@/domain/admin/program/LiveMentor';
import LivePrice, { initialLivePrice } from '@/domain/admin/program/LivePrice';
import ProgramBestReview from '@/domain/admin/program/ProgramBestReview';
import ProgramBlogReviewEditor from '@/domain/admin/program/ProgramBlogReviewEditor';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Header from '@/domain/admin/ui/header/Header';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import FaqSection from '@/domain/faq/FaqSection';
import ProgramRecommendEditor from '@/domain/program-recommend/ProgramRecommendEditor';
import { useAdminSnackbar } from '@/hooks/useAdminSnackbar';
import { isDeprecatedProgram } from '@/lib/isDeprecatedProgram';
import { ProgramTypeEnum, UpdateLiveReq } from '@/schema';
import { LiveContent } from '@/types/interface';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import ProgramSchedule from './program/ProgramSchedule';

const LiveEdit: React.FC = () => {
  const { liveId: liveIdString } = useParams<{ liveId: string }>();
  const router = useRouter();
  const client = useQueryClient();
  const { snackbar } = useAdminSnackbar();

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

  useEffect(() => {
    // 구 버전인지 판단
    if (live && isDeprecatedProgram(live)) {
      router.replace(`/admin/programs/${liveIdString}/edit?programType=LIVE`);
    }
  }, [live, liveIdString, router]);

  useEffect(() => {
    // receivedContent가 초기화되면 content에 적용
    if (!receivedContent) return;
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

      <div className="mb-6 mt-3 grid w-full grid-cols-2 gap-3">
        {/* 기본 정보 */}
        <section>
          <Heading2 className="mb-3">기본 정보</Heading2>
          <LiveBasic defaultValue={live} setInput={setInput} />
        </section>
        {/* 가격 정보 & 일정 */}
        <section className="flex flex-col gap-3">
          <Heading2>가격 정보 & 일정</Heading2>
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
            onChange={(_, checked) =>
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
            image={input.thumbnail ?? live.thumbnail ?? undefined}
            onChange={onChangeImage}
          />
          <ImageUpload
            label="데스크탑 썸네일 이미지 업로드"
            id="desktopThumbnail"
            name="desktopThumbnail"
            image={input.desktopThumbnail ?? live.desktopThumbnail ?? undefined}
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
              image={input.mentorImg ?? live.mentorImg ?? undefined}
              onChange={onChangeImage}
            />
          </div>
          <LiveMentor defaultValue={mentorDefaultValue} setInput={setInput} />
        </div>
      </section>

      {/* 프로그램 소개 */}
      <LiveInformation
        recommendFields={content.recommend || []}
        reasonFields={content.reason || [{ title: '', content: '' }]}
        setContent={setContent}
        editorContent={content.mainDescription}
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
