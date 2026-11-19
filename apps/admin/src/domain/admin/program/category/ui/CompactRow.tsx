import { IconButton, Switch } from '@mui/material';
import type React from 'react';
import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import RenameDialog from './RenameDialog';
import RowMenu, { type RowMenuItem } from './RowMenu';

/**
 * 한 줄에는 이름·요약·순서·노출만 둔다. 이름 바꾸기와 삭제 같은 나머지는 "⋯" 안에 있다
 */
const CompactRow = ({
  title,
  caption,
  isVisible,
  isFirst,
  isLast,
  active,
  strong,
  onClick,
  onRename,
  onToggleVisible,
  onMove,
  menuItems = [],
  renameLabel = '이름',
}: {
  title: string;
  caption?: string;
  isVisible: boolean;
  isFirst: boolean;
  isLast: boolean;
  active?: boolean;
  strong?: boolean;
  onClick?: () => void;
  onRename: (title: string) => void;
  onToggleVisible: (isVisible: boolean) => void;
  onMove: (direction: -1 | 1) => void;
  /** 이름 바꾸기 뒤에 붙는 항목 */
  menuItems?: RowMenuItem[];
  renameLabel?: string;
}) => {
  const [renaming, setRenaming] = useState(false);
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <div
      className={`flex min-h-10 items-center gap-1 rounded-xs pl-3 pr-1 ${
        active ? 'bg-neutral-95' : 'hover:bg-neutral-95'
      } ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <span
          className={`truncate ${strong ? 'font-semibold text-neutral-0' : 'text-neutral-10'} ${
            isVisible ? '' : 'text-neutral-50'
          }`}
        >
          {title}
        </span>
        {!isVisible && (
          <span className="shrink-0 text-xxsmall12 text-neutral-50">숨김</span>
        )}
        {caption && (
          <span className="truncate text-xxsmall12 text-neutral-40">
            {caption}
          </span>
        )}
      </div>
      <IconButton
        size="small"
        disabled={isFirst}
        onClick={(e) => {
          stop(e);
          onMove(-1);
        }}
        aria-label="위로"
      >
        <FaArrowUp size={11} />
      </IconButton>
      <IconButton
        size="small"
        disabled={isLast}
        onClick={(e) => {
          stop(e);
          onMove(1);
        }}
        aria-label="아래로"
      >
        <FaArrowDown size={11} />
      </IconButton>
      <Switch
        size="small"
        checked={isVisible}
        onClick={stop}
        onChange={(e) => onToggleVisible(e.target.checked)}
        inputProps={{ 'aria-label': '노출' }}
      />
      <RowMenu
        items={[
          { label: `${renameLabel} 바꾸기`, onClick: () => setRenaming(true) },
          ...menuItems,
        ]}
      />
      {renaming && (
        <span onClick={stop}>
          <RenameDialog
            title={title}
            label={renameLabel}
            onClose={() => setRenaming(false)}
            onSave={onRename}
          />
        </span>
      )}
    </div>
  );
};

export default CompactRow;
