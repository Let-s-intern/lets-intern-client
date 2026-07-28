import { Checkbox, Chip, FormControlLabel } from '@mui/material';
import { ReactNode, useState } from 'react';

interface Props {
  mode: 'all' | 'partial' | 'none';
  disabled?: boolean;
  label: string;
  code?: number;
  count?: number;
  onToggleCheck: () => void;
  children?: ReactNode;
}

export default function ExpandableRow({
  mode,
  disabled = false,
  label,
  code,
  count,
  onToggleCheck,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const bg = mode !== 'none' ? 'bg-blue-50/60' : 'bg-white';

  return (
    <div>
      <div
        role="button"
        onClick={() => setIsOpen((p) => !p)}
        className={`flex cursor-pointer items-center justify-between px-4 py-1 hover:bg-gray-50 ${bg}`}
      >
        <FormControlLabel
          onClick={(e) => e.stopPropagation()}
          control={
            <Checkbox
              checked={mode === 'all'}
              indeterminate={mode === 'partial'}
              disabled={disabled}
              onChange={onToggleCheck}
              size="small"
            />
          }
          label={
            <span className="flex items-center gap-2">
              {label}
              {code !== undefined && (
                <span className="rounded-xxs bg-neutral-90 text-xxsmall12 text-neutral-30 px-1.5 py-0.5">
                  type {code}
                </span>
              )}
            </span>
          }
        />
        <div className="flex items-center gap-2">
          {mode !== 'none' && (
            <Chip
              label={mode === 'all' ? '전체' : `일부 ${count}`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          <img
            src="/icons/arrow-right.svg"
            alt=""
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <>
          {mode === 'all' && (
            <p className="text-xxsmall12 px-4 pt-3 text-blue-500">
              {label} 전체 선택 상태입니다. 향후 추가되는 {label}도 자동
              포함됩니다.
            </p>
          )}
          {children}
        </>
      )}
    </div>
  );
}
