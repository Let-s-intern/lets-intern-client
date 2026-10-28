import { formatWon, type PaymentAmountSummary } from '../utils/paymentAmount';
import PaymentCard, { PaymentRow } from './PaymentCard';

interface PaymentAmountCardProps {
  summary: PaymentAmountSummary;
}

/** 기본 금액, 고른 옵션 줄, 최종 결제 금액 */
const PaymentAmountCard = ({ summary }: PaymentAmountCardProps) => (
  <PaymentCard title="결제 금액">
    <dl className="space-y-2">
      <PaymentRow
        label={summary.productName}
        value={formatWon(summary.basePrice)}
      />
      {summary.optionLines.map((line) => (
        <PaymentRow
          key={line.optionId}
          label={
            <>
              {line.optionName}
              <span className="text-xxsmall12 text-neutral-45 block">
                {line.groupTitle}
              </span>
            </>
          }
          value={formatWon(line.additionalPrice)}
        />
      ))}
    </dl>
    <dl className="border-neutral-85 mt-3.5 border-t pt-3.5">
      <div className="flex items-center justify-between gap-3">
        <dt className="text-xsmall14 text-neutral-0 font-semibold">
          최종 결제 금액
        </dt>
        <dd className="text-small20 text-primary font-bold">
          {formatWon(summary.totalPrice)}
        </dd>
      </div>
    </dl>
  </PaymentCard>
);

export default PaymentAmountCard;
