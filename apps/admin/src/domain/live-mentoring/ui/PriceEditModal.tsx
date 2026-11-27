import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';

import { useUpdateAdminLiveMentoringPricesMutation } from '@/api/live-mentoring/liveMentoring';
import type {
  AdminLiveMentoring,
  LiveMentoringDurationPrice,
} from '@/api/live-mentoring/liveMentoringSchema';
import {
  formatPrice,
  MAX_DURATION_PRICE,
  MIN_DURATION_PRICE,
  PRICE_DURATIONS,
} from '../constants';

interface PriceEditModalProps {
  row: AdminLiveMentoring;
  onClose: () => void;
  onSaved: () => void;
}

const priceOf = (
  prices: LiveMentoringDurationPrice[] | undefined,
  duration: number,
) => prices?.find((item) => item.duration === duration)?.price;

/** 입력칸이 비어 있으면 조정하지 않은 것(기본 가격)이다. */
const rangeError = (duration: number, text: string): string | null => {
  if (!text) return null;
  const price = Number(text);
  const max = MAX_DURATION_PRICE[duration];
  if (price < MIN_DURATION_PRICE || price > max) {
    return `${formatPrice(MIN_DURATION_PRICE)} 이상 ${formatPrice(max)} 이하로 입력해주세요.`;
  }
  return null;
};

/**
 * 멘토의 1:1 진행시간별 가격 조정 모달.
 *
 * 입력칸을 비워 두면 그 진행시간은 기본 가격이다. 「저장」을 눌러야 서버에 반영되고,
 * 열려 있는 개설에도 바로 적용된다(이미 만들어진 신청 금액은 그대로).
 */
const PriceEditModal = ({ row, onClose, onSaved }: PriceEditModalProps) => {
  const [draft, setDraft] = useState<Record<number, string>>(() =>
    Object.fromEntries(
      PRICE_DURATIONS.map((duration) => [
        duration,
        String(priceOf(row.priceOverrides, duration) ?? ''),
      ]),
    ),
  );
  const [error, setError] = useState<string | null>(null);
  const { mutate: updatePrices, isPending } =
    useUpdateAdminLiveMentoringPricesMutation();

  const errors = Object.fromEntries(
    PRICE_DURATIONS.map((duration) => [
      duration,
      rangeError(duration, draft[duration]),
    ]),
  );
  const hasRangeError = PRICE_DURATIONS.some((duration) => errors[duration]);
  const isChanged = PRICE_DURATIONS.some(
    (duration) =>
      draft[duration] !== String(priceOf(row.priceOverrides, duration) ?? ''),
  );

  const handleChange = (duration: number, value: string) => {
    setError(null);
    setDraft((prev) => ({ ...prev, [duration]: value.replace(/\D/g, '') }));
  };

  const handleSave = () => {
    const prices = PRICE_DURATIONS.filter((duration) => draft[duration]).map(
      (duration) => ({ duration, price: Number(draft[duration]) }),
    );
    updatePrices(
      { mentorId: row.mentorId, prices },
      {
        onSuccess: onSaved,
        onError: (e: unknown) =>
          setError(
            e instanceof Error && e.message
              ? e.message
              : '저장하지 못했습니다. 다시 시도해주세요.',
          ),
      },
    );
  };

  const mentorLabel = row.mentorNickname ?? `멘토 #${row.mentorId}`;

  return (
    <Dialog
      open
      onClose={isPending ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle className="text-base font-semibold">
        {mentorLabel} · 가격 조정
      </DialogTitle>
      <DialogContent className="flex flex-col gap-4 pt-2 text-sm">
        {PRICE_DURATIONS.map((duration) => {
          const defaultPrice = priceOf(row.defaultPrices, duration);
          return (
            <div key={duration} className="flex items-start gap-2">
              <TextField
                label={`${duration}분`}
                size="small"
                fullWidth
                value={draft[duration]}
                disabled={isPending}
                placeholder={
                  defaultPrice != null ? String(defaultPrice) : undefined
                }
                error={!!errors[duration]}
                helperText={
                  errors[duration] ??
                  (defaultPrice != null
                    ? `기본 ${formatPrice(defaultPrice)}`
                    : undefined)
                }
                slotProps={{
                  htmlInput: { inputMode: 'numeric' },
                  input: {
                    endAdornment: <span className="text-neutral-40">원</span>,
                  },
                }}
                onChange={(e) => handleChange(duration, e.target.value)}
              />
              <Button
                size="small"
                color="inherit"
                className="mt-1 whitespace-nowrap"
                aria-label={`${duration}분 기본값으로`}
                disabled={isPending || !draft[duration]}
                onClick={() => handleChange(duration, '')}
              >
                기본값으로
              </Button>
            </div>
          );
        })}

        <ul className="flex flex-col gap-0.5 text-xs text-neutral-40">
          <li>비워 두면 기본 가격이 적용됩니다.</li>
          <li>
            열려 있는 개설에도 바로 반영되고, 이미 신청된 금액은 그대로입니다.
          </li>
        </ul>

        {error && <p className="text-xs text-red-500">{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isPending} color="inherit">
          취소
        </Button>
        <Button
          onClick={handleSave}
          disabled={isPending || hasRangeError || !isChanged}
          variant="contained"
        >
          저장
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceEditModal;
