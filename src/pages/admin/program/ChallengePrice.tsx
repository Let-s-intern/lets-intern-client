import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import {
  ChallengeIdSchema,
  CreateChallengeReq,
  UpdateChallengeReq,
} from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';
import Input from '@components/ui/input/Input';

interface IChallengePriceProps<
  T extends CreateChallengeReq | UpdateChallengeReq,
> {
  defaultValue?: ChallengeIdSchema['priceInfo'];
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
}

export default function ChallengePrice<
  T extends CreateChallengeReq | UpdateChallengeReq,
>({ defaultValue, setInput }: IChallengePriceProps<T>) {
  const priceInfo: ChallengeIdSchema['priceInfo'][0] = defaultValue?.[0] ?? {
    priceId: 0,
    accountType: 'HANA',
    challengeParticipationType: 'LIVE',
    challengePriceType: 'CHARGE',
    challengeUserType: 'BASIC',
    accountNumber: '',
    refund: 0,
    deadline: null,
    discount: 4000,
    price: 10000,
  };

  return (
    <div className="flex flex-col gap-3">
      <FormControl fullWidth size="small">
        <InputLabel id="challengePriceTypeLabel">금액유형</InputLabel>
        <Select
          labelId="challengePriceTypeLabel"
          id="challengePriceType"
          name="challengePriceType"
          label="금액유형"
          defaultValue={priceInfo.challengePriceType}
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                {
                  ...prev.priceInfo?.[0],
                  challengePriceType: e.target.value as 'CHARGE' | 'REFUND',
                },
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
        defaultValue={String(priceInfo.price)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: [
              {
                ...prev.priceInfo?.[0],
                charge: Number(e.target.value),
                priceInfo: {
                  ...prev.priceInfo?.[0].priceInfo,
                  price: Number(e.target.value),
                },
              },
            ],
          }));
        }}
      />
      {priceInfo.challengePriceType === 'REFUND' && (
        <Input
          label="베이직 보증금 금액"
          type="number"
          name="refund"
          size="small"
          placeholder="보증금 금액을 입력해주세요"
          defaultValue={String(priceInfo.refund)}
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                {
                  ...prev.priceInfo?.[0],
                  refund: Number(e.target.value),
                },
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
        defaultValue={String(priceInfo.discount)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: [
              {
                ...prev.priceInfo?.[0],
                priceInfo: {
                  ...prev.priceInfo?.[0].priceInfo,
                  discount: Number(e.target.value),
                },
              },
            ],
          }));
        }}
      />
    </div>
  );
}
