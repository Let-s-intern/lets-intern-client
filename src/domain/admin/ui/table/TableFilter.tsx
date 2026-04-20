'use client';

import dayjs from '@/lib/dayjs';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Popover,
} from '@mui/material';
import {
  GridFilterInputValueProps,
  GridFilterOperator,
} from '@mui/x-data-grid';
import { useState } from 'react';

export interface MultiSelectFilterOption {
  value: string;
  label: string;
}

interface MultiSelectFilterInputProps extends GridFilterInputValueProps {
  options: MultiSelectFilterOption[];
}

// 다중 선택 필터 입력 컴포 UI
export const MultiSelectFilterInput = ({
  item,
  applyValue,
  options,
}: MultiSelectFilterInputProps) => {
  const selectedValues = Array.isArray(item.value) ? item.value : [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v: string) => v !== value);

    applyValue({ ...item, value: newValues });
  };

  const getDisplayText = () => {
    if (!selectedValues.length) return '전체';

    const selectedOptions = options.filter((option) =>
      selectedValues.includes(option.value),
    );

    if (!selectedOptions.length) return '전체';
    if (selectedOptions.length === 1) return selectedOptions[0].label;

    return `${selectedOptions[0].label} 외 ${selectedOptions.length - 1}`;
  };

  return (
    <FormControl className="h-full" component="fieldset">
      <Button
        variant="outlined"
        className="h-full"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        fullWidth
      >
        {getDisplayText()}
      </Button>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <FormGroup sx={{ p: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedValues.length === 0 ||
                  selectedValues.length === options.length
                }
                onChange={(e) => {
                  applyValue({
                    ...item,
                    value: e.target.checked
                      ? options.map((option) => option.value)
                      : [],
                  });
                }}
              />
            }
            label="전체"
          />

          {options.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  onChange={handleChange}
                  value={option.value}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      </Popover>
    </FormControl>
  );
};

// includes 기반 필터 operator 생성 로직 함수
export const createIncludesFilterOperators = (
  InputComponent: GridFilterOperator['InputComponent'],
): GridFilterOperator[] => [
  {
    label: '일치',
    value: 'includes',
    getApplyFilterFn: (filterItem) => {
      if (!Array.isArray(filterItem.value) || filterItem.value.length === 0) {
        return null;
      }

      return (value) => filterItem.value.includes(value);
    },
    InputComponent,
  },
];

// 날짜 셀 표시용 포맷
export const formatDateTimeCellValue = (
  value: Date | string | null | undefined,
  format = 'YYYY-MM-DD',
) => {
  if (!value) return '-';
  return dayjs(value).format(format);
};

// boolean 필터용 valueGetter 헬퍼
export const getBooleanFilterValue = <T,>(
  condition: boolean,
  value: T,
): T | null => {
  return condition ? value : null;
};
