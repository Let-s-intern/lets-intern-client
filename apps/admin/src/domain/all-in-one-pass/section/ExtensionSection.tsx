import { PassExtensionOption } from '@/domain/all-in-one-pass/types';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { FaTrashCan } from 'react-icons/fa6';

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

  if (options.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <div key={opt.id} className="flex gap-2">
          <TextField
            label="연장일"
            type="number"
            value={opt.days ?? ''}
            onChange={(e) => update(opt.id, { days: numberOf(e.target.value) })}
            size="small"
            sx={{ '& input': { textAlign: 'right' } }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">일</InputAdornment>
                ),
              },
            }}
            fullWidth
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
                endAdornment: (
                  <InputAdornment position="end">원</InputAdornment>
                ),
              },
            }}
            fullWidth
          />
          <IconButton
            aria-label="연장옵션 삭제"
            size="small"
            color="error"
            onClick={() => onChange(options.filter((o) => o.id !== opt.id))}
          >
            <FaTrashCan size={14} />
          </IconButton>
        </div>
      ))}
    </div>
  );
}
