import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import {
  ChallengeIdSchema,
  ChallengePriceReq,
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

const initialPrice: ChallengePriceReq = {
  challengeParticipationType: 'LIVE',
  challengePriceType: 'CHARGE',
  challengeUserType: 'BASIC',
  charge: 10000,
  priceInfo: {
    discount: 4000,
    price: 10000,
    deadline: '2024-10-10T00:00:00',
    accountNumber: '',
    accountType: 'HANA',
  },
  refund: 4000,
};

export default function ChallengePrice<
  T extends CreateChallengeReq | UpdateChallengeReq,
>({ defaultValue, setInput }: IChallengePriceProps<T>) {
  const defaultPriceReq: ChallengePriceReq = {
    challengeParticipationType:
      defaultValue?.[0]?.challengeParticipationType ??
      initialPrice.challengeParticipationType,
    challengePriceType:
      defaultValue?.[0]?.challengePriceType ?? initialPrice.challengePriceType,
    challengeUserType:
      defaultValue?.[0]?.challengeUserType ?? initialPrice.challengeUserType,
    charge: defaultValue?.[0]?.price ?? initialPrice.charge,
    priceInfo: {
      discount: defaultValue?.[0]?.discount ?? initialPrice.priceInfo.discount,
      price: defaultValue?.[0]?.price ?? initialPrice.priceInfo.price,
      deadline:
        defaultValue?.[0]?.deadline?.format('YYYY-MM-DDTHH:mm') ??
        initialPrice.priceInfo.deadline,
      accountNumber:
        defaultValue?.[0]?.accountNumber ??
        initialPrice.priceInfo.accountNumber,
      accountType:
        defaultValue?.[0]?.accountType ?? initialPrice.priceInfo.accountType,
    },
    refund: defaultValue?.[0]?.refund ?? initialPrice.refund,
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
          defaultValue={defaultPriceReq.challengePriceType}
          onChange={(e) => {
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                {
                  ...defaultPriceReq,
                  ...prev.priceInfo?.[0],
                  challengePriceType: e.target
                    .value as ChallengePriceReq['challengePriceType'],
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
        name="basicPrice"
        size="small"
        placeholder="이용료 금액을 입력해주세요"
        defaultValue={String(defaultPriceReq.charge)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: [
              {
                ...defaultPriceReq,
                ...prev.priceInfo?.[0],
                charge: Number(e.target.value),
                priceInfo: {
                  ...defaultPriceReq.priceInfo,
                  ...prev.priceInfo?.[0].priceInfo,
                  price: Number(e.target.value),
                },
              },
            ],
          }));
        }}
      />

      <Input
        label="베이직 보증금 금액 (유형이 보증금일 시)"
        name="refund"
        size="small"
        placeholder="보증금 금액을 입력해주세요"
        defaultValue={String(defaultPriceReq.refund)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: [
              {
                ...defaultPriceReq,
                ...prev.priceInfo?.[0],
                refund: Number(e.target.value),
              },
            ],
          }));
        }}
      />

      <Input
        label="베이직 할인 금액"
        name="discount"
        size="small"
        placeholder="할인 금액을 입력해주세요"
        defaultValue={String(defaultPriceReq.priceInfo.discount)}
        onChange={(e) => {
          setInput((prev) => ({
            ...prev,
            priceInfo: [
              {
                ...defaultPriceReq,
                ...prev.priceInfo?.[0],
                priceInfo: {
                  ...defaultPriceReq.priceInfo,
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
