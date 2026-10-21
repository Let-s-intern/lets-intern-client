import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
} from '@mui/material';
import { useState } from 'react';

import { usePatchAdminMentorReviewContent } from '@/api/mentor/mentor';
import type { AdminMentorReview } from '@/api/mentor/mentorSchema';
import { MENTOR_REVIEW_TYPE_LABEL } from '../constants/mentorReviewTypeLabel';

/** 서버 UpdateMentorReviewContentRequestDto 의 @Size(max) 와 같다 */
export const REVIEW_EDIT_MAX_LENGTH = 2000;

interface Props {
  mentorId: number;
  review: AdminMentorReview;
  onClose: () => void;
}

/**
 * 멘토 페이지에만 보이는 점수·내용 수정값을 저장한다. 원본 후기는 바뀌지 않는다.
 * 원본과 같은 값은 null 로 보내 수정값을 남기지 않는다.
 */
export default function MentorReviewEditDialog({
  mentorId,
  review,
  onClose,
}: Props) {
  const [score, setScore] = useState<number | null>(review.score);
  const [content, setContent] = useState(review.review ?? '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const patchContent = usePatchAdminMentorReviewContent(mentorId);

  const canSave = content.trim().length > 0 && !patchContent.isPending;

  const save = (body: { score: number | null; review: string | null }) => {
    setErrorMessage(null);
    patchContent.mutate(
      { source: review.source, sourceId: review.sourceId, ...body },
      {
        onSuccess: onClose,
        onError: () => setErrorMessage('저장하지 못했습니다.'),
      },
    );
  };

  const handleSave = () => {
    save({
      score: score === review.originalScore ? null : score,
      review: content === review.originalReview ? null : content,
    });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-base font-semibold">
        후기 수정 · {MENTOR_REVIEW_TYPE_LABEL[review.type]}
        {review.programTitle ? ` · ${review.programTitle}` : ''}
      </DialogTitle>
      <DialogContent className="flex flex-col gap-5 text-sm">
        <p className="text-neutral-40 text-xs">
          멘토 프로필과 1:1 LIVE 멘토링 상세에만 반영됩니다. 원본 후기는 바뀌지
          않습니다.
        </p>

        <div className="flex flex-col gap-1">
          <span className="text-neutral-30 font-medium">별점</span>
          <div className="flex items-center gap-2">
            <Rating
              value={score}
              precision={0.5}
              // 별을 다시 눌러 비우는 것은 막는다. 서버는 1.0 미만을 받지 않는다
              onChange={(_, value) => {
                if (value !== null) setScore(Math.max(1, value));
              }}
              aria-label="별점"
            />
            <span>{score !== null ? score.toFixed(1) : '-'}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-neutral-30 font-medium">후기 내용</span>
          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value.slice(0, REVIEW_EDIT_MAX_LENGTH))
            }
            aria-label="후기 내용"
            className="border-neutral-80 focus:border-neutral-40 h-48 w-full resize-y rounded border px-3 py-2 outline-none"
          />
          <span className="text-neutral-40 self-end text-xs">
            {content.length} / {REVIEW_EDIT_MAX_LENGTH}
          </span>
        </div>

        <div className="bg-neutral-95 flex flex-col gap-1 rounded p-3">
          <span className="text-neutral-30 font-medium">
            원본 · 별점{' '}
            {review.originalScore !== null
              ? review.originalScore.toFixed(1)
              : '-'}
          </span>
          <p className="text-neutral-20 whitespace-pre-wrap">
            {review.originalReview ?? '-'}
          </p>
        </div>

        {errorMessage ? (
          <p role="alert" className="text-system-error text-xs">
            {errorMessage}
          </p>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          disabled={patchContent.isPending}
          color="inherit"
        >
          취소
        </Button>
        {review.isEdited ? (
          <Button
            onClick={() => save({ score: null, review: null })}
            disabled={patchContent.isPending}
            color="inherit"
          >
            원본으로 되돌리기
          </Button>
        ) : null}
        <Button onClick={handleSave} disabled={!canSave} variant="contained">
          {patchContent.isPending ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
