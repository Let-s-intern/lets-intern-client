'use client';

import {
  useGetMyMagnetListQuery,
  useGetUserMagnetListQuery,
} from '@/api/magnet/magnet';
import { LIBRARY_VISIBLE_MAGNET_TYPES } from '@/api/magnet/magnetSchema';
import CheckBox from '@/common/box/CheckBox';
import { useMemo } from 'react';

const EXTRA_MAGNET_PAGE_SIZE = 100;

interface EventExtraMagnetSectionProps {
  selectedMagnetIds: number[];
  onSelectedMagnetIdsChange: (ids: number[]) => void;
}

const EventExtraMagnetSection = ({
  selectedMagnetIds,
  onSelectedMagnetIdsChange,
}: EventExtraMagnetSectionProps) => {
  const { data: candidateData, isLoading: isCandidateLoading } =
    useGetUserMagnetListQuery({
      typeList: [...LIBRARY_VISIBLE_MAGNET_TYPES],
      pageable: { page: 1, size: EXTRA_MAGNET_PAGE_SIZE },
    });

  const { data: appliedData, isLoading: isAppliedLoading } =
    useGetMyMagnetListQuery({
      typeList: [...LIBRARY_VISIBLE_MAGNET_TYPES],
      pageable: { page: 1, size: EXTRA_MAGNET_PAGE_SIZE },
    });

  const availableMagnets = useMemo(() => {
    if (!candidateData) return [];
    const appliedIds = new Set(
      (appliedData?.magnetList ?? []).map((m) => m.magnetId),
    );
    return candidateData.magnetList.filter((m) => !appliedIds.has(m.magnetId));
  }, [candidateData, appliedData]);

  if (isCandidateLoading || isAppliedLoading) return null;
  if (availableMagnets.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-xsmall14 md:text-xsmall16 text-neutral-0 font-semibold">
          함께 받아볼 자료집
        </span>
        <span className="text-xsmall12 md:text-xsmall14 text-neutral-40">
          관심 있는 자료집을 선택하면 이번 신청과 함께 받아볼 수 있어요.
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {availableMagnets.map((magnet) => {
          const isSelected = selectedMagnetIds.includes(magnet.magnetId);
          return (
            <button
              key={magnet.magnetId}
              type="button"
              onClick={() => {
                const newIds = isSelected
                  ? selectedMagnetIds.filter((id) => id !== magnet.magnetId)
                  : [...selectedMagnetIds, magnet.magnetId];
                onSelectedMagnetIdsChange(newIds);
              }}
              className="text-xsmall14 flex w-full items-center gap-1"
            >
              <CheckBox checked={isSelected} width="w-6" showCheckIcon />
              <span className="text-xsmall14 md:text-xsmall16">
                {magnet.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EventExtraMagnetSection;
