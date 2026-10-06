import { PassExtensionOption } from '@/domain/all-in-one-pass/types';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import { FaPlus, FaTrashCan } from 'react-icons/fa6';

export const createEmptyExtensionOption = (): PassExtensionOption => ({
  id: crypto.randomUUID(),
  days: null,
  price: null,
});

interface Props {
  options: PassExtensionOption[];
  onChange: (options: PassExtensionOption[]) => void;
}

const numberOf = (v: string) => (v === '' ? null : Number(v));

/** 연장 옵션: 연장일 + 가격 (만료 전 유저가 선택하는 연장 상품) */
export default function ExtensionSection({ options, onChange }: Props) {
  const update = (id: string, partial: Partial<PassExtensionOption>) =>
    onChange(options.map((o) => (o.id === id ? { ...o, ...partial } : o)));

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-small20 text-neutral-0 font-semibold">연장 옵션</h2>
        <p className="text-xsmall14 text-neutral-40">
          만료 전 유저가 선택할 수 있는 연장 상품입니다. 연장 구매는 상품 판매
          종료일까지 가능합니다.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <div key={opt.id} className="flex items-center gap-2">
            <TextField
              label="연장일"
              type="number"
              value={opt.days ?? ''}
              onChange={(e) => update(opt.id, { days: numberOf(e.target.value) })}
              size="small"
              sx={{ '& input': { textAlign: 'right' } }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">일</InputAdornment>,
                },
              }}
              className="w-40 shrink-0"
            />
            <TextField
              label="가격"
              type="number"
              value={opt.price ?? ''}
              onChange={(e) =>
                update(opt.id, { price: numberOf(e.target.value) })
              }
              size="small"
              sx={{ '& input': { textAlign: 'right' } }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">원</InputAdornment>,
                },
              }}
              className="w-56 shrink-0"
            />
            <IconButton
              aria-label="연장 옵션 삭제"
              color="error"
              onClick={() => onChange(options.filter((o) => o.id !== opt.id))}
            >
              <FaTrashCan size={16} />
            </IconButton>
          </div>
        ))}
      </div>

      <Button
        variant="outlined"
        startIcon={<FaPlus size={12} />}
        onClick={() => onChange([...options, createEmptyExtensionOption()])}
        sx={{ borderStyle: 'dashed' }}
        className="self-start"
      >
        연장 옵션 추가
      </Button>
    </section>
  );
}
