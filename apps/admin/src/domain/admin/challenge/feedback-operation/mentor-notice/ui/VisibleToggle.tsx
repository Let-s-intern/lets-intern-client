import { useState } from 'react';
import { Switch } from '@mui/material';

interface VisibleToggleProps {
  guideId: number;
  initialValue: boolean;
  onToggle: (guideId: number, isVisible: boolean) => void;
}

/** 노출 토글 — 로컬 state로 즉시 반영 */
export function VisibleToggle({
  guideId,
  initialValue,
  onToggle,
}: VisibleToggleProps) {
  const [checked, setChecked] = useState(initialValue);
  return (
    <Switch
      size="small"
      checked={checked}
      onChange={(_, v) => {
        setChecked(v);
        onToggle(guideId, v);
      }}
    />
  );
}
