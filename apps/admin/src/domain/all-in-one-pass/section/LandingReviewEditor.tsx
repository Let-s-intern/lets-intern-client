import { PassLandingReview } from '@/domain/all-in-one-pass/types';
import ThumbnailUpload from '@/domain/all-in-one-pass/ui/ThumbnailUpload';
import {
  createEmptyReview,
  REVIEW_RESULT_TAG_OPTIONS,
  REVIEW_SOURCE_OPTIONS,
} from '@/domain/all-in-one-pass/util/landingOptions';
import {
  Button,
  Checkbox,
  IconButton,
  ListItemText,
  MenuItem,
  TextField,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

interface Props {
  reviews: PassLandingReview[];
  onChange: (reviews: PassLandingReview[]) => void;
}

/** 후기 에디터. 출처(단일)·결과태그(다중) + 이미지 + 요약(최대 90자). 최대 9개. 저장은 landingDescription. */
export default function LandingReviewEditor({ reviews, onChange }: Props) {
  const update = (id: string, partial: Partial<PassLandingReview>) =>
    onChange(reviews.map((r) => (r.id === id ? { ...r, ...partial } : r)));

  // 후기 추가 직후 새 카드로 스크롤
  const addedId = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addReview = () => {
    const review = createEmptyReview();
    addedId.current = review.id;
    onChange([...reviews, review]);
  };

  useEffect(() => {
    if (!addedId.current) return;
    containerRef.current
      ?.querySelector(`[data-review-id="${addedId.current}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    addedId.current = null;
  }, [reviews.length]);

  return (
    <>
      {/* 높이 고정 — 후기 3개 넘어가면 세로 스크롤 */}
      <div
        ref={containerRef}
        className="flex max-h-[600px] flex-col gap-3 overflow-y-auto pr-1"
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            data-review-id={review.id}
            className="border-neutral-80 flex items-start gap-3 rounded-md border p-3"
          >
            <ThumbnailUpload
              value={review.imageUrl || null}
              onChange={(imageUrl) => update(review.id, { imageUrl })}
              className="aspect-[4/3] w-40"
              label="후기 이미지"
            />
            <div className="flex flex-1 flex-col gap-3">
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
                  value={review.resultTags}
                  onChange={(e) =>
                    update(review.id, {
                      resultTags: e.target.value as unknown as string[],
                    })
                  }
                  size="small"
                  fullWidth
                  slotProps={{
                    select: {
                      multiple: true,
                      renderValue: (selected) =>
                        (selected as string[]).join(', '),
                    },
                  }}
                >
                  {REVIEW_RESULT_TAG_OPTIONS.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      <Checkbox
                        size="small"
                        checked={review.resultTags.includes(opt)}
                      />
                      <ListItemText primary={opt} />
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <TextField
                label="요약(최대 90자)"
                value={review.summary}
                onChange={(e) => update(review.id, { summary: e.target.value })}
                size="small"
                fullWidth
                multiline
                minRows={2}
                slotProps={{
                  htmlInput: { maxLength: 90 },
                  formHelperText: { sx: { textAlign: 'right', mx: 0 } },
                }}
              />
            </div>
            <IconButton
              aria-label="후기 삭제"
              color="error"
              disabled={reviews.length <= 3}
              onClick={() =>
                onChange(reviews.filter((r) => r.id !== review.id))
              }
            >
              <FaTrashCan size={16} />
            </IconButton>
          </div>
        ))}
      </div>

      {reviews.length < 9 && (
        <Button
          variant="outlined"
          startIcon={<FaPlus size={12} />}
          onClick={addReview}
          sx={{ borderStyle: 'dashed' }}
        >
          후기 추가
        </Button>
      )}
    </>
  );
}
