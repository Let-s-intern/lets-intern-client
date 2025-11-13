'use client';

import { TableData, TableHeader } from '@/components/common/table/DataTable';
import Image from 'next/image';
import { getExperienceHeaders } from '../data';

export const getExperienceHeadersWithDeleteAction = (
  onDeleteExperience?: (experienceId: number) => void,
  isSubmitted?: boolean,
  isEditing?: boolean,
): TableHeader[] => {
  const baseHeaders = getExperienceHeaders();
  const isDeleteDisabled = isSubmitted === true && isEditing !== true;

  return [
    ...baseHeaders,
    {
      key: 'deleteAction',
      label: '목록 삭제',
      width: '100px',
      align: { horizontal: 'center', vertical: 'middle' },
      cellRenderer: (_, row: TableData) => (
        <div className="flex h-full w-full items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (!isDeleteDisabled) {
                onDeleteExperience?.(row.originalId);
              }
            }}
            disabled={isDeleteDisabled}
            className={`flex items-center justify-center p-0.5 ${
              isDeleteDisabled
                ? 'cursor-not-allowed opacity-50'
                : 'hover:opacity-70'
            }`}
          >
            <Image src="/icons/trash.svg" alt="삭제" width={20} height={20} />
          </button>
        </div>
      ),
    },
  ];
};
