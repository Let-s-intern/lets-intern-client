import Input from '@/common/input/v1/Input';
import type { CreateGuidebookReq, GuidebookPriceType } from '@/schema';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import type React from 'react';
import { useCallback } from 'react';

interface GuidebookPriceSectionProps {
  input: CreateGuidebookReq;
  setInput: React.Dispatch<React.SetStateAction<CreateGuidebookReq>>;
}

const GuidebookPriceSection: React.FC<GuidebookPriceSectionProps> = ({
  input,
  setInput,
}) => {
  const onChangeNumber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const numericValue = Number(value.replace(/[^0-9]/g, '')) || 0;

      setInput((prev) => ({
        ...prev,
        priceInfo: {
          ...prev.priceInfo,
          priceInfo: {
            ...prev.priceInfo.priceInfo,
            [name]: numericValue,
          },
        },
      }));
    },
    [setInput],
  );

  const onChangePriceType = useCallback(
    (event: SelectChangeEvent<GuidebookPriceType>) => {
      const value = event.target.value as GuidebookPriceType;
      setInput((prev) => ({
        ...prev,
        priceInfo: {
          ...prev.priceInfo,
          guideBookPriceType: value,
        },
      }));
    },
    [setInput],
  );

  const price = input.priceInfo.priceInfo.price;
  const discount = input.priceInfo.priceInfo.discount;

  const GUIDEBOOK_PRICE_TYPES: GuidebookPriceType[] = ['CHARGE', 'FREE'];
  const GUIDEBOOK_PRICE_TYPE_LABELS: Record<GuidebookPriceType, string> = {
    CHARGE: '이용료',
    FREE: '무료',
  };

  return (
    <section className="flex flex-col gap-3">
      <FormControl size="small">
        <InputLabel id="guidebookPriceType">금액유형</InputLabel>
        <Select
          labelId="guidebookPriceType"
          id="guidebookPriceType"
          label="금액유형"
          value={input.priceInfo.guideBookPriceType ?? 'CHARGE'}
          onChange={onChangePriceType}
        >
          {GUIDEBOOK_PRICE_TYPES.map((value) => (
            <MenuItem key={value} value={value}>
              {GUIDEBOOK_PRICE_TYPE_LABELS[value]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Input
        label="이용료 금액"
        type="number"
        name="price"
        size="small"
        value={String(price ?? 0)}
        onChange={onChangeNumber}
      />
      <Input
        label="할인 금액"
        type="number"
        name="discount"
        size="small"
        value={String(discount ?? 0)}
        onChange={onChangeNumber}
      />
    </section>
  );
};

export default GuidebookPriceSection;
