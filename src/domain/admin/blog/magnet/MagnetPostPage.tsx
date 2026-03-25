'use client';

import TextFieldLimit from '@/domain/admin/blog/TextFieldLimit';
import { useMagnetPostForm } from '@/domain/admin/blog/magnet/hooks/useMagnetPostForm';
import MagnetProgramRecommendSection from '@/domain/admin/blog/magnet/section/MagnetProgramRecommendSection';
import MagnetRecommendSection from '@/domain/admin/blog/magnet/section/MagnetRecommendSection';
import { MAGNET_TYPE, MagnetTypeKey } from '@/domain/admin/blog/magnet/types';
import ImageUpload from '@/domain/admin/program/ui/form/ImageUpload';
import Heading from '@/domain/admin/ui/heading/Heading';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import {
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dynamic from 'next/dynamic';

const EditorApp = dynamic(() => import('@/domain/admin/lexical/EditorApp'), {
  ssr: false,
});

const MAX_META_DESCRIPTION_LENGTH = 100;

const PROGRAM_TYPE_OPTIONS = [
  { value: 'CHALLENGE', label: '챌린지' },
  { value: 'LIVE', label: '라이브' },
  { value: 'VOD', label: 'VOD' },
] as const;

const CHALLENGE_TYPE_OPTIONS = [
  { value: 'CAREER_START', label: '커리어 시작' },
  { value: 'DOCUMENT_PREPARATION', label: '서류 준비' },
  { value: 'MEETING_PREPARATION', label: '면접 준비' },
  { value: 'ETC', label: '기타' },
] as const;

interface MagnetPostPageProps {
  magnetId: string;
}

const MagnetPostPage = ({ magnetId }: MagnetPostPageProps) => {
  const {
    isCreateMode,
    isLoading,
    type,
    title,
    createType,
    createTitle,
    createProgramType,
    createChallengeType,
    setCreateType,
    setCreateTitle,
    setCreateProgramType,
    setCreateChallengeType,
    formState,
    displayDate,
    endDate,
    content,
    initialEditorStateBefore,
    initialEditorStateAfter,
    onChangeMetaDescription,
    onChangeThumbnailFile,
    onChangeUseBaseQuestion,
    onChangeUseLaunchAlert,
    onChangeProgramRecommend,
    onChangeMagnetRecommend,
    onChangeEditorBefore,
    onChangeEditorAfter,
    setDisplayDate,
    setEndDate,
    savePost,
    navigateToList,
  } = useMagnetPostForm(magnetId);

  if (isLoading || (!isCreateMode && !type)) {
    return (
      <div className="flex h-64 items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="mx-6 mb-40 mt-6">
      <header className="mb-4">
        <Heading>{isCreateMode ? '마그넷 등록' : '마그넷 글 관리'}</Heading>
      </header>
      <main className="max-w-screen-xl">
        <div className="flex flex-col gap-6">
          {/* 4.1 타입 */}
          {isCreateMode ? (
            <FormControl fullWidth size="small" sx={{ maxWidth: 300 }}>
              <InputLabel>타입 선택 *</InputLabel>
              <Select
                value={createType}
                label="타입 선택 *"
                onChange={(e) => setCreateType(e.target.value as MagnetTypeKey)}
              >
                {Object.entries(MAGNET_TYPE).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <p className="text-lg font-medium">
              타입: &nbsp;{MAGNET_TYPE[type as MagnetTypeKey]}
            </p>
          )}

          {/* 4.1.1 프로그램 타입 / 챌린지 타입 (생성 모드) */}
          {isCreateMode && (
            <div className="flex gap-4">
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>프로그램 타입</InputLabel>
                <Select
                  value={createProgramType}
                  label="프로그램 타입"
                  onChange={(e) => setCreateProgramType(e.target.value)}
                >
                  <MenuItem value="">
                    <em>없음</em>
                  </MenuItem>
                  {PROGRAM_TYPE_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {createProgramType === 'CHALLENGE' && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>챌린지 타입</InputLabel>
                  <Select
                    value={createChallengeType}
                    label="챌린지 타입"
                    onChange={(e) => setCreateChallengeType(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>없음</em>
                    </MenuItem>
                    {CHALLENGE_TYPE_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          )}

          {/* 4.2 제목 */}
          {isCreateMode ? (
            <TextField
              fullWidth
              size="small"
              label="제목 *"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              sx={{ maxWidth: 500 }}
            />
          ) : (
            <p className="text-lg font-medium">제목: &nbsp;{title}</p>
          )}

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
              currentMagnetId={Number(magnetId)}
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

          <div className="flex gap-4">
            {/* 4.8 공통 신청폼 사용 */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.useBaseQuestion}
                  onChange={(e) => onChangeUseBaseQuestion(e.target.checked)}
                />
              }
              label="공통 신청폼 추가"
            />

            {/* 4.8 출시 알림 사용 */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formState.useLaunchAlert}
                  onChange={(e) => onChangeUseLaunchAlert(e.target.checked)}
                />
              }
              label="출시 알림 신청 버튼 추가"
            />
          </div>

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
              {isCreateMode ? '등록하기' : '저장하기'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MagnetPostPage;
