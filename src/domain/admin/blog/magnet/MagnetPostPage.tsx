'use client';

import TextFieldLimit from '@/domain/admin/blog/TextFieldLimit';
import { useMagnetPostForm } from '@/domain/admin/blog/magnet/hooks/useMagnetPostForm';
import MagnetProgramRecommendSection from '@/domain/admin/blog/magnet/section/MagnetProgramRecommendSection';
import MagnetRecommendSection from '@/domain/admin/blog/magnet/section/MagnetRecommendSection';
import { MAGNET_TYPE, MagnetPostDetail } from '@/domain/admin/blog/magnet/types';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import { Button, Checkbox, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dynamic from 'next/dynamic';

const EditorApp = dynamic(
  () => import('@/domain/admin/lexical/EditorApp'),
  { ssr: false },
);

const MAX_META_DESCRIPTION_LENGTH = 100;

interface MagnetPostPageProps {
  magnetId: string;
  initialData: MagnetPostDetail;
}

const MagnetPostPage = ({ magnetId, initialData }: MagnetPostPageProps) => {
  const {
    type,
    title,
    formState,
    displayDate,
    endDate,
    content,
    initialEditorStateBefore,
    initialEditorStateAfter,
    onChangeMetaDescription,
    onChangeThumbnailFile,
    onChangeHasCommonForm,
    onChangeProgramRecommend,
    onChangeMagnetRecommend,
    onChangeEditorBefore,
    onChangeEditorAfter,
    setDisplayDate,
    setEndDate,
    savePost,
    navigateToList,
  } = useMagnetPostForm({ magnetId, initialData });

  return (
    <div className="mx-6 mb-40 mt-6">
      <header className="mb-4">
        <Heading>마그넷 글 관리</Heading>
      </header>
      <main className="max-w-screen-xl">
        <div className="flex flex-col gap-6">
          {/* 4.1 타입 */}
          <p className="text-lg font-medium">
            타입: &nbsp;{MAGNET_TYPE[type]}
          </p>

          {/* 4.2 제목 */}
          <p className="text-lg font-medium">
            제목: &nbsp;{title}
          </p>

          {/* 4.3 메타 디스크립션 */}
          <TextFieldLimit
            type="text"
            label="메타 디스크립션"
            placeholder="메타 디스크립션"
            name="metaDescription"
            value={formState.metaDescription}
            onChange={onChangeMetaDescription}
            multiline
            minRows={3}
            fullWidth
            maxLength={MAX_META_DESCRIPTION_LENGTH}
          />

          {/* 4.4 썸네일 */}
          <div className="w-72">
            <ImageUpload
              label="썸네일 등록"
              id="magnet-thumbnail"
              image={formState.thumbnail}
              onChange={onChangeThumbnailFile}
            />
          </div>

          {/* 4.5 프로그램 추천 + 4.6 마그넷 추천 */}
          <div className="flex gap-5">
            <MagnetProgramRecommendSection
              programRecommend={content.programRecommend}
              onChangeProgramRecommend={onChangeProgramRecommend}
            />
            <MagnetRecommendSection
              magnetRecommend={content.magnetRecommend}
              onChangeMagnetRecommend={onChangeMagnetRecommend}
            />
          </div>

          {/* 4.7 노출 기간 */}
          <div className="border px-6 py-10">
            <Heading2 className="mb-4">노출 기간</Heading2>
            <div className="flex gap-4">
              <DateTimePicker
                label="시작 일자"
                value={displayDate}
                onChange={setDisplayDate}
                format="YYYY.MM.DD(dd) HH:mm"
                ampm={false}
              />
              <DateTimePicker
                label="종료 일자"
                value={endDate}
                onChange={setEndDate}
                format="YYYY.MM.DD(dd) HH:mm"
                ampm={false}
              />
            </div>
          </div>

          {/* 4.8 공통 신청폼 추가 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={formState.hasCommonForm}
                onChange={(e) => onChangeHasCommonForm(e.target.checked)}
              />
            }
            label="공통 신청폼 추가"
          />

          {/* 4.9 콘텐츠 편집1 (신청 전 공개) */}
          <div>
            <Heading2 className="mb-2">콘텐츠 편집1(신청 전 공개)</Heading2>
            <EditorApp
              initialEditorStateJsonString={initialEditorStateBefore}
              onChange={onChangeEditorBefore}
            />
          </div>

          {/* 4.10 콘텐츠 편집2 (신청 후 공개) */}
          <div>
            <Heading2 className="mb-2">콘텐츠 편집2(신청 후 공개)</Heading2>
            <EditorApp
              initialEditorStateJsonString={initialEditorStateAfter}
              onChange={onChangeEditorAfter}
            />
          </div>

          {/* 4.11 액션 버튼 */}
          <div className="flex items-center justify-end gap-4">
            <Button variant="outlined" type="button" onClick={navigateToList}>
              취소 (리스트로 돌아가기)
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={savePost}
            >
              등록하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MagnetPostPage;
