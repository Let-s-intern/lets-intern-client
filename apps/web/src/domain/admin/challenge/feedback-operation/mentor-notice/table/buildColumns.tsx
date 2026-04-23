import type { GridColDef } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { FaEdit } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import type { ChallengeMentorGuideItem } from '@/api/challenge-mentor-guide/challengeMentorGuideSchema';
import { VisibleToggle } from '../ui/VisibleToggle';
import { EMPTY_MAP } from '../types';

interface BuildColumnsParams {
  onEdit: (guide: ChallengeMentorGuideItem) => void;
  onDelete: (guideId: number) => void;
  onToggleVisible: (guideId: number, isVisible: boolean) => void;
  challengeMap?: Map<number, string>;
  mentorMap?: Map<number, string>;
}

export function buildColumns({
  onEdit,
  onDelete,
  onToggleVisible,
  challengeMap = EMPTY_MAP,
  mentorMap = EMPTY_MAP,
}: BuildColumnsParams): GridColDef<ChallengeMentorGuideItem>[] {
  return [
    {
      field: 'title',
      headerName: '제목',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) => row.title ?? '-',
    },
    {
      field: 'contentType',
      headerName: '유형',
      width: 80,
      valueGetter: (_, row) => {
        if (!row.contents) return 'URL';
        try {
          const parsed = JSON.parse(row.contents);
          return parsed?.root ? '에디터' : 'MD';
        } catch {
          return 'MD';
        }
      },
    },
    {
      field: 'challengeScopeType',
      headerName: '챌린지',
      width: 160,
      valueGetter: (_, row) => {
        const scope = row.challengeScopeType ?? 'ALL';
        if (scope === 'ALL') return '전체 챌린지';
        if (scope === 'IN_PROGRESS') return '진행중 챌린지';
        if (row.challengeId) {
          return challengeMap.get(row.challengeId) ?? `챌린지 #${row.challengeId}`;
        }
        return '특정 챌린지';
      },
    },
    {
      field: 'mentorScopeType',
      headerName: '멘토',
      width: 140,
      valueGetter: (_, row) => {
        const scope = row.mentorScopeType ?? 'ALL_MENTOR';
        if (scope === 'ALL_MENTOR') return '모든 멘토';
        if (row.challengeMentorId) {
          return mentorMap.get(row.challengeMentorId) ?? `멘토 #${row.challengeMentorId}`;
        }
        return '특정 멘토';
      },
    },
    {
      field: 'link',
      headerName: '링크',
      flex: 1,
      minWidth: 150,
      renderCell: ({ row }) =>
        row.link ? (
          <a
            href={row.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {row.link}
          </a>
        ) : (
          <span className="text-neutral-40">-</span>
        ),
    },
    {
      field: 'dateType',
      headerName: '노출 기간',
      width: 140,
      valueGetter: (_, row) => {
        if (row.dateType === 'CHALLENGE') return '챌린지 기간';
        if (row.dateType === 'CUSTOM') {
          const s = row.startDate ? new Date(row.startDate).toLocaleDateString() : '?';
          const e = row.endDate ? new Date(row.endDate).toLocaleDateString() : '?';
          return `${s} ~ ${e}`;
        }
        return '무기한';
      },
    },
    {
      field: 'isFixed',
      headerName: '고정',
      width: 60,
      renderCell: ({ row }) =>
        row.isFixed ? (
          <span title="고정 공지">📌</span>
        ) : (
          <span className="text-neutral-40">-</span>
        ),
    },
    {
      field: 'isVisible',
      headerName: '노출',
      width: 80,
      renderCell: ({ row }) => (
        <VisibleToggle
          guideId={row.challengeMentorGuideId}
          initialValue={row.isVisible ?? false}
          onToggle={onToggleVisible}
        />
      ),
    },
    {
      field: 'createDate',
      headerName: '등록일',
      width: 140,
      valueGetter: (_, row) =>
        row.createDate ? new Date(row.createDate).toLocaleDateString() : '-',
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconButton size="small" onClick={() => onEdit(row)}>
            <FaEdit size={14} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(row.challengeMentorGuideId)}
          >
            <FaTrashCan size={14} />
          </IconButton>
        </div>
      ),
    },
  ];
}
