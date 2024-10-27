import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { CreateLiveReq, LiveIdSchema, UpdateLiveReq } from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';
import Input from '@components/ui/input/Input';
import dayjs from 'dayjs';

interface LivePriceProps<T extends CreateLiveReq | UpdateLiveReq> {
  defaultValue?: LiveIdSchema['priceInfo'];
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function LivePrice<T extends CreateLiveReq | UpdateLiveReq>({
  defaultValue,
  setInput,
}: LivePriceProps<T>) {
  const priceInfo: LiveIdSchema['priceInfo'] = defaultValue ?? {
    priceId: 0,
    accountType: 'HANA',
    livePriceType: 'CHARGE',
    accountNumber: '',
    deadline: dayjs(),
    discount: 4000,
    price: 10000,
  };

  return (
    <div className="flex flex-col gap-3">
      <FormControl fullWidth size="small">
        <InputLabel id="livePriceTypeLabel">금액유형</InputLabel>
        <Select
          labelId="livePriceTypeLabel"
          id="livePriceType"
          name="livePriceType"
          label="금액유형"
          defaultValue={priceInfo.livePriceType ?? 'CHARGE'}
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
        defaultValue={String(priceInfo.price)}
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
        defaultValue={String(priceInfo.discount)}
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
