import { PassFormInput } from '@/domain/all-in-one-pass/types';
import ThumbnailUpload from '@/domain/all-in-one-pass/ui/ThumbnailUpload';
import dayjs from '@/lib/dayjs';
import { Button, InputAdornment, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaPlus } from 'react-icons/fa6';
import ExtensionSection, {
  createEmptyExtensionOption,
} from './ExtensionSection';

interface Props {
  input: PassFormInput;
  patch: (partial: Partial<PassFormInput>) => void;
}

/** 기본 정보: 제목 / 한 줄 설명 / 구매 가능 기간 / 패스 기간 / 썸네일 */
export default function BasicInfoSection({ input, patch }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-small20 text-neutral-0 font-semibold">기본 정보</h2>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-[240px] flex-1 flex-col gap-4">
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
        </div>

        <ThumbnailUpload
          value={input.thumbnailUrl}
          onChange={(thumbnailUrl) => patch({ thumbnailUrl })}
          className="w-52"
        />
      </div>
      <div className="flex items-start gap-6">
        <TextField
          label="패스 기간"
          type="number"
          value={input.passDays ?? ''}
          onChange={(e) =>
            patch({
              passDays: e.target.value === '' ? null : Number(e.target.value),
            })
          }
          size="small"
          sx={{ '& input': { textAlign: 'right' } }}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position="end">일</InputAdornment>,
            },
          }}
          className="w-[235px] shrink-0"
        />
        {/* 오른쪽 남은 공간: 타일 적층 위 + 연장옵션 추가 버튼 아래(일정·링크 패턴) */}
        <div className="flex flex-1 flex-col gap-3">
          <ExtensionSection
            options={input.extensionOptions}
            onChange={(extensionOptions) => patch({ extensionOptions })}
          />
          <Button
            variant="outlined"
            startIcon={<FaPlus size={12} />}
            onClick={() =>
              patch({
                extensionOptions: [
                  ...input.extensionOptions,
                  createEmptyExtensionOption(),
                ],
              })
            }
            sx={{ borderStyle: 'dashed' }}
            fullWidth
          >
            연장옵션 추가
          </Button>
        </div>
      </div>
    </section>
  );
}
