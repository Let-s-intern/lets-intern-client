import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { uploadFile } from '@/api/file';
import { useUpdateAdminLiveMentoringThumbnailMutation } from '@/api/live-mentoring/liveMentoring';
import type { AdminLiveMentoring } from '@/api/live-mentoring/liveMentoringSchema';

/** 멘토 앱 썸네일 필드와 같은 제한이다. */
const MAX_IMAGE_MB = 10;
const MAX_IMAGE_BYTES = MAX_IMAGE_MB * 1024 * 1024;

interface ThumbnailEditModalProps {
  row: AdminLiveMentoring;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * 멘토의 1:1 썸네일 수정 모달.
 *
 * 업로드·교체·삭제는 모달 안에서만 바뀌고, 「저장」을 눌러야 서버에 반영된다.
 * 삭제 후 저장하면 공개 화면은 멘토 프로필 사진으로 돌아간다.
 */
const ThumbnailEditModal = ({
  row,
  onClose,
  onSaved,
}: ThumbnailEditModalProps) => {
  const [draft, setDraft] = useState<string | null>(row.thumbnail ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { mutate: updateThumbnail, isPending } =
    useUpdateAdminLiveMentoringThumbnailMutation();

  const handleSelect = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    if (file.size > MAX_IMAGE_BYTES) {
      const sizeMb = (file.size / 1024 / 1024).toFixed(1);
      setError(
        `용량이 너무 커요. ${MAX_IMAGE_MB}MB까지 올릴 수 있는데 이 이미지는 ${sizeMb}MB예요.`,
      );
      return;
    }
    setIsUploading(true);
    try {
      setDraft(await uploadFile({ file, type: 'LIVE_MENTORING' }));
    } catch {
      setError('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateThumbnail(
      { mentorId: row.mentorId, thumbnail: draft },
      {
        onSuccess: onSaved,
        onError: () => setError('저장하지 못했습니다. 다시 시도해주세요.'),
      },
    );
  };

  const busy = isUploading || isPending;
  const mentorLabel = row.mentorNickname ?? `멘토 #${row.mentorId}`;

  return (
    <Dialog open onClose={busy ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-base font-semibold">
        {mentorLabel} · 썸네일 수정
      </DialogTitle>
      <DialogContent className="flex flex-col gap-3 text-sm">
        <div className="bg-neutral-95 relative aspect-[540/421] w-full overflow-hidden rounded">
          {draft ? (
            <img
              src={draft}
              alt="썸네일"
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              {row.mentorProfileImage && (
                <img
                  src={row.mentorProfileImage}
                  alt="썸네일 대신 표시되는 프로필 사진"
                  className="h-full w-full object-cover opacity-40"
                />
              )}
              <span className="text-neutral-40 absolute inset-0 flex items-center justify-center text-xs font-medium">
                없음(프로필 사진 사용)
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            component="label"
            variant="outlined"
            size="small"
            disabled={busy}
          >
            {isUploading
              ? '업로드 중...'
              : draft
                ? '이미지 변경'
                : '이미지 업로드'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={(e) => handleSelect(e.target.files?.[0])}
            />
          </Button>
          {draft && (
            <Button
              size="small"
              color="error"
              disabled={busy}
              onClick={() => setDraft(null)}
            >
              삭제
            </Button>
          )}
        </div>

        <ul className="text-neutral-40 flex flex-col gap-0.5 text-xs">
          <li>썸네일이 없으면 공개 화면에 프로필 사진이 표시됩니다.</li>
          <li>권장 1080 x 842 px · JPG, PNG, WEBP · 최대 {MAX_IMAGE_MB}MB</li>
          <li>
            중요한 내용은 가운데에 두세요. 화면에 따라 가장자리가 잘립니다.
          </li>
        </ul>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={busy} color="inherit">
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={busy || draft === (row.thumbnail ?? null)}
          variant="contained"
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ThumbnailEditModal;
