import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import { CreateChallengeReq } from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';
import Input from '@components/ui/input/Input';

interface ChallengePriceProps {
  input: Omit<CreateChallengeReq, 'desc'>;
  setInput: React.Dispatch<
    React.SetStateAction<Omit<CreateChallengeReq, 'desc'>>
  >;
}

export default function ChallengePrice({
  input,
  setInput,
}: ChallengePriceProps) {
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
                { ...prev.priceInfo[0], [e.target.name]: e.target.value },
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
              ...input.priceInfo[0],
              charge: Number(value),
              priceInfo: {
                ...input.priceInfo[0].priceInfo,
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
          name="basicRefund"
          size="small"
          placeholder="보증금 금액을 입력해주세요"
          onChange={(e) => {
            setInput({
              ...input,
              [e.target.name]: e.target.value,
            });
          }}
        />
      )}
      <Input
        label="베이직 할인 금액"
        type="number"
        name="basicDiscount"
        size="small"
        placeholder="할인 금액을 입력해주세요"
        onChange={(e) => {
          setInput({
            ...input,
            [e.target.name]: e.target.value,
          });
        }}
      />
    </div>
  );
}
