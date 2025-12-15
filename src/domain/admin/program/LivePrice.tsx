import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import Input from '@/common/input/Input';
import { CreateLiveReq, LiveIdSchema, UpdateLiveReq } from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';

interface LivePriceProps<T extends CreateLiveReq | UpdateLiveReq> {
  defaultValue?: LiveIdSchema['priceInfo'];
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export const initialLivePrice = {
  livePriceType: 'CHARGE',
  priceInfo: {
    discount: 4000,
    price: 10000,
    deadline: '2024-10-10T00:00:00',
    accountNumber: '',
    accountType: 'HANA',
  },
} satisfies CreateLiveReq['priceInfo'];

export default function LivePrice<T extends CreateLiveReq | UpdateLiveReq>({
  defaultValue,
  setInput,
}: LivePriceProps<T>) {
  const defaultPriceReq: CreateLiveReq['priceInfo'] = {
    livePriceType:
      defaultValue?.livePriceType ?? initialLivePrice.livePriceType,
    priceInfo: {
      discount: defaultValue?.discount ?? initialLivePrice.priceInfo.discount,
      price: defaultValue?.price ?? initialLivePrice.priceInfo.price,
      deadline:
        defaultValue?.deadline?.format('YYYY-MM-DDTHH:mm') ??
        initialLivePrice.priceInfo.deadline,
      accountNumber:
        defaultValue?.accountNumber ?? initialLivePrice.priceInfo.accountNumber,
      accountType:
        defaultValue?.accountType ?? initialLivePrice.priceInfo.accountType,
    },
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
          defaultValue={defaultPriceReq.livePriceType}
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: {
                ...defaultPriceReq,
                ...prev.priceInfo,
                livePriceType: e.target.value,
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
        defaultValue={String(defaultPriceReq.priceInfo.price)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: {
              ...defaultPriceReq,
              ...prev.priceInfo,
              priceInfo: {
                ...defaultPriceReq.priceInfo,
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
        defaultValue={String(defaultPriceReq.priceInfo.discount)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: {
              ...defaultPriceReq,
              ...prev.priceInfo,
              priceInfo: {
                ...defaultPriceReq.priceInfo,
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
