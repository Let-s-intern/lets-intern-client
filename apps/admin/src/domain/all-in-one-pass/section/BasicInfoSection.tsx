import { PassFormInput } from '@/domain/all-in-one-pass/types';
import ThumbnailUpload from '@/domain/all-in-one-pass/ui/ThumbnailUpload';
import dayjs from '@/lib/dayjs';
import { InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface Props {
  input: PassFormInput;
  patch: (partial: Partial<PassFormInput>) => void;
}

/** 기본 정보: 제목 / 한 줄 설명 / 구매 가능 기간 / 패스 기간 / 썸네일 */
export default function BasicInfoSection({ input, patch }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-small20 text-neutral-0 font-semibold">기본 정보</h2>

      <TextField
        label="제목"
        placeholder="제목을 입력해주세요."
        value={input.title}
        onChange={(e) => patch({ title: e.target.value })}
        size="small"
        fullWidth
      />

      <TextField
        label="한 줄 설명"
        placeholder="한 줄 설명을 입력해주세요."
        value={input.shortDescription}
        onChange={(e) => patch({ shortDescription: e.target.value })}
        size="small"
        fullWidth
      />

      <div className="flex items-start gap-4">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <DatePicker
                label="구매 시작일"
                value={
                  input.purchaseStartDate
                    ? dayjs(input.purchaseStartDate)
                    : null
                }
                onChange={(v) =>
                  patch({ purchaseStartDate: v ? v.toISOString() : null })
                }
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
              <span className="text-neutral-40">~</span>
              <DatePicker
                label="구매 종료일"
                value={
                  input.purchaseEndDate ? dayjs(input.purchaseEndDate) : null
                }
                onChange={(v) =>
                  patch({ purchaseEndDate: v ? v.toISOString() : null })
                }
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </div>
          </div>

          <TextField
            label="패스 기간"
            type="number"
            value={input.passMonths ?? ''}
            onChange={(e) =>
              patch({
                passMonths:
                  e.target.value === '' ? null : Number(e.target.value),
              })
            }
            size="small"
            sx={{ '& input': { textAlign: 'right' } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">일</InputAdornment>
                ),
              },
            }}
            className="w-[226px]"
          />
        </div>

        <ThumbnailUpload
          value={input.thumbnailUrl}
          onChange={(thumbnailUrl) => patch({ thumbnailUrl })}
          className="w-56"
        />
      </div>
    </section>
  );
}
