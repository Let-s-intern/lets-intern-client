import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { ReactNode } from 'react';

interface Props<T> {
  defaultValue?: T;
  value?: T;
  onChange?: (e: SelectChangeEvent<T>) => void;
  renderValue: (selectedList: T) => JSX.Element;
  children: ReactNode;
  label: string;
  labelId: string;
}

/**
 * 프로그램 분류, B2 타입 등 중복 선택이 가능한 드롭다운 컴포넌트
 * @param children: Select 선택 목록
 */

function SelectFormControl<T>({
  defaultValue,
  value,
  onChange,
  renderValue,
  children,
  label,
  labelId,
}: Props<T>) {
  return (
    <FormControl size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        id={labelId}
        name={labelId}
        multiple
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        input={<OutlinedInput label={label} />}
        renderValue={renderValue}
      >
        {children}
      </Select>
    </FormControl>
  );
}

export default SelectFormControl;
