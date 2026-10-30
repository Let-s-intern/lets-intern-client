'use client';

// 올인원패스 결제 화면의 VOD 이용권 추가 옵션 (LC-3533). 표시·문구는 챌린지 플랜 시트의 VOD 옵션과 같다.

import type { MembershipVodPassProduct } from '@/domain/all-in-one-pass/api/purchase';
import { EMPTY_VOD_PASS_SELECTION } from '@/domain/all-in-one-pass/store/useMembershipOrderStore';
import {
  getSelectableVodPassMonths,
  toVodPassOrderSelection,
  type VodPassOrderSelection,
} from '@/domain/all-in-one-pass/utils/vodPassOrder';
import {
  getVodPassMaxMonths,
  isVodPassPurchasable,
  supportsVodPassMonths,
  VOD_PASS_MIN_MONTHS,
} from '@/domain/program/vodPassPurchase';
import { twMerge } from '@/lib/twMerge';
import { Checkbox, FormControlLabel } from '@mui/material';

// 체크박스 색은 common/ControlLabel.tsx 와 같은 파란색을 쓰되, 해제 상태 테두리만 진하게 한다
const CHECKBOX_SX = {
  color: '#ACAFB6',
  '&.Mui-checked': {
    color: '#5177FF',
  },
};

const LABEL_SX = {
  m: 0,
  width: '100%',
  '.MuiFormControlLabel-label': {
    flex: 1,
    minWidth: 0,
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#2A2D34',
    fontFamily: 'Pretendard Variable',
  },
};

const STEPPER_BUTTON_CLASS =
  'border-neutral-80 text-neutral-10 disabled:text-neutral-60 flex h-8 w-8 items-center justify-center rounded-xs border bg-white text-base font-bold disabled:cursor-not-allowed';

export const VOD_PASS_UNAVAILABLE_MESSAGE =
  '보유한 VOD 이용권 기간이 최대 이용 기간에 도달해 더 구매할 수 없어요';

interface Props {
  /** 신청폼의 VOD 이용권 상품. 판매가 꺼졌으면 null·undefined 이고 아무것도 그리지 않는다 */
  product: MembershipVodPassProduct | null | undefined;
  /** 스토어에 담긴 선택 개월 수. 미선택이면 null */
  selectedMonths: number | null;
  onChange: (selection: VodPassOrderSelection) => void;
}

export default function VodPassOption({
  product,
  selectedMonths,
  onChange,
}: Props) {
  if (!product) {
    return null;
  }

  const purchasable = isVodPassPurchasable(product);
  const checked = purchasable && selectedMonths != null;
  const months = getSelectableVodPassMonths(
    product,
    selectedMonths ?? VOD_PASS_MIN_MONTHS,
  );
  const maxMonths = getVodPassMaxMonths(product);
  const { vodPassPrice, vodPassDurationDays } = toVodPassOrderSelection(
    product,
    months,
  );
  const additionalMonthPrice = product.additionalMonthPrice ?? 0;

  const handleCheck = (nextChecked: boolean) => {
    // disabled 체크박스도 이벤트가 들어오는 환경이 있어 한 번 더 막는다
    if (!purchasable) return;
    onChange(
      nextChecked
        ? toVodPassOrderSelection(product, months)
        : EMPTY_VOD_PASS_SELECTION,
    );
  };

  return (
    <div>
      <span className="text-xsmall14 mb-3 block font-semibold">
        VOD 이용권 추가 (선택)
      </span>
      <div
        className={twMerge(
          'rounded-xs overflow-hidden border transition-colors',
          checked
            ? 'border-primary bg-primary-5'
            : 'border-neutral-80 hover:bg-neutral-100',
          !purchasable && 'opacity-60 hover:bg-transparent',
        )}
      >
        <FormControlLabel
          className="py-3 pl-2 pr-3"
          sx={LABEL_SX}
          checked={checked}
          disabled={!purchasable}
          onChange={(_, next) => handleCheck(next)}
          control={<Checkbox size="small" sx={CHECKBOX_SX} />}
          label={
            <span className="flex w-full items-center justify-between gap-3">
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <b className="font-bold">{product.title}</b>
                  <span
                    className={twMerge(
                      'text-xxsmall12 text-primary rounded-full px-2 py-0.5 font-medium',
                      checked ? 'bg-static-100' : 'bg-primary-10',
                    )}
                  >
                    {vodPassDurationDays}일 이용권
                  </span>
                </span>
                <span className="text-xxsmall12 text-neutral-30 mt-1 block font-normal leading-5">
                  {purchasable
                    ? '결제 즉시 이용이 시작됩니다. 이용 중인 이용권이 있으면 종료 후 이어서 시작됩니다'
                    : VOD_PASS_UNAVAILABLE_MESSAGE}
                </span>
              </span>
              <span
                className={twMerge(
                  'text-xsmall14 flex shrink-0 items-baseline font-bold',
                  checked ? 'text-primary' : 'text-neutral-10',
                )}
              >
                <span aria-hidden="true">+</span>
                <span>{(vodPassPrice ?? 0).toLocaleString()}원</span>
              </span>
            </span>
          }
        />
        {checked && supportsVodPassMonths(product) && (
          <div className="border-primary-20 flex items-center justify-between gap-3 border-t px-3 py-3">
            <span className="min-w-0">
              <span className="text-xsmall14 block font-medium">이용 기간</span>
              {additionalMonthPrice > 0 && (
                <span className="text-xxsmall12 text-neutral-30 mt-0.5 block">
                  2개월부터 매월 +{additionalMonthPrice.toLocaleString()}원
                </span>
              )}
              <span className="text-xxsmall12 text-neutral-30 mt-0.5 block">
                최대 {maxMonths}개월까지 선택할 수 있어요
              </span>
            </span>
            <span className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="이용 개월 수 줄이기"
                className={STEPPER_BUTTON_CLASS}
                disabled={months <= VOD_PASS_MIN_MONTHS}
                onClick={() =>
                  onChange(toVodPassOrderSelection(product, months - 1))
                }
              >
                -
              </button>
              <span
                className="text-xsmall14 min-w-[3.5rem] text-center font-semibold"
                aria-live="polite"
              >
                {months}개월
              </span>
              <button
                type="button"
                aria-label="이용 개월 수 늘리기"
                className={STEPPER_BUTTON_CLASS}
                disabled={months >= maxMonths}
                onClick={() =>
                  onChange(toVodPassOrderSelection(product, months + 1))
                }
              >
                +
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
