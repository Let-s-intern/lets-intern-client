import { PassLandingReview } from '@/domain/all-in-one-pass/types';
import ThumbnailUpload from '@/domain/all-in-one-pass/ui/ThumbnailUpload';
import {
  REVIEW_RESULT_TAG_OPTIONS,
  REVIEW_SOURCE_OPTIONS,
} from '@/domain/all-in-one-pass/util/landingOptions';
import { Button, IconButton, MenuItem, TextField } from '@mui/material';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

interface Props {
  reviews: PassLandingReview[];
  onChange: (reviews: PassLandingReview[]) => void;
}

const SUMMARY_MAX = 70;

const createEmptyReview = (): PassLandingReview => ({
  id: crypto.randomUUID(),
  source: REVIEW_SOURCE_OPTIONS[0],
  resultTag: REVIEW_RESULT_TAG_OPTIONS[0],
  imageUrl: '',
  summary: '',
});

/** 후기 에디터. 출처·결과태그(드롭다운) + 이미지 + 요약(최대 70자). 저장은 landingDescription. */
export default function LandingReviewEditor({ reviews, onChange }: Props) {
  const update = (id: string, partial: Partial<PassLandingReview>) =>
    onChange(reviews.map((r) => (r.id === id ? { ...r, ...partial } : r)));

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-small18 text-neutral-0 font-semibold">후기</h3>

      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-neutral-80 flex items-start gap-3 rounded-md border p-3"
          >
            <ThumbnailUpload
              value={review.imageUrl || null}
              onChange={(imageUrl) => update(review.id, { imageUrl })}
              className="aspect-[4/3] w-40"
            />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex gap-2">
                <TextField
                  select
                  label="출처"
                  value={review.source}
                  onChange={(e) =>
                    update(review.id, { source: e.target.value })
                  }
                  size="small"
                  className="w-44 shrink-0"
                >
                  {REVIEW_SOURCE_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="결과태그"
                  value={review.resultTag}
                  onChange={(e) =>
                    update(review.id, { resultTag: e.target.value })
                  }
                  size="small"
                  className="w-44 shrink-0"
                >
                  {REVIEW_RESULT_TAG_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <TextField
                label="요약"
                value={review.summary}
                onChange={(e) => update(review.id, { summary: e.target.value })}
                size="small"
                fullWidth
                multiline
                minRows={2}
                slotProps={{ htmlInput: { maxLength: SUMMARY_MAX } }}
                helperText={`${review.summary.length}/${SUMMARY_MAX}`}
              />
            </div>
            <IconButton
              aria-label="후기 삭제"
              color="error"
              onClick={() =>
                onChange(reviews.filter((r) => r.id !== review.id))
              }
            >
              <FaTrashCan size={16} />
            </IconButton>
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={() => onChange([...reviews, createEmptyReview()])}
        sx={{ borderStyle: 'dashed' }}
      >
        후기 추가
      </Button>
    </div>
  );
}
