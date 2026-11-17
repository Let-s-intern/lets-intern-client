import { Button, IconButton, Switch, TextField } from '@mui/material';
import type React from 'react';
import { useEffect, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaPen, FaTrash } from 'react-icons/fa';

interface ItemRowProps {
  title: string;
  caption?: string;
  isVisible: boolean;
  /** 노출 목록 제목 줄처럼 굵게 보여야 하는 줄 */
  strong?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onRename: (title: string) => void;
  onToggleVisible: (isVisible: boolean) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}

/** 평소에는 글자로 보이고, 연필을 누르면 이름 칸이 된다. Enter·포커스 이탈로 저장, Esc 로 취소 */
export const ItemRow = ({
  title,
  caption,
  isVisible,
  strong,
  isFirst,
  isLast,
  onRename,
  onToggleVisible,
  onMove,
  onDelete,
}: ItemRowProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);

  useEffect(() => setValue(title), [title]);

  const commit = () => {
    setEditing(false);
    const next = value.trim();
    if (!next) {
      setValue(title);
      return;
    }
    if (next !== title) onRename(next);
  };

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <li className="flex min-h-11 items-center gap-1 rounded-xs py-1 pl-3 pr-1 hover:bg-neutral-95">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {editing ? (
          <TextField
            size="small"
            autoFocus
            onFocus={(e) => e.target.select()}
            value={value}
            inputProps={{ maxLength: 30 }}
            onClick={stop}
            onChange={(e) => setValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
              if (e.key === 'Escape') {
                e.stopPropagation();
                setValue(title);
                setEditing(false);
              }
            }}
            sx={{ flex: 1 }}
          />
        ) : (
          <>
            <span
              className={`truncate ${strong ? 'text-small18 font-semibold text-neutral-0' : 'text-neutral-10'} ${
                isVisible ? '' : 'text-neutral-50 line-through'
              }`}
            >
              {title}
            </span>
            {!isVisible && (
              <span className="shrink-0 rounded-xs bg-neutral-90 px-1.5 text-xsmall14 text-neutral-40">
                숨김
              </span>
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                stop(e);
                setEditing(true);
              }}
              aria-label="이름 변경"
            >
              <FaPen size={11} />
            </IconButton>
          </>
        )}
      </div>
      {caption && (
        <span className="shrink-0 text-xsmall14 text-neutral-40">
          {caption}
        </span>
      )}
      <IconButton
        size="small"
        disabled={isFirst}
        onClick={(e) => {
          stop(e);
          onMove(-1);
        }}
        aria-label="위로"
      >
        <FaArrowUp size={12} />
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
        <FaArrowDown size={12} />
      </IconButton>
      <Switch
        size="small"
        checked={isVisible}
        onClick={stop}
        onChange={(e) => onToggleVisible(e.target.checked)}
        inputProps={{ 'aria-label': '노출' }}
      />
      <IconButton
        size="small"
        onClick={(e) => {
          stop(e);
          onDelete();
        }}
        aria-label="삭제"
      >
        <FaTrash size={12} />
      </IconButton>
    </li>
  );
};

export const AddRow = ({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (title: string) => Promise<unknown>;
}) => {
  const [value, setValue] = useState('');

  const submit = async () => {
    const title = value.trim();
    if (!title) return;
    await onAdd(title);
    setValue('');
  };

  return (
    <div className="mt-2 flex gap-2">
      <TextField
        size="small"
        placeholder={placeholder}
        value={value}
        inputProps={{ maxLength: 30 }}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        sx={{ flex: 1 }}
      />
      <Button variant="outlined" onClick={submit}>
        추가
      </Button>
    </div>
  );
};
