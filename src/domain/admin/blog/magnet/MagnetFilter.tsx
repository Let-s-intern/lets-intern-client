'use client';

import ActionButton from '@/domain/admin/ui/button/ActionButton';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { MAGNET_TYPE, MagnetFilterValues, MagnetTypeKey } from './types';

interface MagnetFilterProps {
  values: MagnetFilterValues;
  onChange: (values: MagnetFilterValues) => void;
  onSearch: () => void;
  onShowAll: () => void;
}

const MagnetFilter = ({
  values,
  onChange,
  onSearch,
  onShowAll,
}: MagnetFilterProps) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div>
      <div className="rounded border border-neutral-200 bg-white p-4">
        <div className="mb-3 flex gap-4">
          <TextField
            size="small"
            label="마그넷 ID"
            value={values.magnetId}
            onChange={(e) =>
              onChange({ ...values, magnetId: e.target.value })
            }
            onKeyDown={handleKeyDown}
            fullWidth
          />
          <FormControl size="small" fullWidth>
            <InputLabel>타입</InputLabel>
            <Select
              value={values.type}
              label="타입"
              onChange={(e) =>
                onChange({ ...values, type: e.target.value })
              }
            >
              <MenuItem value="">전체</MenuItem>
              {Object.entries(MAGNET_TYPE).map(([key, label]) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="mb-3">
          <TextField
            size="small"
            label="제목 키워드"
            value={values.titleKeyword}
            onChange={(e) =>
              onChange({ ...values, titleKeyword: e.target.value })
            }
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            type="button"
            bgColor="blue"
            width="5rem"
            onClick={onSearch}
          >
            검색
          </ActionButton>
          <ActionButton
            type="button"
            bgColor="gray"
            width="5rem"
            onClick={onShowAll}
          >
            전체보기
          </ActionButton>
          <span className="ml-2 text-sm text-neutral-500">
            여러 값을 입력할 경우 쉼표(,) 또는 줄바꿈으로 구분해주세요.
          </span>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-400">
        필터 적용 시 페이지는 초기화됩니다. 그리드의 정렬 및 검색 기능은
        지원하지 않습니다.
      </p>
    </div>
  );
};

export default MagnetFilter;
