import { ReactNode } from 'react';

interface PaymentCardProps {
  title?: string;
  /** 제목 오른쪽 동작. 예: 신청자 정보의 "수정" */
  action?: ReactNode;
  children: ReactNode;
}

/** 결제 단계 카드 틀(신청자 정보, 결제 금액, 결제 수단, 동의) */
const PaymentCard = ({ title, action, children }: PaymentCardProps) => (
  <section className="border-neutral-80 rounded-md border p-4">
    {title ? (
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xsmall14 font-bold">{title}</h2>
        {action}
      </div>
    ) : null}
    {children}
  </section>
);

interface PaymentRowProps {
  label: ReactNode;
  value: ReactNode;
}

/** 카드 안 이름·값 한 줄 */
export const PaymentRow = ({ label, value }: PaymentRowProps) => (
  <div className="text-xsmall14 flex justify-between gap-3">
    <dt className="text-neutral-40 flex-none">{label}</dt>
    <dd className="break-keep text-right">{value}</dd>
  </div>
);

export default PaymentCard;
