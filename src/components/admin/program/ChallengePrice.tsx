import { ChallengeOption } from '@/api/challengeOptionSchema';
import {
  ChallengeIdSchema,
  ChallengePriceReq,
  CreateChallengeReq,
  UpdateChallengeReq,
} from '@/schema';
import { newProgramFeeTypeToText } from '@/utils/convert';
import Input from '@components/ui/input/Input';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';
import { useState } from 'react';

interface IChallengePriceProps<
  T extends CreateChallengeReq | UpdateChallengeReq,
> {
  defaultValue?: ChallengeIdSchema['priceInfo'];
  setInput: React.Dispatch<React.SetStateAction<Omit<T, 'desc'>>>;
  defaultPricePlan: string;
  options: ChallengeOption[];
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
  refund: 0,
};

const pricePlanMenuList = {
  베이직: '베이직',
  '베이직+스탠다드': '베이직+스탠다드',
  '베이직+스탠다드+프리미엄': '베이직+스탠다드+프리미엄',
};

const priceTypeMenuList = {
  CHARGE: newProgramFeeTypeToText['CHARGE'],
  REFUND: newProgramFeeTypeToText['REFUND'],
};

export default function ChallengePrice<
  T extends CreateChallengeReq | UpdateChallengeReq,
>({
  defaultValue,
  setInput,
  defaultPricePlan,
  options,
}: IChallengePriceProps<T>) {
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

  const generateOptionMenuList = () => {
    const result: Record<string, string> = {};
    options.forEach(
      (item) =>
        (result[item.challengeOptionId] =
          `[${item.challengeOptionId}] ${item.title}`),
    );
    return result;
  };

  // 보증금 인풋 표시/숨김 용도
  const [isDeposit, setIsDeposit] = useState(
    defaultPriceReq.challengePriceType === 'REFUND',
  );
  const [pricePlanValue, setPricePlanValue] = useState(defaultPricePlan);
  const [standardOptions, setStandardOptions] = useState<string[]>([]); // TODO: 상위 컴포넌트로 이동
  const [premiumOptions, setPremiumOptions] = useState<string[]>([]); // TODO: 상위 컴포넌트로 이동

  return (
    <div className="flex flex-col gap-3">
      {/* 가격 플랜 */}
      <SelectControl
        labelId="challengePricePlanLabel"
        id="challengePricePlan"
        name="challengePricePlan"
        label="가격 플랜"
        defaultValue="베이직"
        value={pricePlanValue}
        menuList={pricePlanMenuList}
        onChange={(e) => {
          setPricePlanValue(e.target.value as string);
          // TODO: 스탠다드, 프리미엄 옵션 초기화
        }}
      />
      {/* 금액 유형 */}
      <SelectControl
        labelId="challengePriceTypeLabel"
        id="challengePriceType"
        name="challengePriceType"
        label="금액 유형"
        defaultValue={defaultPriceReq.challengePriceType}
        menuList={priceTypeMenuList}
        onChange={(e) => {
          const value = e.target.value;

          setIsDeposit(value === 'REFUND');

          if (value === 'CHARGE') {
            // 이용료 선택 시 보증금 금액 0으로 초기화
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                {
                  ...defaultPriceReq,
                  ...prev.priceInfo?.[0],
                  refund: 0,
                  challengePriceType:
                    value as ChallengePriceReq['challengePriceType'],
                },
              ],
            }));
          } else {
            setInput((prev) => ({
              ...prev,
              priceInfo: [
                {
                  ...defaultPriceReq,
                  ...prev.priceInfo?.[0],
                  challengePriceType:
                    value as ChallengePriceReq['challengePriceType'],
                },
              ],
            }));
          }
        }}
      />
      {/* 이용료 금액 */}
      <Input
        label="이용료 금액"
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
      {/* 보증금 금액 */}
      {isDeposit && (
        <Input
          label="보증금 금액"
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
      )}
      {/* 할인 금액 */}
      <Input
        label="할인 금액"
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
      {/* 스탠다드 옵션 */}
      {pricePlanValue.includes('스탠다드') && (
        <>
          <SelectControl
            labelId="standardOptionsLabel"
            id="standardOptions"
            name="standardOptions"
            label="스탠다드 옵션"
            multiple
            value={standardOptions}
            renderValue={() => standardOptions.join(', ')}
            menuList={generateOptionMenuList()}
            onChange={(e) => {
              const value = e.target.value as string[];
              setStandardOptions(value);
            }}
          />
          <Input
            label="스탠다드 플랜명"
            name="standardTitle"
            size="small"
            placeholder="스탠다드 플랜명을 입력해주세요"
          />
        </>
      )}
      {/* 프리미엄 옵션 */}
      {pricePlanValue.includes('프리미엄') && (
        <>
          <SelectControl
            labelId="premiumOptionsLabel"
            id="premiumOptions"
            name="premiumOptions"
            label="프리미엄 옵션"
            multiple
            value={premiumOptions}
            renderValue={() => premiumOptions.join(', ')}
            menuList={generateOptionMenuList()}
            onChange={(e) => {
              const value = e.target.value as string[];
              setPremiumOptions(value);
            }}
          />
          <Input
            label="프리미엄 플랜명"
            name="premiumTitle"
            size="small"
            placeholder="프리미엄 플랜명을 입력해주세요"
          />
        </>
      )}
      <p>
        <b>최종금액</b>: 86,000원 (보증금 포함)
      </p>
    </div>
  );
}

function SelectControl({
  menuList,
  labelId,
  label,
  multiple,
  value,
  ...restProps
}: { menuList: Record<string, string> } & SelectProps) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select multiple={multiple} {...restProps} value={value}>
        {Object.entries(menuList).map(([optValue, optCaption]) => (
          <MenuItem key={optValue} value={optValue}>
            {multiple && (
              <Checkbox
                checked={(value as Array<string>).includes(optValue)}
                sx={{ padding: 0, margin: '1px 0', marginRight: '4px' }}
                size="small"
              />
            )}
            <span>{optCaption}</span>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
