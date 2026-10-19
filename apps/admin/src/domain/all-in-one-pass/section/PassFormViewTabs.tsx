import { ToggleButton, ToggleButtonGroup } from '@mui/material';

export type PassFormView = 'info' | 'landing';

interface Props {
  value: PassFormView;
  onChange: (view: PassFormView) => void;
}

export default function PassFormViewTabs({ value, onChange }: Props) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      size="small"
      onChange={(_, next) => {
        if (next) onChange(next as PassFormView);
      }}
    >
      <ToggleButton color="primary" value="info">
        패스 정보 구성
      </ToggleButton>
      <ToggleButton color="secondary" value="landing">
        랜딩페이지 구성
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
