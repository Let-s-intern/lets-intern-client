import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { CreateLiveReq, UpdateLiveReq } from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';
import Input from '@components/ui/input/Input';

interface LivePriceProps<T extends CreateLiveReq | UpdateLiveReq> {
  input: Omit<T, 'desc'>;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function LivePrice<T extends CreateLiveReq | UpdateLiveReq>({
  input,
  setInput,
}: LivePriceProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <FormControl fullWidth size="small">
        <InputLabel id="livePriceTypeLabel">금액유형</InputLabel>
        <Select
          labelId="livePriceTypeLabel"
          id="livePriceType"
          name="livePriceType"
          label="금액유형"
          value={input.priceInfo?.livePriceType}
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: {
                ...prev.priceInfo,
                [e.target.name]: e.target.value,
              },
            }));
          }}
        >
          <MenuItem value="CHARGE">
            {newProgramFeeTypeToText['CHARGE']}
          </MenuItem>
          <MenuItem value="FREE">{newProgramFeeTypeToText['FREE']}</MenuItem>
        </Select>
      </FormControl>
      <Input
        label="이용료 금액"
        type="number"
        name="price"
        size="small"
        placeholder="이용료 금액을 입력해주세요"
        value={String(input.priceInfo?.priceInfo.price)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: {
              ...prev.priceInfo,
              priceInfo: {
                ...prev.priceInfo?.priceInfo,
                [e.target.name]: e.target.value,
              },
            },
          }));
        }}
      />
      <Input
        label="할인 금액"
        type="number"
        name="discount"
        size="small"
        placeholder="할인 금액을 입력해주세요"
        value={String(input.priceInfo?.priceInfo.discount)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: {
              ...prev.priceInfo,
              priceInfo: {
                ...prev.priceInfo?.priceInfo,
                [e.target.name]: e.target.value,
              },
            },
          }));
        }}
      />
    </div>
  );
}
