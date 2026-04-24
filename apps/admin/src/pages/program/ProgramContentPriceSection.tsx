import Input from '@/common/input/v1/Input';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import type React from 'react';
import { useCallback } from 'react';

import type { ContentProgramFormInput } from './programContentTypes';

type PriceType = ContentProgramFormInput['priceType'];

const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  CHARGE: '이용료',
  FREE: '무료',
};

interface ProgramContentPriceSectionProps {
  input: ContentProgramFormInput;
  setInput: React.Dispatch<React.SetStateAction<ContentProgramFormInput>>;
}

const ProgramContentPriceSection: React.FC<ProgramContentPriceSectionProps> = ({
  input,
  setInput,
}) => {
  const onChangeNumber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const numericValue = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
      setInput((prev) => ({ ...prev, [e.target.name]: numericValue }));
    },
    [setInput],
  );

  const onChangePriceType = useCallback(
    (e: SelectChangeEvent<PriceType>) => {
      setInput((prev) => ({
        ...prev,
        priceType: e.target.value as PriceType,
      }));
    },
    [setInput],
  );

  return (
    <section className="flex flex-col gap-3">
      <FormControl size="small">
        <InputLabel id="priceType">금액유형</InputLabel>
        <Select
          labelId="priceType"
          id="priceType"
          label="금액유형"
          value={input.priceType}
          onChange={onChangePriceType}
        >
          {(Object.keys(PRICE_TYPE_LABELS) as PriceType[]).map((value) => (
            <MenuItem key={value} value={value}>
              {PRICE_TYPE_LABELS[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Input
        label="이용료 금액"
        type="number"
        name="price"
        size="small"
        value={String(input.price)}
        onChange={onChangeNumber}
      />
      <Input
        label="할인 금액"
        type="number"
        name="discount"
        size="small"
        value={String(input.discount)}
        onChange={onChangeNumber}
      />
    </section>
  );
};

export default ProgramContentPriceSection;
