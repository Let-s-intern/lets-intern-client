'use client';

import { fetchManageableMagnets } from '@/domain/admin/blog/magnet/mock';
import { MAGNET_TYPE } from '@/domain/admin/blog/magnet/types';
import Heading2 from '@/domain/admin/ui/heading/Heading2';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useMemo } from 'react';

interface MagnetRecommendSectionProps {
  magnetRecommend: (number | null)[];
  onChangeMagnetRecommend: (items: (number | null)[]) => void;
}

const MagnetRecommendSection = ({
  magnetRecommend,
  onChangeMagnetRecommend,
}: MagnetRecommendSectionProps) => {
  // TODO: API 준비 후 React Query 훅으로 교체
  const magnetMenuItems = useMemo(
    () => [
      <MenuItem key="null" value="null">
        선택 안 함
      </MenuItem>,
      ...fetchManageableMagnets().map((m) => (
        <MenuItem key={m.id} value={m.id}>
          {`[${m.id}] ${MAGNET_TYPE[m.type]} - ${m.title}`}
        </MenuItem>
      )),
    ],
    [],
  );

  const handleChange = (
    e: SelectChangeEvent<number | 'null'>,
    index: number,
  ) => {
    const list = [...magnetRecommend];
    const value = e.target.value;
    list[index] = value === 'null' ? null : Number(value);
    onChangeMagnetRecommend(list);
  };

  return (
    <div className="flex-1">
      <Heading2 className="mb-3">마그넷 추천</Heading2>
      <div className="flex flex-col gap-3">
        {magnetRecommend.map((id, index) => (
          <FormControl key={index} size="small">
            <InputLabel>자료집 ID {index + 1}</InputLabel>
            <Select
              value={id ?? 'null'}
              fullWidth
              size="small"
              label={'자료집 ID ' + (index + 1)}
              onChange={(e) => handleChange(e, index)}
            >
              {magnetMenuItems}
            </Select>
          </FormControl>
        ))}
      </div>
    </div>
  );
};

export default MagnetRecommendSection;
