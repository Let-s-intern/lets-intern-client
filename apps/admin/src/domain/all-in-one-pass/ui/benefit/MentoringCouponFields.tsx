import {
  BenefitCouponDiscountType,
  BenefitCouponSetting,
} from '@/domain/all-in-one-pass/types';
import { Checkbox, FormControlLabel, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

interface Props {
  /** 초기값(수정 시 프리필). 대상이 바뀔 때 key 로 remount 하여 재초기화 */
  initial: BenefitCouponSetting | null;
  /** 미완성(할인 유형 미선택)이면 null 을 넘긴다 */
  onChange: (coupon: BenefitCouponSetting | null) => void;
}

/** 1:1 LIVE 멘토링 쿠폰 설정 입력 (할인 유형 · 값 · 횟수/무제한). count 음수 = 무제한 */
export default function MentoringCouponFields({ initial, onChange }: Props) {
  // 신규 추가 시엔 예시값 없이 빈 상태로 시작(할인 유형 미선택 · 횟수 빈칸)
  const [discountType, setDiscountType] = useState<
    '' | BenefitCouponDiscountType
  >(initial?.discountType ?? '');
  const [value, setValue] = useState(
    initial?.value != null ? String(initial.value) : '',
  );
  const [count, setCount] = useState(
    initial && initial.count >= 0 ? String(initial.count) : '',
  );
  const [isUnlimited, setIsUnlimited] = useState(
    initial ? initial.count < 0 : false,
  );

  useEffect(() => {
    if (discountType === '') {
      onChange(null);
      return;
    }
    onChange({
      discountType,
      value: discountType === 'FULL' ? null : Number(value) || 0,
      count: isUnlimited ? -1 : Number(count) || 0,
      // 쿠폰 메타(id·code)는 편집 대상이 아니라 초기값 그대로 통과
      couponId: initial?.couponId,
      couponCode: initial?.couponCode,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discountType, value, count, isUnlimited]);

  return (
    <>
      <TextField
        select
        label="할인 유형"
        value={discountType}
        onChange={(e) =>
          setDiscountType(e.target.value as BenefitCouponDiscountType)
        }
        size="small"
        fullWidth
      >
        <MenuItem value="FULL">전액</MenuItem>
        <MenuItem value="PERCENT">할인율(%)</MenuItem>
        <MenuItem value="AMOUNT">금액(원)</MenuItem>
      </TextField>
      {(discountType === 'PERCENT' || discountType === 'AMOUNT') && (
        <TextField
          label={discountType === 'PERCENT' ? '할인율(%)' : '할인 금액(원)'}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="small"
          fullWidth
        />
      )}
      <div className="flex items-center gap-2">
        <TextField
          label="사용 가능 횟수"
          type="number"
          value={count}
          onChange={(e) => setCount(e.target.value)}
          size="small"
          fullWidth
          disabled={isUnlimited}
        />
        <FormControlLabel
          className="shrink-0 whitespace-nowrap"
          control={
            <Checkbox
              size="small"
              checked={isUnlimited}
              onChange={(e) => {
                setIsUnlimited(e.target.checked);
                if (e.target.checked) setCount(''); // 무제한 선택 시 횟수 초기화
              }}
            />
          }
          label="무제한"
        />
      </div>
    </>
  );
}
