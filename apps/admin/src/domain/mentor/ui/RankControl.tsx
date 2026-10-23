import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const iconButtonStyle = { minWidth: 0, padding: 8 };

interface RankControlProps {
  /** 1부터 */
  rank: number;
  total: number;
  onRankChange: (rank: number) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  disabled?: boolean;
}

/**
 * 노출 순위 조작. 숫자는 Enter·포커스 해제 때만 반영하고, 입력 중에는 움직이지 않는다.
 */
const RankControl = ({
  rank,
  total,
  onRankChange,
  onMoveUp,
  onMoveDown,
  disabled = false,
}: RankControlProps) => {
  const [draft, setDraft] = useState(String(rank));
  const [prevRank, setPrevRank] = useState(rank);

  // 순서가 바뀌어 rank 가 달라지면 입력값을 새 순위로 맞춘다
  if (rank !== prevRank) {
    setPrevRank(rank);
    setDraft(String(rank));
  }

  const commit = () => {
    const parsed = Number(draft.trim());
    if (draft.trim() === '' || !Number.isInteger(parsed)) {
      setDraft(String(rank));
      return;
    }
    const clamped = Math.min(Math.max(parsed, 1), total);
    setDraft(String(clamped));
    if (clamped !== rank) onRankChange(clamped);
  };

  return (
    <div className="flex items-center gap-1">
      <TextField
        size="small"
        value={draft}
        disabled={disabled}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
        }}
        inputProps={{
          'aria-label': '노출 순위',
          inputMode: 'numeric',
          style: { width: 40, textAlign: 'center' },
        }}
      />
      <Button
        variant="text"
        aria-label="위로 이동"
        disabled={disabled || rank <= 1}
        onClick={onMoveUp}
        style={iconButtonStyle}
      >
        <FaArrowUp />
      </Button>
      <Button
        variant="text"
        aria-label="아래로 이동"
        disabled={disabled || rank >= total}
        onClick={onMoveDown}
        style={iconButtonStyle}
      >
        <FaArrowDown />
      </Button>
    </div>
  );
};

export default RankControl;
