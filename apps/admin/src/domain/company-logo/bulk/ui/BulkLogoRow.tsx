import { Button, Checkbox, Popover, TextField } from '@mui/material';
import { useState } from 'react';

import FaviconCandidateGrid from '@/common/company-logo/FaviconCandidateGrid';

import type { BulkRow } from '../types/bulkRow';

const STATUS_LABELS: Record<BulkRow['status'], string> = {
  loading: '가져오는 중',
  ready: '완료',
  fetchFailed: '실패',
  saving: '저장 중',
  saved: '저장됨',
  saveFailed: '저장 실패',
};

const cellClass = 'px-3 py-2 align-middle text-sm';

interface Props {
  row: BulkRow;
  isDuplicate: boolean;
  /** 저장이 도는 동안은 모든 행을 잠근다 */
  isLocked: boolean;
  onChange: (patch: Partial<BulkRow>) => void;
  onRetry: () => void;
  onRemove: () => void;
}

/** 일괄 등록 표의 한 행. 로고 썸네일을 누르면 그 사이트의 다른 후보를 고를 수 있다 */
export default function BulkLogoRow({
  row,
  isDuplicate,
  isLocked,
  onChange,
  onRetry,
  onRemove,
}: Props) {
  const [pickerAnchor, setPickerAnchor] = useState<HTMLElement | null>(null);

  const isSaved = row.status === 'saved';
  const canEdit =
    !isLocked && (row.status === 'ready' || row.status === 'saveFailed');
  const selected = row.candidates.find(
    (candidate) => candidate.url === row.candidateUrl,
  );

  return (
    <tr className="border-neutral-90 border-b last:border-b-0">
      <td className={cellClass}>
        <Checkbox
          size="small"
          checked={row.checked}
          disabled={!canEdit}
          inputProps={{ 'aria-label': `${row.siteUrl} 저장 대상` }}
          onChange={(e) => onChange({ checked: e.target.checked })}
        />
      </td>
      <td className={`${cellClass} max-w-[14rem] break-all`}>{row.siteUrl}</td>
      <td className={cellClass}>
        <span
          className={
            row.status === 'fetchFailed' || row.status === 'saveFailed'
              ? 'text-system-error'
              : isSaved
                ? 'text-primary font-medium'
                : 'text-neutral-30'
          }
        >
          {STATUS_LABELS[row.status]}
        </span>
        {row.error ? (
          <p className="text-system-error text-xs">{row.error}</p>
        ) : null}
        {row.status === 'fetchFailed' ? (
          <Button
            size="small"
            variant="text"
            disabled={isLocked}
            onClick={onRetry}
          >
            다시 시도
          </Button>
        ) : null}
      </td>
      <td className={cellClass}>
        {selected ? (
          <button
            type="button"
            aria-label={`${row.siteUrl} 로고 후보 바꾸기`}
            disabled={!canEdit}
            onClick={(e) => setPickerAnchor(e.currentTarget)}
            className="bg-neutral-90 flex h-10 w-10 items-center justify-center overflow-hidden rounded"
          >
            <img
              src={selected.url}
              referrerPolicy="no-referrer"
              alt=""
              className="h-full w-full object-contain"
            />
          </button>
        ) : (
          <span className="text-neutral-40 text-xs">-</span>
        )}
        <Popover
          open={pickerAnchor !== null}
          anchorEl={pickerAnchor}
          onClose={() => setPickerAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <div className="w-[22rem] p-3">
            <FaviconCandidateGrid
              candidates={row.candidates}
              selectedUrl={row.candidateUrl}
              onSelect={(candidateUrl) => {
                onChange({ candidateUrl });
                setPickerAnchor(null);
              }}
            />
          </div>
        </Popover>
      </td>
      <td className={cellClass}>
        <div className="flex items-center gap-2">
          <TextField
            size="small"
            value={row.name}
            disabled={!canEdit}
            inputProps={{
              maxLength: 100,
              'aria-label': `${row.siteUrl} 회사명`,
            }}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          {isDuplicate && !isSaved ? (
            <span className="shrink-0 rounded bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              중복
            </span>
          ) : null}
        </div>
      </td>
      <td className={cellClass}>
        <Button
          size="small"
          color="inherit"
          disabled={isLocked || row.status === 'saving'}
          onClick={onRemove}
        >
          삭제
        </Button>
      </td>
    </tr>
  );
}
