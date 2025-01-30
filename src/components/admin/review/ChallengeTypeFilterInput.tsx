import { ChallengeType } from '@/schema';
import { challengeTypes, challengeTypeToDisplay } from '@/utils/convert';
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Popover,
} from '@mui/material';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { useRef, useState } from 'react';

const ChallengeTypeFilterInput = (props: GridFilterInputValueProps) => {
  const { item, applyValue } = props;
  const selectedValues = item.value || [];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v: string) => v !== value);

    applyValue({ ...item, value: newValues });
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // 선택된 필터 값을 요약하는 함수
  const getDisplayText = () => {
    if (!selectedValues.length) return '전체';
    if (selectedValues.length === 1)
      return challengeTypeToDisplay[selectedValues[0] as ChallengeType];
    return `${challengeTypeToDisplay[selectedValues[0] as ChallengeType]} 외 ${
      selectedValues.length - 1
    }`;
  };

  return (
    <FormControl className="h-full" component="fieldset">
      {/* 필터 버튼 */}
      <Button
        ref={buttonRef}
        variant="outlined"
        className="h-full"
        onClick={handleOpen}
        fullWidth
      >
        {getDisplayText()}
      </Button>

      {/* 팝오버 (체크박스 필터) */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <FormGroup sx={{ padding: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={
                  selectedValues.length === challengeTypes.length ||
                  selectedValues.length === 0
                }
                onChange={(e) => {
                  applyValue({
                    ...item,
                    value: e.target.checked ? challengeTypes : [],
                  });
                }}
                value=""
              />
            }
            label="전체"
          />
          {challengeTypes.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  checked={selectedValues.includes(type)}
                  onChange={handleChange}
                  value={type}
                />
              }
              label={challengeTypeToDisplay[type as ChallengeType]}
            />
          ))}
        </FormGroup>
      </Popover>
    </FormControl>
  );
};

export default ChallengeTypeFilterInput;
