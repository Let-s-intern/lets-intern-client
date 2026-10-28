import { Check } from 'lucide-react';
import { ReactNode } from 'react';
import PaymentCard from './PaymentCard';

// 시안 2절 결제 단계의 필수 동의 3종
export const PAYMENT_CONSENTS = [
  { id: 'privacy', label: '[필수] 개인정보 수집 및 이용 동의' },
  { id: 'refund', label: '[필수] 환불 규정 확인' },
  { id: 'paymentAgency', label: '[필수] 결제 대행 서비스 이용 동의' },
] as const;

export type PaymentConsentId = (typeof PAYMENT_CONSENTS)[number]['id'];
export type PaymentConsentState = Record<PaymentConsentId, boolean>;

export const NO_PAYMENT_CONSENTS: PaymentConsentState = {
  privacy: false,
  refund: false,
  paymentAgency: false,
};

export const isAllConsented = (state: PaymentConsentState) =>
  PAYMENT_CONSENTS.every(({ id }) => state[id]);

interface ConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size: 'lg' | 'sm';
  className: string;
  children: ReactNode;
}

export const ConsentCheckbox = ({
  checked,
  onChange,
  size,
  className,
  children,
}: ConsentCheckboxProps) => (
  <label className={`flex cursor-pointer items-center gap-2.5 ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="peer sr-only"
    />
    <span
      aria-hidden
      className={`border-neutral-70 peer-checked:border-primary peer-checked:bg-primary text-static-100 peer-focus-visible:ring-primary grid flex-none place-items-center border-[1.5px] peer-focus-visible:ring-2 ${
        size === 'lg' ? 'h-5 w-5 rounded-full' : 'rounded-xxs h-4 w-4'
      }`}
    >
      <Check size={size === 'lg' ? 12 : 10} strokeWidth={3.2} />
    </span>
    {children}
  </label>
);

interface PaymentConsentsProps {
  value: PaymentConsentState;
  onChange: (next: PaymentConsentState) => void;
}

/** "모두 동의합니다"와 필수 동의 3종. 모두 체크해야 결제 버튼이 열린다 */
const PaymentConsents = ({ value, onChange }: PaymentConsentsProps) => {
  const setAll = (checked: boolean) =>
    onChange({ privacy: checked, refund: checked, paymentAgency: checked });

  return (
    <PaymentCard>
      <ConsentCheckbox
        checked={isAllConsented(value)}
        onChange={setAll}
        size="lg"
        className="text-xsmall14 font-bold"
      >
        모두 동의합니다
      </ConsentCheckbox>
      <div className="border-neutral-85 mt-3 grid gap-2.5 border-t pt-3">
        {PAYMENT_CONSENTS.map(({ id, label }) => (
          <ConsentCheckbox
            key={id}
            checked={value[id]}
            onChange={(checked) => onChange({ ...value, [id]: checked })}
            size="sm"
            className="text-xxsmall12 text-neutral-35"
          >
            {label}
          </ConsentCheckbox>
        ))}
      </div>
    </PaymentCard>
  );
};

export default PaymentConsents;
