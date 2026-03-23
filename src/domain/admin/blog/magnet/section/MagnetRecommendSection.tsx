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
  currentMagnetId: number;
}

const MagnetRecommendSection = ({
  magnetRecommend,
  onChangeMagnetRecommend,
  currentMagnetId,
}: MagnetRecommendSectionProps) => {
  // TODO: API 준비 후 React Query 훅으로 교체
  const allMagnets = useMemo(
    () =>
      fetchManageableMagnets().filter((m) => m.magnetId !== currentMagnetId),
    [currentMagnetId],
  );

  const magnetMenuItems = useMemo(
    () => [
      <MenuItem key="null" value="null">
        선택 안 함 (기본값 자동 노출)
      </MenuItem>,
      ...allMagnets.map((m) => (
        <MenuItem key={m.magnetId} value={m.magnetId}>
          {`[${m.magnetId}] ${MAGNET_TYPE[m.type]} - ${m.title}`}
        </MenuItem>
      )),
    ],
    [allMagnets],
  );

  /** 미설정 슬롯에 채워질 기본값: 이미 선택된 ID와 현재 마그넷을 제외한 최신 순 */
  const defaultMagnets = useMemo(() => {
    const selectedIds = new Set(
      magnetRecommend.filter((id): id is number => id !== null),
    );
    return allMagnets.filter((m) => !selectedIds.has(m.magnetId));
  }, [allMagnets, magnetRecommend]);

  const getDefaultLabel = (index: number): string | null => {
    let defaultIndex = 0;
    for (let i = 0; i < index; i++) {
      if (magnetRecommend[i] === null) defaultIndex++;
    }
    const magnet = defaultMagnets[defaultIndex];
    if (!magnet) return null;
    return `[${magnet.magnetId}] ${MAGNET_TYPE[magnet.type]} - ${magnet.title}`;
  };

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
      <p className="mb-2 text-xs text-gray-500">
        미설정 시 해당 마그넷을 제외한 최신 마그넷(자료집, VOD, 무료 템플릿)이
        자동 노출됩니다.
      </p>
      <div className="flex flex-col gap-3">
        {magnetRecommend.map((id, index) => {
          const defaultLabel = id === null ? getDefaultLabel(index) : null;
          return (
            <div key={`magnet-recommend-${index}`}>
              <FormControl size="small" fullWidth>
                <InputLabel>마그넷 {index + 1}</InputLabel>
                <Select
                  value={id ?? 'null'}
                  size="small"
                  label={`마그넷 ${index + 1}`}
                  onChange={(e) => handleChange(e, index)}
                >
                  {magnetMenuItems}
                </Select>
              </FormControl>
              {defaultLabel && (
                <p className="mt-1 text-xs text-blue-500">
                  기본값: {defaultLabel}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MagnetRecommendSection;
