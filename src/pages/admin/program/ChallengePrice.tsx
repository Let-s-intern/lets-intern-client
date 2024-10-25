import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { CreateChallengeReq, UpdateChallengeReq } from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';
import Input from '@components/ui/input/Input';

interface ChallengePriceProps<
  T extends CreateChallengeReq | UpdateChallengeReq,
> {
  input: Omit<T, 'desc'>;
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function ChallengePrice<
  T extends CreateChallengeReq | UpdateChallengeReq,
>({ input, setInput }: ChallengePriceProps<T>) {
  if (input.priceInfo === undefined || input.priceInfo.length === 0)
    return <></>;

  return (
    <div className="flex flex-col gap-3">
      <FormControl fullWidth size="small">
        <InputLabel id="challengePriceTypeLabel">금액유형</InputLabel>
        <Select
          labelId="challengePriceTypeLabel"
          id="challengePriceType"
          name="challengePriceType"
          label="금액유형"
          value={input.priceInfo[0].challengePriceType}
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                { ...prev.priceInfo![0], [e.target.name]: e.target.value },
              ],
            }));
          }}
        >
          <MenuItem value="CHARGE">
            {newProgramFeeTypeToText['CHARGE']}
          </MenuItem>
          <MenuItem value="REFUND">
            {newProgramFeeTypeToText['REFUND']}
          </MenuItem>
        </Select>
      </FormControl>
      <Input
        label="베이직 이용료 금액"
        type="number"
        name="basicPrice"
        size="small"
        placeholder="이용료 금액을 입력해주세요"
        onChange={(e) => {
          const value = e.target.value;
          const priceInfo = [
            {
              ...input.priceInfo![0],
              charge: Number(value),
              priceInfo: {
                ...input.priceInfo![0].priceInfo,
                price: Number(value),
              },
            },
          ];

          setInput((prev) => ({
            ...prev,
            priceInfo,
          }));
        }}
      />
      {input.priceInfo[0].challengePriceType === 'REFUND' && (
        <Input
          label="베이직 보증금 금액"
          type="number"
          name="refund"
          size="small"
          placeholder="보증금 금액을 입력해주세요"
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                { ...prev.priceInfo![0], refund: Number(e.target.value) },
              ],
            }));
          }}
        />
      )}
      <Input
        label="베이직 할인 금액"
        type="number"
        name="discount"
        size="small"
        placeholder="할인 금액을 입력해주세요"
        onChange={(e) => {
          const priceInfo = [
            {
              ...input.priceInfo![0],
              priceInfo: {
                ...input.priceInfo![0].priceInfo,
                discount: Number(e.target.value),
              },
            },
          ];

          setInput((prev) => ({
            ...prev,
            priceInfo,
          }));
        }}
      />
    </div>
  );
}
