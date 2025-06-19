import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  SelectProps,
} from '@mui/material';
import { ReactNode } from 'react';

const FORM_CONTROL_SX = { width: '100%' };

interface Props<T> {
  defaultValue?: T;
  value?: T;
  onChange?: (e: SelectChangeEvent<T>) => void;
  children: ReactNode;
  label: string;
  labelId: string;
}

/**
 * 프로그램 분류, B2 타입 등 중복/단일 선택이 가능한 드롭다운 컴포넌트
 * @param children: Select 선택 목록
 */

function SelectFormControl<T>({
  children,
  label,
  labelId,
  ...restSelectProps
}: Props<T> & SelectProps<T>) {
  return (
    <FormControl sx={FORM_CONTROL_SX} size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        id={labelId}
        name={labelId}
        input={<OutlinedInput label={label} />}
        {...restSelectProps}
      >
        {children}
      </Select>
    </FormControl>
  );
}

export default SelectFormControl;
