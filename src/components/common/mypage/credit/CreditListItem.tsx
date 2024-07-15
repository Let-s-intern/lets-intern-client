import { PaymentType } from '../../../../api/paymentSchema';

const CreditListItem = ({ payment }: { payment: PaymentType }) => {
  return (
    <div>
      <div>{payment.tossInfo.status}</div>
      <div>
        <img src={payment.programInfo.thumbnail || ''} />
        <div>
          <div>{payment.programInfo.title}</div>
          <div>
            <div>{payment.programInfo.price}</div>
            <div>{payment.tossInfo.totalAmount}</div>
          </div>
          <div>결제상세</div>
        </div>
      </div>
    </div>
  );
};

export default CreditListItem;
