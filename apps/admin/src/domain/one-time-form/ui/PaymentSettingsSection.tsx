import { FormControlLabel, Switch, TextField } from '@mui/material';

import type { SetOneTimeFormSettingsField } from '../hooks/useOneTimeFormSettings';
import type {
  OneTimeFormSettingsErrors,
  OneTimeFormSettingsValues,
} from '../types/oneTimeFormSettings';
import PriceTextField from './PriceTextField';

interface PaymentSettingsSectionProps {
  values: Pick<
    OneTimeFormSettingsValues,
    'isPaid' | 'basePrice' | 'paymentProductName'
  >;
  errors: OneTimeFormSettingsErrors;
  setField: SetOneTimeFormSettingsField;
}

/** PRD 14절. 유료 0원은 돈 없이 결제 흐름을 확인하는 테스트용이라 막지 않고 알리기만 한다 */
export const ZERO_PRICE_NOTICE =
  '0원 결제: 토스 없이 결제 흐름을 탑니다(테스트용)';

/** 결제 설정(시안 7절). 기본 정보와 같은 저장 버튼(A2·A4)으로 저장한다 */
const PaymentSettingsSection = ({
  values,
  errors,
  setField,
}: PaymentSettingsSectionProps) => {
  const showZeroPriceNotice = values.isPaid && values.basePrice === 0;

  return (
    <section className="flex flex-col gap-5">
      <h3 className="text-small18 text-neutral-0 font-bold">결제 설정</h3>
      <div className="flex items-start gap-3">
        <div className="flex flex-1 flex-col">
          <span className="text-xxsmall12 text-neutral-40">결제 받기</span>
          <FormControlLabel
            label={values.isPaid ? '유료' : '무료'}
            control={
              <Switch
                checked={values.isPaid}
                onChange={(e) => setField('isPaid', e.target.checked)}
                inputProps={{ 'aria-label': '결제 받기' }}
              />
            }
          />
        </div>
        <PriceTextField
          className="flex-1"
          label="기본 금액"
          value={values.basePrice}
          onChange={(price) => setField('basePrice', price)}
          error={!!errors.basePrice}
          helperText={
            errors.basePrice ??
            (showZeroPriceNotice ? ZERO_PRICE_NOTICE : undefined)
          }
        />
        <TextField
          className="flex-1"
          label="결제 화면 상품명"
          placeholder="비우면 폼 제목을 씁니다."
          value={values.paymentProductName}
          onChange={(e) => setField('paymentProductName', e.target.value)}
          error={!!errors.paymentProductName}
          helperText={errors.paymentProductName}
        />
      </div>
    </section>
  );
};

export default PaymentSettingsSection;
