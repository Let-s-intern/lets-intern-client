import { PassFormInput } from '@/domain/all-in-one-pass/types';
import dayjs from '@/lib/dayjs';
import { InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FiUpload } from 'react-icons/fi';

interface Props {
  input: PassFormInput;
  patch: (partial: Partial<PassFormInput>) => void;
}

/** 기본 정보: 제목 / 한 줄 설명 / 구매 가능 기간 / 패스 기간 / 썸네일 */
export default function BasicInfoSection({ input, patch }: Props) {
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // 백엔드 부재로 실제 업로드 대신 로컬 미리보기(data URL)를 폼에 저장한다.
    const reader = new FileReader();
    reader.onloadend = () => patch({ thumbnailUrl: reader.result as string });
    reader.readAsDataURL(file);
  };

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

        <div className="flex flex-col gap-1">
          <label className="border-neutral-80 bg-neutral-95 flex aspect-[4/3] w-56 cursor-pointer items-center justify-center overflow-hidden rounded-md border">
            {input.thumbnailUrl ? (
              <img
                src={input.thumbnailUrl}
                alt="썸네일"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-3">
                <FiUpload className="text-neutral-40 text-2xl" />
                <span className="text-neutral-40">썸네일 업로드</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleThumbnailChange}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
